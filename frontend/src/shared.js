export function validateTrimmedFullname(trimmedFullname){
	if(trimmedFullname.length === 0) return "Full name is blank.";
	return "OK";
}

export function validateTrimmedUsername(trimmedUsername){
	if(trimmedUsername.length === 0) return "Username is blank.";
	return "OK";
}