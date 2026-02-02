import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import BrowsePage from './BrowsePage.js';
import MyItems from './pages/MyItems.js';

import HomeTab from './HomeTab.js';

import './App.css';
import {useState} from 'react';

function App() {
	const apiURL = "http://localhost:5001/api";
	
	const [currentPage, setCurrentPage] = useState('Login');
	const [userObject, setUserObject] = useState({
		token: '',
		name: '',
		profilePictureURL: '',
		phoneNumber: '',
	});
	const [errorMessage, setErrorMessage] = useState('');
	
	let displayPage = null;
	switch(currentPage){
		case('Login'):
			displayPage = <Login
				credentialsVerifierURL={apiURL + '/auth/login'} 
				redirectToHome={() => setCurrentPage('Browse')} 
				redirectToRegister={() => setCurrentPage('Register')}
				setUserObject={setUserObject}
			/>;
			break;
		case('Register'):
			displayPage = <Register
				registrationURL={apiURL + '/auth/register'} 
				redirectToLogin={() => {setCurrentPage('Login')}}	
			/>;
			break;
		case('Browse'):
			displayPage = <BrowsePage apiURL={apiURL}/>
			break;
		case('My Items'):
			displayPage = <MyItems token={userObject.token} API_URL={apiURL}/>
			break;
		case('Your Page'):
			displayPage = <Profile
				profileAPIURL={apiURL + '/profile'}
				changePasswordAPIURL={apiURL + '/profile/password'}
				userObject={userObject}
				setUserObject={setUserObject}
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
				username={userObject.name}
				userProfilePictureURL={userObject.profilePictureURL}
				logout={() => {
					setUserObject(null);
					setCurrentPage('Login');
				}}
			/>
		}
		{displayPage}
    </div>
  );
}

export default App;
