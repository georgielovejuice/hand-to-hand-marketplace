import {MongoClient, ServerApiVersion} from "mongodb";
import {databaseUsername, databasePassword} from './backendCredentials.js';

const databaseURL = "mongodb://localhost:28435/?directConnection=true";
const mongoClient = new MongoClient(databaseURL, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

export default mongoClient;