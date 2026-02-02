const http = require('node:http');

async function test_validateCredentials_Typical(apiURL){
	console.log("Running test_validateCredentials_Typical()...");
	const payload = {
		requestType: "validateCredentials",
		username: "Fruitcakes",
		hashedPassword: "e580d4d7cbf338bc4097029fce865997a611fcbacbd47f73dc860764770fdd09"
	};
	
	const httpResponse = await fetch(apiURL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});
	
	const httpStatusOK = 200;
	if(httpResponse.status !== httpStatusOK){
		console.log("\tFailed: Received HTTP status" + httpResponse.status);
		return;
	}

	try{
		const objectFromResponse = await httpResponse.json();
		if(!(objectFromResponse instanceof Object)){
			console.log("\tFailed: Response not in JSON.");
			return;
		}
		
		const objectIsErrorMessage = objectFromResponse.error !== undefined;
		if(objectIsErrorMessage){
			console.log("\tFailed: Got Error message: " + objectFromResponse.error);
			return;
		}
		if(objectFromResponse.validCredentials === undefined){
			console.log("Failed: Response did not have validCredentials attribute.");
			return;
		}
		if(objectFromResponse.validCredentials !== "OK"){
			console.log("\tFailed: Expected 'OK' from validCredentials, got: " + objectFromResponse.validCredentials);
			return;
		}
		console.log("\tPassed");
	}catch(error){
		if(error instanceof SyntaxError)
			console.log("\tFailed: Couldn't parse response as JSON.");
		if(error instanceof TypeError)
			console.log("\tFailed: Couldn't decode response body from server.");
		else console.log(error);
		return;
	}
}

test_validateCredentials_Typical("http://localhost:5001/api");