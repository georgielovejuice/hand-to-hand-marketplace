import mongoClient from '../database.js'
import { verifyToken } from "../middleware/auth.js";

import express from 'express'
import { ObjectId } from "mongodb";
const router = express.Router();

router.get('/metadata', verifyToken, async (request, response) => {
    /*
    Endpoint for retreiving data related to the chat. 
    If otherUserID is empty, the function treats the other user as the item seller.
    
    input:
    headers: {
        Authorization: JWTToken,
        itemID: str -> string of ObjectID of the other item,
        otherUserID: str, '' -> string of ObjectID of the other user,
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
        otherUserID: otherUser._id
    });
});

router.get('/', verifyToken, async (request, response) => {
    /*
    Endpoint for users to retrieve chat objects using item id and their JWT token.
    
    input:
    headers: {
        Authorization: JWTToken,
        itemID: str -> string of ObjectID of the item
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
    const {itemid} = request.headers;
    
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
    
    if(!isValidObjectIDConstructor(userId))
        return response.status(HTTP_STATUS_FOR_UNAUTHORIZED).json({message: "Invalid userID form from JWT Token."});
    if(!isValidObjectIDConstructor(itemid))
        return response.status(HTTP_STATUS_FOR_BAD_REQUEST).json({message: "Invalid itemid form from request header."});    

    const EARLIER_FIRST = 1;
    const chatCollection = mongoClient.db("Chat").collection("Chat");
    const chatsWithMatchingItemAndUserIterator = chatCollection.find({
        itemID: itemid,
        $or: [{sender: userId}, {receiver: userId}]
    });
    
    const chats = [];
    for await(let chat of chatsWithMatchingItemAndUserIterator)
        chats.push(chat);
    
    response.json(chats);
});

router.post('/', verifyToken, async (request, response) => {
   /*
    Endpoint for user to post a message. If .message is empty, the message is not stored.
    
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
    
    const HTTP_STATUS_OK = 200;
    const HTTP_STATUS_FOR_NO_CONTENT = 204;
    const HTTP_STATUS_FOR_BAD_REQUEST = 400;
    const HTTP_STATUS_FOR_UNAUTHORIZED = 401;
    const HTTP_STATUS_FOR_SERVER_ERROR = 500;
    
    const FIRST_CHARACTER = 0;
    const MAX_MESSAGE_CHARACTERS = 255;
   
    const {userId} = request.user;
    const {itemID, message, receiver} = request.body;
    
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

export default router;