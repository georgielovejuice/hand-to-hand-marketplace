// backend/routes/myItems.js
import express from "express";
import { ObjectId } from "mongodb";
import { verifyToken } from "../middleware/auth.js";

const validateItemInput = (data) => {
  const { name, imageURL, priceTHB, categories, details } = data;
  if (!name?.trim()) return "Name is required";
  if (typeof priceTHB !== "number" || priceTHB < 0) return "Valid price is required";
  if (!Array.isArray(categories) || categories.length === 0) return "At least one category is required";
  return null;
};

export default function myItemsRoute(getDB) {
  const router = express.Router();
  router.use(verifyToken);

  router.get("/", async (req, res) => {
    try {
      const items = await getDB()
        .collection("Item")
        .find({ ownerId: req.user.userId })
        .toArray();
      res.json(items);
    } catch (error) {
      console.error("Error fetching items:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  router.post("/", async (req, res) => {
    try {
      const error = validateItemInput(req.body);
      if (error) return res.status(400).json({ error });

      const { name, imageURL, priceTHB, categories, details } = req.body;
      const result = await getDB().collection("Item").insertOne({
        name: name.trim(),
        imageURL,
        priceTHB,
        categories,
        details: details?.trim() || "",
        ownerId: req.user.userId,
        createdAt: new Date()
      });

      res.status(201).json({ id: result.insertedId });
    } catch (error) {
      console.error("Error creating item:", error);
      res.status(500).json({ error: "Failed to create item" });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid item ID" });
      }

      const result = await getDB().collection("Item").deleteOne({
        _id: new ObjectId(req.params.id),
        ownerId: req.user.userId
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: "Invalid item ID" });
      }

      const error = validateItemInput(req.body);
      if (error) return res.status(400).json({ error });

      const result = await getDB().collection("Item").updateOne(
        { _id: new ObjectId(req.params.id), ownerId: req.user.userId },
        { $set: { ...req.body, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating item:", error);
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  router.get("/:itemID", async (req, res) => {
    try {
      if (!ObjectId.isValid(req.params.itemID)) {
        return res.status(400).json({ error: "Invalid item ID" });
      }

      const item = await getDB().collection("Item").findOne({
        _id: new ObjectId(req.params.itemID)
      });

      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }

      res.json(item);
    } catch (error) {
      console.error("Error fetching item:", error);
      res.status(500).json({ error: "Failed to fetch item" });
    }
  });

  return router;
}
