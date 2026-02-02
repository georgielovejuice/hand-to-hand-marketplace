// backend/routes/myItems.js
import express from "express";
import { ObjectId } from "mongodb";
import { verifyToken } from "../middleware/auth.js";

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
      createdAt: new Date()
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

    const result = await db.collection("Item").updateOne(
        {
          _id: new ObjectId(id),
          ownerId: req.user.userId
        },
        { $set: { ...req.body, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Item not found or not yours" });
    }

    res.json({ success: true });
    });

  return router;
}
