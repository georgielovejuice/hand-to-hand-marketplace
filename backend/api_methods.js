export async function validateCredentials(parsedObject, userCollection, response){
	const query = {username: {$eq: parsedObject.username}};
	//await throws, something.
	const userWithMatchingUsername = await userCollection.findOne(query);
	const usernameInCollection = userWithMatchingUsername != null;
	if(!usernameInCollection) response.json({validCredentials: "Username not found"});
	else{
		if(parsedObject.hashedPassword === userWithMatchingUsername.hashedPassword)
			response.json({validCredentials: "OK"});
		else response.json({validCredentials: "Incorrect password"});
	}
}

export async function registerUser(parsedObject, userCollection, response){
	if(parsedObject.username === undefined) throw new SyntaxError("JSON does not have username attribute for registering user.");
	if(parsedObject.fullname === undefined) throw new SyntaxError("JSON does not have fullname attribute for registering user.");
	if(parsedObject.hashedPassword === undefined) throw new SyntaxError("JSON does not have hashedPassword attribute for registering user.");

	const query = {username: {$eq: parsedObject.username}};
	//await throws, something.
	const userWithMatchingUsername = await userCollection.findOne(query);
	const usernameAlreadyExists = userWithMatchingUsername != null;
	if(usernameAlreadyExists){
		response.json({registerUserStatus: "Username already exists."});
		return;
	}

	const userDocument = {
		username: parsedObject.username, 
		fullname: parsedObject.fullname,
		hashedPassword: parsedObject.hashedPassword,
	};
	
	const insertedDocument = (await userCollection.insertOne(userDocument)).acknowledged;
	if(insertedDocument) response.json({registerUserStatus: "OK"});
	else response.json({registerUserStatus: "Failed to write to database."});
}