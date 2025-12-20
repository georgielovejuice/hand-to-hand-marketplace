export default function YourPage({
	redirectToHome,
	redirectToLogin,
	username,
	clearUsername,
	clearHashedPassword
}){
	function Logout(){
		clearUsername();
		clearHashedPassword();
		redirectToLogin();
	}
	
	return(
		<div>
			<p>Logged in as {username}</p>
			<button onClick={redirectToHome}>Back to home</button>
			<button onClick={Logout}>Log out</button>
		</div>
	);
}