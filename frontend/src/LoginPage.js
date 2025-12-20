import {useState} from 'react';
import {validateTrimmedUsername} from './shared.js';
import Hashes from 'jshashes/hashes.js';


export default function LoginPage({
	apiURL, 
	redirectToHome, 
	redirectToRegister, 
	setUsername, 
	setHashedPassword
}){
	const [errorMessage, setErrorMessage] = useState('');
	
	const usernameInputName = "username";
	const passwordInputName = "password";
	
	async function formSubmit(htmlEventFromForm){
		htmlEventFromForm.preventDefault();

		const htmlForm = htmlEventFromForm.target;
		//FormData() has exceptions but not for this use case
		const inputNameValuePairArray = Array.from((new FormData(htmlForm)).entries());

		let username, plaintextPassword = null;
		for(let i = 0; i < inputNameValuePairArray.length; i++){
			const inputName = inputNameValuePairArray[i][0];
			const inputValue = inputNameValuePairArray[i][1];				
			if(inputName === usernameInputName){username = inputValue;}
			if(inputName === passwordInputName){plaintextPassword = inputValue;}				
		}
		
		if(username === null) throw new Error("Username input was not detected");
		if(plaintextPassword === null) throw Error("Password input was not detected");
		
		const usernameFeedback = validateTrimmedUsername(username.trim());
		if(usernameFeedback !== "OK"){
			setErrorMessage(usernameFeedback);
			return;
		}

		const hashedPassword = (new Hashes.SHA256()).hex(plaintextPassword);		
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
				body: JSON.stringify({
					requestType: 'validateCredentials', 
					username: username, 
					hashedPassword: hashedPassword
					}
				),
			});

			if(!(httpResponse.ok)){
				setErrorMessage("Received HTTP status " + httpResponse.status + " from server.");
				return;
			}
		}catch(excp){
			if(excp instanceof TypeError){
				setErrorMessage("Network error or invalid API URL for logging in.");
			}
			else{throw excp;}
			return;
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
				return;
			}
			if(objectFromResponse.validCredentials === undefined){
				throw new SyntaxError("Response JSON does not have required data field.");
			}
			if(objectFromResponse.validCredentials !== "OK"){
				setErrorMessage(objectFromResponse.validCredentials);
				return;
			}

			setErrorMessage('');
			setUsername(username);
			setHashedPassword(hashedPassword);
			redirectToHome();
		}catch(exception){
			console.log(exception);
			if(exception instanceof TypeError){
				setErrorMessage("Couldn't decode response body from server.");
			}else if(exception instanceof SyntaxError){
				setErrorMessage("Invalid response JSON received from server.");
			}
			else{throw exception;}
			return;
		}
	}
	
	return (
		<div>
			<form onSubmit={formSubmit}>
				<input
					name={usernameInputName}
					placeholder="student-id"
				/>
				<input
					name={passwordInputName}
					placeholder="password"
				/>
				<button>LOGIN</button>
			</form>
		<button onClick={(e) => {redirectToRegister();}}>sign up</button>
		<p style={{color: 'red'}}>{errorMessage}</p>
		</div>
	);
}
