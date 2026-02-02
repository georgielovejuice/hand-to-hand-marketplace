import {useState} from 'react';
import Hashes from 'jshashes/hashes.js';
import {validateTrimmedFullname, validateTrimmedUsername} from './shared.js';

export default function RegisterPage({
	apiURL, 
	redirectToLogin, 
	redirectToHome,
	setUsername,
	setHashedPassword,
}){
	const [errorMessage, setErrorMessage] = useState('');
	
	async function formSubmit(htmlEventFromForm){
		htmlEventFromForm.preventDefault();
		
		const htmlForm = htmlEventFromForm.target;
		//Exceptions irrelevant to use case
		const inputNameValuePairArray = Array.from((new FormData(htmlForm)).entries());
		
		let fullname, username, password, passwordCopy = null;
		for(let i = 0; i < inputNameValuePairArray.length; i++){
			const inputName = inputNameValuePairArray[i][0];
			const inputValue = inputNameValuePairArray[i][1];
			if(inputName === "fullname") 	{fullname = inputValue;}
			if(inputName === "studentID") {username = inputValue;}
			if(inputName === "password") 	{password = inputValue;}
			if(inputName === "passwordCopy") {passwordCopy = inputValue;}			
		}
		
		if(fullname === null)			{throw new Error("Could not get value of input for fullname.");}
		if(username === null)			{throw new Error("Could not get value of input for student ID.");}
		if(password === null)			{throw new Error("Could not get value of input for password.");}
		if(passwordCopy === null)	{throw new Error("Could not get value of input for password reprompt.");}		
		
		const fullnameFeedback = validateTrimmedFullname(fullname.trim());
		if(fullnameFeedback !== "OK"){
			setErrorMessage(fullnameFeedback);
			return;
		}
		const usernameFeedback = validateTrimmedUsername(username.trim());
		if(usernameFeedback !== "OK"){
			setErrorMessage(usernameFeedback);
			return;
		}
		if(password !== passwordCopy){
			setErrorMessage("Reprompted password does not match");
			return;
		}
		
		const hashedPassword = (new Hashes.SHA256()).hex(password);
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
					requestType: 'registerUser', 
					username: username, 
					fullname: fullname,
					hashedPassword: hashedPassword
				}),				
			});
			if(!(httpResponse.ok)){
				setErrorMessage("Received HTTP status " + httpResponse.status + " from server.");
				return;
			}
		}catch(exception){
			if(exception instanceof TypeError){
				setErrorMessage("Network error or invalid API URL for registration.");
			}
			else{throw exception;}
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
			if(objectFromResponse.registerUserStatus === undefined){
				throw new SyntaxError("Response JSON does not have required data field.");
			}
			if(objectFromResponse.registerUserStatus !== "OK"){
				setErrorMessage(objectFromResponse.registerUserStatus);
				return;
			}

			setErrorMessage('');
			setUsername(username);
			setHashedPassword(password);
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
	
	return(
		<div>
			<form onSubmit={formSubmit}>
				<input
					name="fullname"
					placeholder="full-name"
				/>
				<input
					name="studentID"
					placeholder="student-id"
				/>
				<input
					name="password"
					placeholder="password"
				/>
				<input
					name="passwordCopy"
					placeholder="re-enter password"
				/>
				<button>SIGN UP</button>
			</form>
			<button onClick={(e) => {redirectToLogin();}}>log in</button>
			<p style={{color: 'red'}}>{errorMessage}</p>
		</div>
	);
}