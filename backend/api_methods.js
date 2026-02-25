import { ObjectId } from "mongodb";
import openAIClient from './openAI.js';

export async function queryItems(parsedObject, itemCollection, userCollection, response) {
	/*
	Endpoint for returning search/query for Browse Page.
	First it filters items using mongo DB query with the .query attribute;
	then if the .searchBarText is empty, it returns the Items Objects from the query directly.
	If .searchBarText is not empty, every word in it is searched against an item's title, category or details text,
	an item which does not have any word matching to .searchBarText is discarded, others are returned.
	
	Expected parsedObject = {
		searchBarText: str,
		query: {
			(argument for mongoDB .find )
		}
    userID: str -> ObjectId of a User object
	}
		
	Responds with:
	- HTTP status 200 with {
		[
			{
				...Database Item object which conforms to the client query
			}
			...
		]
	}
	
	- HTTP status 500 for undocumented errors
	
	May throw undocumented exceptions
	*/
  
  async function suggestItemOrder(items, searchtext){
    const response = await openAIClient.responses.create({
        model: "gpt-4.1-nano",
        input: `
        Based on the text "${searchtext}", sort the _id of the following items based on how much of its summary attribute matches the text.
        Return only sorted _ids as an Array of strings with no other text, warnings or suggestions.
        Items: ${items}
        `
    });
    return response.output_text;
  }

  // ---- validation ----
  if (typeof parsedObject.searchBarText !== "string")
    throw new SyntaxError("searchBarText must be string");

  if (!(parsedObject.query instanceof Object))
    throw new SyntaxError("query must be an object");
  
  if((typeof parsedObject.userID) !== "string")
    throw new SyntaxError("userID must be string");

  const user = await userCollection.findOne({_id: new ObjectId(parsedObject.userID)});
  const userItemPreferences = user ? user.preferences : null;

  // ---- fetch items ----
  const cursor = itemCollection.find(parsedObject.query);
  const items = [];
  const itemsForLLMSuggestions = [];
  
  for await(const item of cursor){
    items.push({...item, _id: item._id.toString()});
    if(item.status !== "sold")
      itemsForLLMSuggestions.push(`_id: ${item._id}, summary: ${item.summary}`);
  }

  let itemIDsString = "[]";
  if (items.length > 0)
    itemIDsString = await suggestItemOrder(itemsForLLMSuggestions, (
      parsedObject.searchBarText.trim()
      || userItemPreferences
      || "No preference, list everything."
    ));

  let suggestedItemIDs = [];
  try{
    suggestedItemIDs = JSON.parse(itemIDsString)
    if(!(suggestedItemIDs instanceof Array)) throw new SyntaxError;
  }catch(err){
    console.log("Could not parse item ID array from LLM: " + itemIDsString);
    console.log("\tReturning unpersonalised items...");
  }
  
  const exportingItems = [];
  for(const suggestedItemID of suggestedItemIDs)
  {
    for(let i = 0; i < items.length; i++){
      const REMOVE_ELEMENT_AT_INDEX = 1;
      if(suggestedItemID === items[i]._id){
        exportingItems.push(items[i]);
        items.splice(i, REMOVE_ELEMENT_AT_INDEX);
        break;
      }
    }
  }
  for(const remainingItem of items)
    exportingItems.push(remainingItem);

  response.json({items: exportingItems})
}