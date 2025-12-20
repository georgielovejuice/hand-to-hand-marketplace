const express = require('express');
const CrossOriginResourceSharing = require('cors');
const {MongoClient, ServerApiVersion} = require("mongodb");
const {validateCredentials, registerUser} = require('./api_methods.js');
const {argv} = require('node:process');
const {databaseUsername, databasePassword} = require('./databaseCredentials.js');


const hasProcessArguments = argv.length > 2;
const useTestingDatabase = argv[2] == "TESTDB";
if(useTestingDatabase) console.log("\tUsing test database...");

const databaseURL = "mongodb+srv://" + databaseUsername + ":" + databasePassword + "@auctiondraftcluster.cmlfgox.mongodb.net/";
const mongoClient = new MongoClient(databaseURL, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

const serverPortNumber = 5001;
const userDatabaseName = useTestingDatabase ? "UserTest" : "User";

const app = express();
app.use(express.json());
app.use(CrossOriginResourceSharing());

app.post('/api', async (request, response) => {		
	await mongoClient.connect();
	const userDatabase = mongoClient.db(userDatabaseName);
	const userCollection = userDatabase.collection("User");

	try{
		const parsedObject = request.body;
		if(parsedObject === undefined)
			throw new SyntaxError("Couldn't parse request JSON.");
		if(parsedObject.requestType === undefined)
			throw new SyntaxError("JSON does not have requestType field.");
	
		switch(parsedObject.requestType){
			case("validateCredentials"):
				await validateCredentials(parsedObject, userCollection, response);
				break;
			case("registerUser"): 
				await registerUser(parsedObject, userCollection, response);
				break;
			default: response.json({error: "Invalid requested service type"});
		}
	}catch(error){
		console.log(error);
		if(error instanceof SyntaxError)
			request.json({error: "Invalid service request JSON."});
		else{
			const serverErrorCode = 500;
			request.sendStatus(serverErrorCode);
		}
	}finally{
		await mongoClient.close();
	}
});

app.get('/', async (request, response) => {
	response.send("Server for AuctionDraft is up and running :D");
})	


console.log("Server is listening to: https://localhost:" + serverPortNumber);
app.listen(serverPortNumber);
