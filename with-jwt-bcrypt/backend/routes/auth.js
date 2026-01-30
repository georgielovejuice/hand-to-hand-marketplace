import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoClient from "../database.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const SALT_ROUNDS = 10;

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const db = mongoClient.db("User");
    const users = db.collection("User");

    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
      name: name || "User",
      email,
      hashedPassword,
      profilePicture: "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
      phone: "",
      createdAt: new Date()
    };

    await users.insertOne(newUser);

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = mongoClient.db("User");
    const users = db.collection("User");

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    // do not send password hash to frontend - less secure if do
    const { hashedPassword, ...safeUser } = user;

    res.json({
      token,
      user: safeUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;