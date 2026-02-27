import {queryItems} from './api_methods.js';
import mongoClient from './database.js';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import myItemsRoute from "./routes/myItems.js";
import chatRouter from './routes/chat.js'
import uploadRouter from './s3Interface.js'

import express from 'express';
import CrossOrginResourceSharing from 'cors';

const app = express();
app.use(express.json());
app.use(CrossOrginResourceSharing());

app.post('/api', async (request, response) => {		
	//Will change this to regular endpoint if there's time
	const userDatabase = mongoClient.db("User");
	const userCollection = userDatabase.collection("User");
	const ItemDatabase = mongoClient.db("Item");
	const itemCollection = ItemDatabase.collection("Item");

	try{
		const parsedObject = request.body;
		if(parsedObject === undefined)
			throw new SyntaxError("Couldn't parse request JSON.");
		if(typeof parsedObject.requestType !== "string")
			throw new SyntaxError("JSON has invalid type for requestType field.");

		switch(parsedObject.requestType){
			case("getItems"):
				await queryItems(parsedObject, itemCollection, userCollection, response);
				break;
			default: response.json({error: "Invalid requested service type"});
		}
	}catch(error){
		if(error instanceof SyntaxError)
			response.json({error: "Invalid service request JSON."});
		else{
			const serverErrorCode = 500;
			console.log(error);
			response.sendStatus(serverErrorCode);
		}
	}
});

app.get('/', async (request, response) => {
	response.send("Server for AuctionDraft is up and running :D");
})

async function main(){
	const serverPortNumber = 5001;
	await mongoClient.connect();
	app.use("/api/profile", profileRouter);
	app.use("/api/auth", authRouter);
	app.use("/api/myitems", myItemsRoute(() => mongoClient.db("Item")));
	app.use("/api/chat", chatRouter);
  app.use("/api/uploads", uploadRouter);
	console.log("Server is listening to: http://localhost:" + serverPortNumber);
	app.listen(serverPortNumber);
}
main();