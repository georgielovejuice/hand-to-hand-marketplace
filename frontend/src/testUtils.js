import hashPassword from './utils.js';

function test_hashPassword(){
	if(hashPassword('Apple') != 'f223faa96f22916294922b171a2696d868fd1f9129302eb41a45b2a2ea2ebbfd'){
		console.log("Test failed at test_hashPassword('Apple')");
	}
	if(hashPassword('My desk looks depressing') != '385196c28426ee7b6ddb935f27849b0708ffb996e1bdc3741b021cb98894ed79'){
		console.log("Test failed at test_hashPassword('My desk looks depressing')");
	}
}

export default function testUtils(){
	console.log("Running testUtils.js...")
	test_hashPassword();
	console.log("Done with testUtils.js.\n")
}

testUtils();