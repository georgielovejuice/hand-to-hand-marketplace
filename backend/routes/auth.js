import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoClient from "../database.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
const SALT_ROUNDS = 10;

router.post("/register", async (req, res) => {
  const EMAIL_OK = 0;
  const INVALID_EMAIL_FORM = 1;
  const INVALID_STAFF_EMAIL = 2;
  const INVALID_STUDENT_EMAIL = 3;
  
  function isValidUniversityEmail(email){
    const FIRST_CHARACTER = 0;
    const NO_DECIMAL_POINT = 0;
    const VALID_STAFF_EMAIL_NAMES = [
      "alice",
      "bob",
      "charlie",
      "amnach.kh",
      "rattachai.ch",
      "surin.ki",
      "reg.test",
      "dumpling",
    ];
    
    const trimmedEmail = email.trim();
    if(trimmedEmail.includes(' ')) return INVALID_EMAIL_FORM;
    
    const atSymbolIndex = trimmedEmail.indexOf("@");
    const noAtSymbol = atSymbolIndex < 0;
    if(noAtSymbol) return INVALID_EMAIL_FORM;
    
    const hasDuplicateAtSymbol = trimmedEmail.includes("@", atSymbolIndex+1);
    if(hasDuplicateAtSymbol) return INVALID_EMAIL_FORM;
    
    const isKMITLDomain = trimmedEmail.endsWith("@kmitl.ac.th") && !(trimmedEmail.startsWith("@kmitl.ac.th"));
    if(!isKMITLDomain) return INVALID_EMAIL_FORM;
    
    const emailName = trimmedEmail.substr(FIRST_CHARACTER, atSymbolIndex);
    const emailNameAsNumber = Number.parseFloat(emailName);
    const isNotStudentEmail = Number.isNaN(emailNameAsNumber);
    if(isNotStudentEmail)
      return VALID_STAFF_EMAIL_NAMES.includes(emailName) ? EMAIL_OK : INVALID_STAFF_EMAIL;
    
    const emailNameIsFloatingPoint = emailNameAsNumber !== Number.parseInt(emailName);
    if(emailNameIsFloatingPoint) return INVALID_STUDENT_EMAIL;
    
    const inStudentIDRange = (emailNameAsNumber >= 50000000) && (emailNameAsNumber < 69000000);
    return inStudentIDRange ? EMAIL_OK : INVALID_STUDENT_EMAIL;
  }
  
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }

    const db = mongoClient.db("User");
    const users = db.collection("User");

    const existing = await users.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists." });
    }
    
    const emailState = isValidUniversityEmail(email);
    switch(emailState){
      case INVALID_EMAIL_FORM: 
        return res.status(400).json({message: "Invalid form for KMITL given email."});
      case INVALID_STAFF_EMAIL:
        return res.status(400).json({message: "Unrecognised KMITL staff/lecturer email."});
      case INVALID_STUDENT_EMAIL:
        return res.status(400).json({message: "Invalid KMITL student email."});
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
      message: "User registered successfully."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const db = mongoClient.db("User");
    const users = db.collection("User");

    const user = await users.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    // do not send password hash to frontend - less secure if do
    const { hashedPassword, ...safeUser } = user;

    res.json({
      token, safeUser
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error." });
  }
});

export default router;