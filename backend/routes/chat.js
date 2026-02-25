import mongoClient from '../database.js'
import { verifyToken } from "../middleware/auth.js";

import express from 'express'
import { ObjectId } from "mongodb";
const router = express.Router();
import openAIClient from '../openAI.js';

/*
Gonna explain how chat works since it's kinda complex xd

For buyer, you'd initially need your userID and the itemID to chat. 
You don't know the userID of the seller yet so leave otherUserID as empty.
/metadata will return the userID of the seller for the receiver attribute for sending a message,
along with stuff like the name of the seller and their pfp

For seller, you'd also need otherUserID which the Chats page will provide,
since one item can have multiple buyers so you'd need to specify who.

A minimal chat object/document is: {
    _id: str,
    itemID: str -> ObjectId
    sender: str -> ObjectId -> who sent this
    receiver: str -> ObjectId -> purely for seller specifying which buyer for the same itemID,
      buyer might not need this, but kept it for simplicity for backend
    timepoint: Date
}
*/

function isValidObjectIDConstructor(value){
    /*
    Validates if value is valid for constructing MongoDB ObjectId.
    Returns bool -> true if yes
    */
    const OBJECTID_STRING_SIZE = 24;
    if((typeof value) === "string")
        if(value.trim().length === OBJECTID_STRING_SIZE) return true;
    else if((typeof value) === "number"){
        const isValidUnixEpoch = value.isInteger() && value >= 0;
        if(isValidUnixEpoch) return true;
    }
    return false;
}

router.get('/metadata', verifyToken, async (request, response) => {
    /*
    Endpoint for retreiving data related to the chat. 
    If otherUserID is empty, the function treats the other user as the item seller.
    
    input:
    headers: {
        Authorization: JWTToken,
        itemID: str -> string of ObjectID of the other item,
        otherUserID: str, '' -> string of ObjectID of the other user,
        itemName: str,
    }

    Returns:
    - HTTP status 200 with: {
        selfIsSeller: bool,
        otherUserName: str,
        otherUserProfilePictureURL: str,
        otherUserID: str -> string of ObjectID of the other user
    }
    - HTTP status 400 with .message if attibutes in the request header are invalid
    - HTTP status 401 with .message if JWT token is invalid
    - HTTP status 500 for undocumented errors
    */
    
    const HTTP_STATUS_FOR_BAD_REQUEST = 400;
    const HTTP_STATUS_FOR_UNAUTHORIZED = 401;

    const {userId} = request.user;
    const {itemid, otheruserid} = request.headers;
    
    if(!isValidObjectIDConstructor(userId))
        return response.status(HTTP_STATUS_FOR_UNAUTHORIZED).json({message: "Invalid userID from JWT Token."});
    if(!isValidObjectIDConstructor(itemid))
        return response.status(HTTP_STATUS_FOR_BAD_REQUEST).json({message: "Invalid itemid from request header."});
    if(otheruserid && !isValidObjectIDConstructor(otheruserid))
        return response.status(HTTP_STATUS_FOR_BAD_REQUEST).json({message: "Invalid otheruserid from request header."});    
    
    const itemCollection = mongoClient.db("Item").collection("Item");
    const item = await itemCollection.findOne({_id: new ObjectId(itemid)});
    if(!item) return response.status(HTTP_STATUS_FOR_BAD_REQUEST).json({message: "Invalid itemid from request header."});
    
    let otherUser;
    const userCollection = mongoClient.db("User").collection("User");
    if(otheruserid) 
        otherUser = await userCollection.findOne({_id: new ObjectId(otheruserid)});
    else otherUser = await userCollection.findOne({_id: new ObjectId(item.ownerId)});

    if(!otherUser) return response.status(HTTP_STATUS_FOR_BAD_REQUEST).json({message: "Invalid otheruserid from request header."});
    
    response.json({
        selfIsSeller: item.ownerId === userId,
        otherUserName: otherUser.name,
        otherUserProfilePictureURL: otherUser.profilePicture,
        otherUserID: otherUser._id,
        itemName: item.name,
        isReadOnly: item.status === "sold",
    });
});

router.get('/', verifyToken, async (request, response) => {
    /*
    Endpoint for users to retrieve chat objects using item id and their JWT token.
    Leaving otherUserID empty will assume that the request is from a buyer,
    which the item seller and their ID could be figured out by the endpoint.
    
    input:
    headers: {
        Authorization: JWTToken,
        itemID: str -> string of ObjectID of the item
        otherUserID: str, '' -> string of ObjectID of the other user
    }
    
    Returns:
    - HTTP status 200 with: [
        {
            sender: str -> string of ObjectId of the user who send the message
            receiver: str -> string of ObjectId of the user who should receive the message
            timepoint: Date,
            content: str[1-256]
        },
        ...
    ]
    - HTTP status 400 with .message if itemID is not in valid form
    - HTTP status 401 with .message if user JWTToken is invalid
    - HTTP status 500 for undocumented errors
    */
   
    const HTTP_STATUS_FOR_BAD_REQUEST = 400;
    const HTTP_STATUS_FOR_UNAUTHORIZED = 401;

    const {userId} = request.user;
    let {itemid, otheruserid} = request.headers;
    
    if(!isValidObjectIDConstructor(userId))
        return response.status(HTTP_STATUS_FOR_UNAUTHORIZED).json({message: "Invalid userID form from JWT Token."});
    if(!isValidObjectIDConstructor(itemid))
        return response.status(HTTP_STATUS_FOR_BAD_REQUEST).json({message: "Invalid itemid form from request header."});    
    if(otheruserid && !isValidObjectIDConstructor(otheruserid))
        return response.status(HTTP_STATUS_FOR_BAD_REQUEST).json({message: "Invalid otheruserid from request header."});    

    if(!otheruserid){
        const itemCollection = mongoClient.db("Item").collection("Item");
        const item = await itemCollection.findOne({_id: new ObjectId(itemid)});
        otheruserid = item.ownerId;
    }

    const EARLIER_FIRST = 1;
    const chatCollection = mongoClient.db("Chat").collection("Chat");
    const chatsIterator = chatCollection.find({
        itemID: itemid,
        $or: [
            {$and: [{sender: userId}, {receiver: otheruserid}]},
            {$and: [{sender: otheruserid}, {receiver: userId}]}
        ]
    });

    const chats = [];
    for await(const chat of chatsIterator)
        chats.push(chat);
    
    response.json(chats);
});

router.post('/', verifyToken, async (request, response) => {
   /*
    Endpoint for user to post a message. If .message is empty, the message is not stored.
    For first message on an item from buyer, LLM will adjust their preference attribute to take the item into account.
    
    Input:
    headers: {Authorization: JWTToken}
    body: {
        itemID: str -> ObjectId of the item the user is chatting about
        receiver: str -> string of ObjectId of the user who should receive the message
        message: str[1-256]
    }
    
    Returns:
    - HTTP status 200 if message is saved
    - HTTP status 204 if .message attribute is empty
    - HTTP status 400 with .message if itemID is not in valid form
    - HTTP status 401 with .message if user JWTToken is invalid
    - HTTP status 500 with .message describing write error on database
    - HTTP status 500 for undocumented errors
    */
    
    async function adjustUserPreferenceString(originalPreference, itemSummary){
      const response = await openAIClient.responses.create({
          model: "gpt-4.1-nano",
          input: `
          Given that the orignal user preference is: "${originalPreference}",
          and the summary of the item they are potentially interested is "${itemSummary}",
          return a user preference text that takes the item into account in less than 15 words.
          Do not return sentences, only keywords without adjectives and give the item equal priority to original preference.
          The keywords from the item should be no more than 3.
          `
      });
      return response.output_text.trim().substr(0, 64);
    }
    
    const HTTP_STATUS_OK = 200;
    const HTTP_STATUS_FOR_NO_CONTENT = 204;
    const HTTP_STATUS_FOR_BAD_REQUEST = 400;
    const HTTP_STATUS_FOR_UNAUTHORIZED = 401;
    const HTTP_STATUS_FOR_SERVER_ERROR = 500;
    
    const FIRST_CHARACTER = 0;
    const MAX_MESSAGE_CHARACTERS = 255;
   
    const {userId} = request.user;
    const {itemID, message, receiver} = request.body;

    if(!isValidObjectIDConstructor(userId))
        return response.status(HTTP_STATUS_FOR_UNAUTHORIZED).json({message: "Invalid userID form from JWT Token."});
    if(!isValidObjectIDConstructor(itemID))
        return response.status(HTTP_STATUS_FOR_BAD_REQUEST).json({message: "Invalid itemID form in request."}); 
    if(!isValidObjectIDConstructor(receiver))
        return response.status(HTTP_STATUS_FOR_BAD_REQUEST).json({message: "Invalid receiver form in request."}); 
 
    const trimmedMessage = message.trim().substr(FIRST_CHARACTER, MAX_MESSAGE_CHARACTERS);
    const emptyMessage = trimmedMessage.length < 1;
    if(emptyMessage) return response.status(HTTP_STATUS_FOR_NO_CONTENT).json({});
    
    const chatCollection = mongoClient.db("Chat").collection("Chat");
    const itemCollection = mongoClient.db("Item").collection("Item");
    const item = await itemCollection.findOne({_id: new ObjectId(itemID)});
    const chatIsReadOnly = item.status === "sold"
    if(chatIsReadOnly)
        return response.status(HTTP_STATUS_FOR_BAD_REQUEST).json({message: "Chat is now read only."});
    
    const chat = await chatCollection.findOne({
        itemID: itemID,
        $or: [
            {$and: [{sender: userId}, {receiver: receiver}]},
            {$and: [{sender: receiver}, {receiver: userId}]}
        ]
    });
    const isFirstMessage = (chat === null);
    
    if(isFirstMessage){
      const userCollection = mongoClient.db("User").collection("User");
      const itemCollection = mongoClient.db("Item").collection("Item");
      const user = await userCollection.findOne({_id: new ObjectId(userId)});
      
      const userIsBuyer = item.ownerId !== userId;
      if(userIsBuyer){
        await userCollection.updateOne(
          {_id: new ObjectId(userId)}, 
          {$set: {preferences: await adjustUserPreferenceString(user.preferences || '', item.summary)}}
        )
      }
    }
    
    const {acknowledged} = await chatCollection.insertOne({
        sender: userId, 
        receiver: receiver,
        itemID: itemID,
        timepoint: new Date(), 
        content: message
    });
    
    if(acknowledged) return response.status(HTTP_STATUS_OK).json({});
    else return response.status(HTTP_STATUS_FOR_SERVER_ERROR).json({message: "Database did not acknowledge write request."});
});


router.get('/preview', verifyToken, async (request, response) => {
    /*
    Endpoint for returning chat previews for the Chats page.
    
    Input:
    - headers: {Authorization: JWTToken}
    
    Returns:
    - HTTP status 200 with [
        {
            lastMessage: str[1-255],
            itemName: str,
            itemID: str -> ObjectId of the item the user is chatting about,
            otherUserID: str -> ObjectId of the other User in the chat,
            itemStatus: str -> from Item.status
        },
        ...
    ]
    - HTTP status 401 with .message if user JWTToken is invalid    
    - HTTP status 500 for undocumented errors    
    */

    const LATER_FIRST = -1;
    const HTTP_STATUS_FOR_UNAUTHORIZED = 401;    

    const {userId} = request.user;

    if(!isValidObjectIDConstructor(userId))
        return response.status(HTTP_STATUS_FOR_UNAUTHORIZED).json({message: "Invalid userID form from JWT Token."});
    
    const chatCollection = mongoClient.db("Chat").collection("Chat");
    const userCollection = mongoClient.db("User").collection("User");

    const chatsWithUserIterator = chatCollection.find({
        $or: [{sender: userId}, {receiver: userId}]
    }).sort({timepoint: LATER_FIRST});
    
    const chatPreviewObjects = [];
    //worst case O(n^2) i should kms
    for await(const chat of chatsWithUserIterator){
        let skipChatElement = false;
        
        for(const chatPreview of chatPreviewObjects){
            const betweenSameRecipients = ((chatPreview.otherUserID === chat.sender) && (userId === chat.receiver))
                                            || ((chatPreview.otherUserID === chat.receiver) && (userId === chat.sender));
            const latestMessageAlreadyStored = (chatPreview.itemID === chat.itemID) && betweenSameRecipients;
            if(latestMessageAlreadyStored){
                skipChatElement = true;
                break;
            }
        }
        if(skipChatElement) continue;
        const senderUserObject = await userCollection.findOne({_id: new ObjectId(chat.sender)});
        
        chatPreviewObjects.push({
            lastMessage: chat.content,
            itemID: chat.itemID,
            otherUserID: ((chat.sender === userId) ? chat.receiver : chat.sender),
            senderName: senderUserObject.name,
            timepoint: chat.timepoint,
        });
    }
    const itemCollection = mongoClient.db("Item").collection("Item");
    for(const chatPreview of chatPreviewObjects){
      const item = await itemCollection.findOne({_id: new ObjectId(chatPreview.itemID)});
      chatPreview.itemName = item.name;
      chatPreview.itemImageURL = item.imageURL;
      chatPreview.itemStatus = item.status 
    }
    
    response.json(chatPreviewObjects);
});

export default router;