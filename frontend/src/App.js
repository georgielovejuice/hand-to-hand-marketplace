import LoginPage from './LoginPage.js';
import RegisterPage from './RegisterPage.js';
import YourPage from './YourPage.js'
import BrowsePage from './BrowsePage.js'

import './App.css';
import {useState} from 'react';

function App() {
	const apiURL = "http://localhost:5001/api";
	
	const [currentPage, setCurrentPage] = useState('Login');
	const [username, setUsername] = useState(null);
	const [hashedPassword, setHashedPassword] = useState(null);	
	
	function PageTabs(){
		return(
			<div>
				<button onClick={() => {setCurrentPage('Browse');}}>Browse</button>
				<button onClick={() => {setCurrentPage('Chat');}}>Chat</button>
				<button onClick={() => {setCurrentPage('Your Items');}}>Your items</button>	
				<button onClick={() => {setCurrentPage("Your Page");}}>{username}</button>								
			</div>
		);
	}
	
	let displayPage = null;
	switch(currentPage){
		case('Login'):
			displayPage = <LoginPage 
				apiURL={apiURL} 
				redirectToHome={() => setCurrentPage('Browse')} 
				redirectToRegister={() => setCurrentPage('Register')}
				setUsername={setUsername}
				setHashedPassword={setHashedPassword}
			/>;
			break;
		case('Register'):
			displayPage = <RegisterPage 
				apiURL={apiURL} 
				redirectToHome={() => {setCurrentPage('Browse')}} 
				redirectToLogin={() => {setCurrentPage('Login')}}
				setUsername={setUsername}
				setHashedPassword={setHashedPassword}				
			/>;
			break;
		case('Browse'):
			displayPage = <BrowsePage apiURL={apiURL}/>
			break;
		case('Your Page'):
			displayPage = <YourPage
				redirectToHome={() => {setCurrentPage("Browse");}}
				redirectToLogin={() => {setCurrentPage("Login");}}
				username={username}
				clearUsername={() => {setUsername(null);}}
				clearHashedPassword={() => {setHashedPassword(null);}}
			/>
			break;
		default: 
			displayPage = <div>
				<p>{currentPage} page not implemented.</p>
				<button onClick={() => {setCurrentPage('Login');}}>To Login</button>
			</div>
	}
	
	const pagesWithoutPageTabs = ['Login', 'Register'];
	
  return (
    <div>
		{pagesWithoutPageTabs.includes(currentPage) ? null : <PageTabs/>}
		{displayPage}
    </div>
  );
}

export default App;
