import {MongoClient, ServerApiVersion} from "mongodb";
import {databaseUsername, databasePassword} from './backendCredentials.js';

const databaseURL = "mongodb+srv://" + databaseUsername + ":" + databasePassword + "@auctiondraftcluster.cmlfgox.mongodb.net/";
const mongoClient = new MongoClient(databaseURL, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

export default mongoClient;