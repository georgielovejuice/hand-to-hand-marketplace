import express from 'express';
const router = express.Router();
import mongoClient from '../database.js';

router.post("/login", async(req,res) => {
	const userDatabase = mongoClient.db("User");
	const userCollection = userDatabase.collection("User");	
	console.log(userCollection);
	
    try {
        const { email,password } = req.body;

        const user = await userCollection.findOne({email: email});
        if (!user)
            return res.status(400).json({ message: "User not found "});
        
        const match = password === user.hashedPassword;
        if (!match)
            return res.status(400).json({ message: "Wrong password" })

        res.json({validCredentials: true});
    } catch (error) {
			console.log(error);
        res.status(500).json({ message: error.message })
    }
});


router.post("/register", async (req,res) => {
	const userDatabase = mongoClient.db("User");
	const userCollection = userDatabase.collection("User");	
	
    try {
        const {name, email, password } = req.body;

        const existing = await userCollection.findOne({email: email});
        if (existing) return res.status(400).json({message: "Email Already Exists"})

        const insertedDocument = await userCollection.insertOne({
            name: name,
            email: email,
            hashedPassword: password
        });
				if(insertedDocument) res.status(201).json({message: "User created"});
				else res.status(500).json({message: "Server couldn't register user."});
    } catch (error) {
			res.status(500).json({message: error.message})
    }
});

export default router;