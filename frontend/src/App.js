import LoginPage from './LoginPage.js';
import RegisterPage from './RegisterPage.js';
import YourPage from './YourPage.js'

import './App.css';
import {useState} from 'react';

function App() {
	const apiURL = "http://localhost:5001/api";
	
	const [pageToRedirectTo, setPageToRedirectTo] = useState('Login');
	const [username, setUsername] = useState(null);
	const [hashedPassword, setHashedPassword] = useState(null);	
	
	let displayPage = null;
	switch(pageToRedirectTo){
		case('Login'):
			displayPage = <LoginPage 
				apiURL={apiURL} 
				redirectToHome={() => setPageToRedirectTo('Home')} 
				redirectToRegister={() => setPageToRedirectTo('Register')}
				setUsername={setUsername}
				setHashedPassword={setHashedPassword}
			/>;
			break;
		case('Register'):
			displayPage = <RegisterPage 
				apiURL={apiURL} 
				redirectToHome={() => {setPageToRedirectTo('Home')}} 
				redirectToLogin={() => {setPageToRedirectTo('Login')}}
				setUsername={setUsername}
				setHashedPassword={setHashedPassword}				
			/>;
			break;
		case('Home'):
			displayPage = <div>
					<button>Browse</button>
					<button>Chat</button>
					<button>Your items</button>
					<button onClick={() => {setPageToRedirectTo("Your Page");}}>{username}</button>					
				</div>
			break;
		case('Your Page'):
			displayPage = <YourPage
				redirectToHome={() => {setPageToRedirectTo("Home");}}
				redirectToLogin={() => {setPageToRedirectTo("Login");}}
				username={username}
				clearUsername={() => {setUsername(null);}}
				clearHashedPassword={() => {setHashedPassword(null);}}
			/>
			break;
		default: 
			displayPage = 
				<div>
					<p>{pageToRedirectTo} page not implemented.</p>
					<button onClick={() => {setPageToRedirectTo('Login');}}>To Login</button>
				</div>
	}
	
  return (
    <div>
		{displayPage}
    </div>
  );
}

export default App;
