// backend/server.js
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import { databaseUsername, databasePassword } from "./databaseCredentials.js";
import myItemsRoute from "./routes/myItems.js";

const app = express();
const port = 3001;

/* ---------- MongoDB ---------- */
const uri = `mongodb+srv://${databaseUsername}:${databasePassword}@auctiondraftcluster.cmlfgox.mongodb.net/`;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("test");
  console.log("Connected to MongoDB");
}

/* ---------- Middleware ---------- */
app.use(express.json());
app.use(cors());

/* ---------- Routes ---------- */
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

/* pass db FUNCTION, not db value */
app.use("/myitems", myItemsRoute(() => db));

/* ---------- Start Server ---------- */
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
