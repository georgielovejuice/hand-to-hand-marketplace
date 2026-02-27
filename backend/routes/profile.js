import express from "express";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
import mongoClient from "../database.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// get profile
router.get("/", verifyToken, async (req, res) => {
  try {
    const userCollection = mongoClient.db("User").collection("User");

    const user = await userCollection.findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { hashedPassword: 0 } } // hide password
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// update profile
router.put("/", verifyToken, async (req, res) => {
  try {
    const userCollection = mongoClient.db("User").collection("User");
    const { name, email, phone, profilePicture } = req.body;
		const emailFromJWT = req.user.email;

    // email collision check
		const wantsToChangeEmail = emailFromJWT !== email;
    if (wantsToChangeEmail) {
      const exists = await userCollection.findOne({
        email,
        _id: { $ne: new ObjectId(req.user.userId) }
      });
      if (exists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const result = await userCollection.updateOne(
      { _id: new ObjectId(req.user.userId) },
      {
        $set: {
          ...(name && { name }),
          ...(email && { email }),
          ...(phone && { phone }),
          ...(profilePicture && { profilePicture }),
          updatedAt: new Date()
        }
      }
    );

    if (!result.matchedCount) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// changing password
router.put("/password", verifyToken, async (req, res) => {
  try {
    const userCollection = mongoClient.db("User").collection("User");
    const { currentPassword, newPassword } = req.body;

    const user = await userCollection.findOne({
      _id: new ObjectId(req.user.userId)
    });
	
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect." });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await userCollection.updateOne(
      { _id: user._id },
      { $set: { hashedPassword: newHash } }
    );

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;