import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import BrowsePage from './pages/BrowsePage.js';
import MyItems from './pages/MyItems.js';
import ItemPage from './pages/ItemPage.js';
import ChatPage from './pages/ChatPage.jsx'
import ChatsPage from './pages/ChatsPage.jsx'

import HomeTab from './HomeTab.js';
import Navbar from './components/Navbar.jsx';

import './App.css';
import {useState} from 'react';

function App() {
	const apiURL = "http://localhost:5001/api";
	
	const [currentPage, setCurrentPage] = useState('Login');
	const [userObject, setUserObject] = useState({
		_id: '',
		token: '',
		name: '',
		profilePictureURL: '',
		phoneNumber: '',
	});
    
    //These two should be set as default/unknown state whenever possible
	const [viewingItemID, setViewingItemID] = useState(null);
    const [otherChatUserID, setOtherChatUserID] = useState('');
	
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
			displayPage = <BrowsePage 
				apiURL={apiURL}
				setViewingItemID={(itemID) => {setCurrentPage("Item"); setViewingItemID(itemID);}}
        userID={userObject._id}
			/>
			break;
		case('My Items'):
			displayPage = <MyItems token={userObject.token} API_URL={apiURL}/>
			break;
		case('Your Page'):
			displayPage = <Profile
				userObject={userObject}
				setUserObject={setUserObject}
        API_URL={apiURL}
			/>
			break;
		case('Item'):
			displayPage = <ItemPage
				itemAPIURL={apiURL + '/myitems/' + viewingItemID}
				JWTToken={userObject.token}
                userID={userObject._id}
				redirectToChatPage={() => {setCurrentPage('Chat');}}
			/>
			break;
		case('Chat'):
			displayPage = <ChatPage 
				APIDomain={apiURL} 
				JWTToken={userObject.token}
				userID={userObject._id}
				itemID={viewingItemID}
                otherChatUserID={otherChatUserID}
			/>
			break;
        case('Chats'):
            displayPage = <ChatsPage
                APIDomain={apiURL}
                JWTToken={userObject.token}
                userID={userObject._id}
                redirectToChatPage = {(itemID, otherUserID) => {
                    setViewingItemID(viewingItemID => itemID);
                    setOtherChatUserID(otherChatUserID => otherUserID);
                    setCurrentPage('Chat');
                }}
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
			pagesWithoutPageTabs.includes(currentPage) ? null : <Navbar
				redirectToBrowsePage={() => {
                    setCurrentPage('Browse'); 
                    setViewingItemID(null);
                    setOtherChatUserID('');
                }}
				redirectToChatsPage={() => {
                    setCurrentPage('Chats');
                    setOtherChatUserID('');
                }}
				redirectToMyListingsPage={() => {
                    setCurrentPage('My Items');
                    setViewingItemID(null);
                    setOtherChatUserID('');
                }}
				redirectToProfilePage={() => {
                    setCurrentPage('Your Page');
                    setViewingItemID(null);
                    setOtherChatUserID('');
                }}
				username={userObject.name}
				userProfilePictureURL={userObject.profilePictureURL}
				logout={() => {
					setUserObject(null);
                    setOtherChatUserID('');
					setCurrentPage('Login');
				}}
			/>
		}
		{displayPage}
	</div>
  );
}

export default App;
