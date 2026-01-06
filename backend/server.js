const { MongoClient } = require("mongodb");
const { databaseUsername, databasePassword } = require("./databaseCredentials");

const uri = `mongodb+srv://${databaseUsername}:${databasePassword}@auctiondraftcluster.cmlfgox.mongodb.net/`;

const client = new MongoClient(uri);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("test");
  console.log("Connected to MongoDB");
}

module.exports = { connectDB, getDB: () => db };
