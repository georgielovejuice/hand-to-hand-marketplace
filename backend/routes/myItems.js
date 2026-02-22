// backend/routes/myItems.js
import express from "express";
import { ObjectId } from "mongodb";
import { verifyToken } from "../middleware/auth.js";
import openAIClient from '../openAI.js';

async function getItemSummary(itemName, itemCategories, itemDetails){
  /*
  No documented errors - returns a string summarising an item based on given arguments.
  Returned string is at most 64 characters.
  */
  const FIRST_CHARACTER = 0;
    const response = await openAIClient.responses.create({
        model: "gpt-4.1-nano",
        input: `
        Summarise the given item in 5 words:
        Name: ${itemName}
        Categories: ${itemCategories}
        Description: ${itemDetails}
        `
    })
    return response.output_text.trim().substr(FIRST_CHARACTER, 64);
}

export default function myItemsRoute(getDB) {
  const router = express.Router();
  router.use(verifyToken);

  /* ---------- GET: list my items ---------- */
  router.get("/", async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ error: "Missing credentials" });
    }

    const db = getDB();
    const items = await db
      .collection("Item")
      .find({ ownerId: req.user.userId })
      .toArray();

    res.json(items);
  });

  /* ---------- POST: create item ---------- */
  router.post("/", async (req, res) => {

    
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ error: "Missing credentials" });
    }

    const { name, imageURL, priceTHB, categories, details } = req.body;
    const db = getDB();

    await db.collection("Item").insertOne({
      name,
      imageURL,
      priceTHB,
      categories,
      details,
      ownerId: req.user.userId,
      createdAt: new Date(),
      summary: await getItemSummary(name, categories, details)
    });

    res.json({ success: true });
  });

  /* ---------- DELETE: remove item ---------- */
  router.delete("/:id", async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ error: "Missing credentials" });
    }

    const db = getDB();
    const { id } = req.params;

    await db.collection("Item").deleteOne({
      _id: new ObjectId(id),
      ownerId: req.user.userId
    });

    res.json({ success: true });
  });

  /* ---------- PUT: update item ---------- */
	router.put("/:id", async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ error: "Missing credentials" });
    }

    const db = getDB();
    const { id } = req.params;
    
    const item = req.body;

    const result = await db.collection("Item").updateOne(
        {
          _id: new ObjectId(id),
          ownerId: req.user.userId
        },
        { 
          $set: {
            ...item, 
            updatedAt: new Date(),
            summary: await getItemSummary(item.name, item.categories, item.details)
          } 
        }
      );

    if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Item not found or not yours" });
    }

    res.json({ success: true });
    });
		
	router.get("/:itemID", async (request, response) => {
		/*
		Endpoint for retrieving an Item object from the database. 
		
		No documented exceptions
		
		input: itemID (str, for mongoDB ObjectId construction)
		
		Returns: 
		- HTTP status 200 with {
				(item document from database)
			}
		- HTTP status 400 with .error: str, if itemID is invalid.
		- HTTP status 500 for undocumented errors
		*/
		const HTTP_CODE_FOR_BAD_REQUEST = 400;	
		const itemObject = await getDB().collection("Item").findOne({_id: new ObjectId(request.params.itemID)});
		if(!itemObject) 
			return response.status(HTTP_CODE_FOR_BAD_REQUEST).json({error: "Item with requested id is not found."});
		response.json(itemObject);
	});

  return router;
}
