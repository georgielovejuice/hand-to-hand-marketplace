// backend/routes/myItems.js
import express from "express";
import { ObjectId } from "mongodb";

export default function myItemsRoute(getDB) {
  const router = express.Router();

  /* ---------- GET: list my items ---------- */
  router.get("/", async (req, res) => {
    const username = req.headers["x-username"];
    if (!username) {
      return res.status(401).json({ error: "Missing credentials" });
    }

    const db = getDB();
    const items = await db
      .collection("item")
      .find({ ownerUsername: username })
      .toArray();

    res.json(items);
  });

  /* ---------- POST: create item ---------- */
  router.post("/", async (req, res) => {
    const username = req.headers["x-username"];
    if (!username) {
      return res.status(401).json({ error: "Missing credentials" });
    }

    const { name, imageUrl, price, category, details } = req.body;
    const db = getDB();

    await db.collection("item").insertOne({
      name,
      imageUrl,
      price,
      category,
      details,
      ownerUsername: username,
      createdAt: new Date()
    });

    res.json({ success: true });
  });

  /* ---------- DELETE: remove item ---------- */
  router.delete("/:id", async (req, res) => {
    const username = req.headers["x-username"];
    if (!username) {
      return res.status(401).json({ error: "Missing credentials" });
    }

    const db = getDB();
    const { id } = req.params;

    await db.collection("item").deleteOne({
      _id: new ObjectId(id),
      ownerUsername: username
    });

    res.json({ success: true });
  });

  /* ---------- PUT: update item ---------- */
    router.put("/:id", async (req, res) => {
    const username = req.headers["x-username"];
    if (!username) {
        return res.status(401).json({ error: "Missing credentials" });
    }

    const { id } = req.params;
    const { name, imageUrl, price, category, details } = req.body;

    const db = getDB();

    const result = await db.collection("item").updateOne(
        {
        _id: new ObjectId(id),
        ownerUsername: username
        },
        {
        $set: {
            name,
            imageUrl,
            price,
            category,
            details,
            updatedAt: new Date()
        }
        }
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Item not found or not yours" });
    }

    res.json({ success: true });
    });

  return router;
}
