/*
	Sends a POST request to *apiURL* with *stringifiedJSON* as body, wait for JSON response, 
	, send an object parsed from response as argument for *handleReadObject* and return its output.
	
	Inputs:
	- apiURL: String - URL to API access
	- stringifiedJSON: String - String representing JSON for service request
	- setErrorMessage: None function (String) - report documented errors of the function through this, these include
		- Networking error while requesting service from server
		- Response body unable to be decoded
		- Unable to parse JSON from server
		- Message from error JSON from server
		- Service response JSON is incorrect or missing attributes (Caught SyntaxError)
		Otherwise the message reported would be ''.
	- handleReadObject: function (Object) - called after object from server response is correctly parsed and is not an error JSON.
		- Don't throw TypeError as the function would catch it as response decoding error
		- Throw SyntaxError if JSON does not conform to expected form, this will be reported through *setErrorMessage*.
		- Any other exceptions from it will not be caught
		
	Returns: output from handleReadObject() if error output set via setErrorMessage is '', otherwise null.
	
	Error handling:
	- Some errors are reported through setErrorMessage
	- Undocumented or programmer errors are thrown or uncaught.
*/
export async function requestServerService(apiURL, stringifiedJSON, setErrorMessage, handleReadObject){
	let httpResponse = null;
	try{
		/*
			Based on Window.fetch(), raises
			- AbortError if abort() is called
			- TypeError if
				- request URL is invalid
				- request URL contains credentials like username or password
				- request blocked by permissions policy
				- network error
			NotAllowedError is irrelevant for use case
			- from await
		*/	
		httpResponse = await fetch(apiURL, {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: stringifiedJSON,
		});
	}catch(error){
		if(error instanceof TypeError)
			setErrorMessage("Network error connecting to server.");
		else throw error;
		return null;
	}
	
	try{
		/*
		 May raise TypeError if response body couldn't be decoded 
		 or SyntaxError if the body couldn't be parsed as JSON
		*/
		const objectFromResponse = await httpResponse.json();
		const isErrorMessage = objectFromResponse.error !== undefined;
		if(isErrorMessage){
			setErrorMessage(objectFromResponse.error);
			return null;
		}
		
		setErrorMessage('');
		return handleReadObject(objectFromResponse);
	}catch(exception){
		if(exception instanceof TypeError){
			setErrorMessage("Couldn't decode response body from server.");
		}else if(exception instanceof SyntaxError){
			setErrorMessage("Invalid response JSON received from server.");
		}
		else{throw exception;}
		return null;
	}
}