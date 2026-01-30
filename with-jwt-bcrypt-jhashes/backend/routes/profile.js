import express from 'express';
const router = express.Router();
import mongoClient from '../database.js';

router.get("/", async (req, res) => {
	const userDatabase = mongoClient.db("User");
	const userCollection = userDatabase.collection("User");		
	
  try {
		const {email, hashedpassword} = req.headers;
    const user = await userCollection.findOne({email: email});
    if (!user) return res.status(404).json({ message: "User not found" });
		
		const HTTP_STATUS_FOR_UNAUTHORIZED = 401;
		if(user.hashedPassword !== hashedpassword) 
			return res.status(HTTP_STATUS_FOR_UNAUTHORIZED).json({message: "Password mismatch"});
		
		//User already authenticated with the same hash, so don't send
		delete user.hashedPassword;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/", async (req, res) => {
	const userDatabase = mongoClient.db("User");
	const userCollection = userDatabase.collection("User");		
	
  try {
    const {originalEmail, hashedPassword, name, newEmail, phone, profilePicture } = req.body;

		const user = await userCollection.findOne({email: originalEmail});
    if (!user) 
      return res.status(404).json({ message: "User not found" });

		const HTTP_STATUS_FOR_UNAUTHORIZED = 401;
		if(user.hashedPassword !== hashedPassword) 
			return res.status(HTTP_STATUS_FOR_UNAUTHORIZED).json({message: "Password mismatch"});
		
		const newEmailCollision = await userCollection.findOne({email: newEmail});
    if ((originalEmail !== newEmail) && newEmailCollision)
			return res.status(401).json({message: "New email corresponds to another user."});
		
		const updateResult = await userCollection.updateOne(user, {
			$set:{
				name: name || user.name,
				email: newEmail || user.email,
				phone: phone || user.phone,
				profilePicture: profilePicture || user.profilePicture
			}
		});
		if(updateResult.acknowledged) res.json({ message: "Profile updated successfully" });
		else res.status(500).json({message: "Database did not acknowledge the change."});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.put("/password", async (req, res) => {
	const userDatabase = mongoClient.db("User");
	const userCollection = userDatabase.collection("User");		

  try {
    const {email, hashedOriginalPassword, hashedNewPassword } = req.body;

		const user = await userCollection.findOne({email: email});
    if (!user) 
      return res.status(404).json({ message: "User not found" });
	
    // Verify current password
    const isMatch = user.hashedPassword === hashedOriginalPassword;
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

		const updateResult = await userCollection.updateOne(user, {
			$set:{hashedPassword: hashedNewPassword}
		});

		if(updateResult.acknowledged) res.json({ message: "Password changed successfully" });
		else res.status(500).json({message: "Database did not acknowledge the change."});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;