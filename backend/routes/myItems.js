const express = require("express");
const { getDB } = require("../server");
const router = express.Router();
module.exports = router;

router.get("/my-items", async (req, res) => {
  const db = getDB();
  const items = await db
    .collection("items")
    .find({ owner: req.user.username })
    .toArray();

  res.json(items);
});

router.post("/my-items", async (req, res) => {
  const item = {
    ...req.body,
    owner: req.user.username,
    createdAt: new Date(),
    isSold: false
  };

  await getDB().collection("items").insertOne(item);
  res.json({ success: true });
});

router.delete("/my-items/:id", async (req, res) => {
  const { id } = req.params;

  const item = await getDB().collection("items").findOne({ _id: new ObjectId(id) });

  if (item.owner !== req.user.username) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await getDB().collection("items").deleteOne({ _id: item._id });
  res.json({ success: true });
});


