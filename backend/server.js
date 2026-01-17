const {validateCredentials, registerUser, queryItems} = require('./api_methods.js');
const {databaseUsername, 
	databasePassword, 
	storageRegion,
	storageKeyId,
	storageSecretAccessKey,
	storageBucketName,
} = require('./backendCredentials.js');

const express = require('express');
const CrossOriginResourceSharing = require('cors');
const {MongoClient, ServerApiVersion} = require("mongodb");
const { S3Client, GetObjectCommand, InvalidObjectState, NoSuchKey, S3ServiceException} = require('@aws-sdk/client-s3');

const {argv} = require('node:process');


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

const storageClient = new S3Client({
	region: storageRegion,
	credentials:{
		accessKeyId: storageKeyId,
		secretAccessKey: storageSecretAccessKey
	}
});

const serverPortNumber = 5001;
const userDatabaseName = useTestingDatabase ? "UserTest" : "User";
const itemDatabaseName = useTestingDatabase ? "ItemTest" : "Item";

const app = express();
app.use(express.json());
app.use(CrossOriginResourceSharing());

app.post('/api', async (request, response) => {		
	const userDatabase = mongoClient.db(userDatabaseName);
	const userCollection = userDatabase.collection("User");
	const ItemDatabase = mongoClient.db(itemDatabaseName);
	const itemCollection = ItemDatabase.collection("Item");

	try{
		const parsedObject = request.body;
		if(parsedObject === undefined)
			throw new SyntaxError("Couldn't parse request JSON.");
		if(typeof parsedObject.requestType !== "string")
			throw new SyntaxError("JSON has invalid type for requestType field.");

		switch(parsedObject.requestType){
			/*
				Insert your method to handle a request type and its switch-case here.
				The method has to check and give feedback if parsedObject for a request type is malformed,
				just throw a SyntaxError so this try-catch responds to the client for malformed JSON for a request.
				Anything logic error report like incorrect username should be in the response type for a request type.
				Programmer errors and undocumented errors should not be caught by the method and instead caught by this function
			*/
			case("validateCredentials"):
				await validateCredentials(parsedObject, userCollection, response);
				break;
			case("registerUser"): 
				await registerUser(parsedObject, userCollection, response);
				break;
			case("getItems"):
				await queryItems(parsedObject, itemCollection, response);
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

app.get('/resource/:resourcename', async (request, response) => {
	/*
		Throws:
		- InvalidObjectState - object is archived and inaccessible
		- NoSuchKey - No file corresponding to the requested name
		- S3ServiceException - anything else
	*/
	try{
		//Note: key is file path relative to bucket root directory
		const storageResponse = await storageClient.send(new GetObjectCommand({Bucket: storageBucketName, Key: request.params.resourcename}));
		response.send(await storageResponse.Body.transformToByteArray());
	}catch(error){
		const badRequestErrorCode = 400;
		const contentForbiddenErrorCode = 403;
		const internalServerErrorCode = 500;
		
		if(error instanceof InvalidObjectState) response.sendStatus(contentForbiddenErrorCode);
		else if(error instanceof NoSuchKey) response.sendStatus(badRequestErrorCode);
		else{
			console.log(error);
			response.sendStatus(internalServerErrorCode);
		}
	}
})


async function main(){
	await mongoClient.connect();
	console.log("Server is listening to: https://localhost:" + serverPortNumber);
	app.listen(serverPortNumber);
}
main();