/*
	This file include functions which are both used by the server and client,
	like validating username and fullname for registration or login.
	Try to make sure they have the same copy idk
*/

export function validateTrimmedFullname(trimmedFullname){
	if(trimmedFullname.length === 0) return "Full name is blank.";
	return "OK";
}

export function validateTrimmedUsername(trimmedUsername){
	if(trimmedUsername.length === 0) return "Username is blank.";
	return "OK";
}