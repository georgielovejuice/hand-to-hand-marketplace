import express from 'express';
const router = express.Router();
import mongoClient from '../database.js';
import jwt from "jsonwebtoken";

router.post("/login", async(req,res) => {
	const userDatabase = mongoClient.db("User");
	const userCollection = userDatabase.collection("User");	
	const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

    try {
        const { email,password } = req.body;

        const user = await userCollection.findOne({email: email});
        if (!user)
            return res.status(400).json({ message: "User not found "});
        
        const match = (password === user.hashedPassword);
        if (!match) return res.status(400).json({ message: "Wrong password" })
				
				//User logged in with these so don't include them
				delete user.email;
				delete user.hashedPassword;
                const token = jwt.sign(
                { email: user.email, userId: user._id },
                JWT_SECRET,
                { expiresIn: "2h" }
                );

        res.json({user, token});

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

				const placeholderProfilePictureURL = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
				const initialUserObjectWithoutCredentials = {
					name: name || 'User',
					profilePicture: placeholderProfilePictureURL,
					phone: ''
        };
        const insertedDocument = await userCollection.insertOne({...initialUserObjectWithoutCredentials, email: email, hashedPassword: password});
				if(insertedDocument) res.status(201).json(initialUserObjectWithoutCredentials);
				else res.status(500).json({message: "Server couldn't register user."});
    } catch (error) {
			console.log(error);
			res.status(500).json({message: error.message})
    }
});

export default router;