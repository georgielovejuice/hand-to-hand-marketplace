import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx'
import BrowsePage from './BrowsePage.js'
import HomeTab from './HomeTab.js';

import './App.css';
import {useState} from 'react';

function App() {
	const apiURL = "http://localhost:5001/api";
	
	const [currentPage, setCurrentPage] = useState('Login');
	const [userEmail, setUserEmail] = useState(null);
	const [hashedPassword, setHashedPassword] = useState(null);	
	
	let displayPage = null;
	switch(currentPage){
		case('Login'):
			displayPage = <Login
				credentialsVerifierURL={apiURL + '/auth/login'} 
				redirectToHome={() => setCurrentPage('Browse')} 
				redirectToRegister={() => setCurrentPage('Register')}
				setUserEmail={setUserEmail}
				setHashedPassword={setHashedPassword}
			/>;
			break;
		case('Register'):
			displayPage = <Register
				registrationURL={apiURL + '/auth/register'} 
				redirectToHome={() => {setCurrentPage('Browse')}} 
				redirectToLogin={() => {setCurrentPage('Login')}}	
				setUserEmail={setUserEmail}
				setHashedPassword={setHashedPassword}
			/>;
			break;
		case('Browse'):
			displayPage = <BrowsePage apiURL={apiURL}/>
			break;
		case('Your Page'):
			displayPage = <Profile
				profileAPIURL={apiURL + '/profile'}
				changePasswordAPIURL={apiURL + '/profile/password'}
				userEmail={userEmail}
				hashedPassword={hashedPassword}
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
		{
			pagesWithoutPageTabs.includes(currentPage) ? null : <HomeTab
				redirectToBrowsePage={() => setCurrentPage('Browse')}
				redirectToChatsPage={() => setCurrentPage('Chats')}
				redirectToMyListingsPage={() => setCurrentPage('My Items')}
				redirectToProfilePage={() => setCurrentPage('Your Page')}
				logout={() => {setUserEmail(null); setHashedPassword(null); setCurrentPage('Login');}}
			/>
		}
		{displayPage}
    </div>
  );
}

export default App;
