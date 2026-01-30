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

/*
	Possible errors:
	- parsedObject.searchBarText type is not string: throws SyntaxError
	- parsedObject.query is not Object type: throws SyntaxError
	- parsedObject.query isn't a valid MongoDB query: throws something
	- For a queried item from database:
		- item.name type is not string: will not send the item to user
		- item.category type is not Array: will not send the item to user		
		- item.details type is not string: will not send the item to user
*/
export async function queryItems(parsedObject, itemCollection, response){
	function textToSearchTokens(str){
		const tokenSeparator = ' ';		
		const searchTokens = new Set(str.trim().toLowerCase().split(tokenSeparator));	
		const noTokens = (searchTokens.size === 1) && (searchTokens.has(''));
		return noTokens ? (new Set()) : searchTokens;
	}
	
	function returnItemsHavingSearchTokens(items, searchTokens){
		const itemsHavingSearchTokens = [];
		for(const item of items){
			const itemNameAsTokens = textToSearchTokens(item.name);
			if(itemNameAsTokens.intersection(searchTokens).size > 0){
				itemsHavingSearchTokens.push(item);
				continue;
			}
			
			let itemCategoriesConcatenated = '';
			for(const category of item.categories){
				const tokenSeparator = ' ';
				itemCategoriesConcatenated += (category + tokenSeparator);
			}
			const itemCategoriesAsTokens = textToSearchTokens(itemCategoriesConcatenated);
			if(itemCategoriesAsTokens.intersection(searchTokens).size > 0){
				itemsHavingSearchTokens.push(item);
				continue;
			}

			const itemDetailsAsTokens = textToSearchTokens(item.details);					
			if(itemDetailsAsTokens.intersection(searchTokens).size > 0){
				itemsHavingSearchTokens.push(item);
				continue;
			}
		}
		return itemsHavingSearchTokens;
	}
	
	if(typeof parsedObject.searchBarText !== "string")
		throw new SyntaxError("SearchBarText attribute of request is not string type.");	
	if(!(parsedObject.query instanceof Object))
		throw new SyntaxError("Request does not have query attribute.");
	
	const MatchingItemsIterator = itemCollection.find(parsedObject.query);
	
	const items = [];
	//Await throws, something
	for await(const item of MatchingItemsIterator){
		if(typeof item.name !== "string"){
			console.log("type for name attribute of queried Item from database is not string. Ignoring Item...");
			continue;
		}
		if(!(item.categories instanceof Array)){
			console.log("type for name attribute of queried Item from database is not string. Ignoring Item...");
			continue;
		}
		if(typeof item.details !== "string"){
			console.log("type for details attribute of queried Item from database is not string. Ignoring Item...");
			continue;
		}
		
		let invalidCategoryType = false;
		for(const category of item.categories){
			if(typeof category !== "string"){
				console.log("category in categories attribute of item is not string type. Ignored Item...");	
				invalidCategoryType = true;
				break;
			}
		}
		if(invalidCategoryType) continue;
		items.push(item);
	}
	
	const searchTokens = textToSearchTokens(parsedObject.searchBarText);
	const listEverythingFromEmptySearch = searchTokens.size === 0;
	
	if(listEverythingFromEmptySearch) response.json({items: items});
	else response.json({items: returnItemsHavingSearchTokens(items, searchTokens)});
}