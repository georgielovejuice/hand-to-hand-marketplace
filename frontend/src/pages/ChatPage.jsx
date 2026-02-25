import {useState, useEffect} from 'react';

export default function ChatPage({APIDomain, JWTToken, userID, otherChatUserID, itemID}){
    const FIRST_CHARACTER = 0;
    const MAX_SENDING_TEXT_CHARACTERS = 255;
    const MILLISECONDS_BETWEEN_MESSAGE_FETCH = 3000;
    
    const [error, setError] = useState('');
    const [chatObjects, setChatObjects] = useState([]);
    const [typingText, setTypingText] = useState('');
    const [confirmingSelling, setConfirmingSelling] = useState(false);
    const [metadataForChat, setMetadataForChat] = useState({
        selfIsSeller: false,
        otherUserID: otherChatUserID,
        otherUserName: '',
        otherUserProfilePictureURL: '',
        itemName: '',
        //Hides sell button also, so it also indicates the item has been sold
        isReadOnly: false,
    });
    const [msSinceLastMessageFetch, setMsSinceLastMessageFetch] = useState(0);

    async function fetchChatAndRedraw(){
        let response = null;
        try {
            /*
            Based on Window.fetch(), raises
            - AbortError if abort() is called
            - TypeError if
                - request URL is invalid
                - request blocked by permissions policy
                - network error
            - from await
            */
            response = await fetch(`${APIDomain}/chat/`, {
                method: "GET",
                headers: {
                    Authorization: JWTToken,
                    itemID: itemID,
                    otherUserID: metadataForChat.otherUserID,
                },
            });
        }catch(err){
            //No catch for AbortError, React couldn't find its definition
            if(err instanceof TypeError) return setError("Couldn't connect to server.");		
            throw err;
        }
        
        let objectFromResponse;
        try{
			/*
			Raises
			- AbortError if abort() is called
			- TypeError if couldn't decode response body
			- SyntaxError if body couldn't be parsed as json
			- something from await
			*/
			objectFromResponse = await response.json();
			
			if(!(response.ok)){
				setError(objectFromResponse.message
                        || ("Received HTTP status " + response.status + " from server."));
				return;
			}
        } catch (err) {
            //No catch for AbortError, React couldn't find its definition
            if(err instanceof TypeError) return setError("Couldn't decode body of server response.");		
            if(err instanceof SyntaxError) return setError("Couldn't parse JSON response from server.");						
            throw err;
    }
        
        if(!(objectFromResponse instanceof Array)) 
            return setError("Response not an Array.");
        setError('');
        
        setChatObjects(chatObjects => objectFromResponse);
    }
    
    
    async function getMetadataForChat(){        
        let response = null;
        try {
            response = await fetch(`${APIDomain}/chat/metadata/`, {
                method: "GET",
                headers: {
                    Authorization: JWTToken, 
                    itemID: itemID,
                    otherUserID: metadataForChat.otherUserID
                },
            });
        }catch(err){
            if(err instanceof TypeError) return setError("Couldn't connect to server.");		
            throw err;
        }
        
        setError('');
        
        let objectFromResponse;
        try{
            objectFromResponse = await response.json();
            if(!response.ok)
                return setError(objectFromResponse.message || ("Received HTTP status " + response.status + " from server."));
                setMetadataForChat(metadataForChat => (objectFromResponse));
        } catch (err) {
            if(err instanceof TypeError) return setError("Couldn't decode body of server response.");		
            if(err instanceof SyntaxError) return setError("Couldn't parse JSON response from server.");						
            throw err;
        }
    }    
    
    
    async function sendMessage(){
        if(typingText.trim().length < 1) return;
        setTypingText('');
        
        let response = null;
        try {
            response = await fetch(`${APIDomain}/chat/`, {
                method: "POST",
                headers: {
                    Authorization: JWTToken, 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemID: itemID,
                    message: typingText.trim(),
                    receiver: metadataForChat.otherUserID,
                }),
            });
        }catch(err){
            if(err instanceof TypeError) return setError("Couldn't connect to server.");		
            throw err;
        }
        
        setError('');
        if(response.ok) return await fetchChatAndRedraw();
        
            let objectFromResponse;
        try{
            objectFromResponse = await response.json();
            setError(objectFromResponse.message || ("Received HTTP status " + response.status + " from server."));
        } catch (err) {
            if(err instanceof TypeError) return setError("Couldn't decode body of server response.");		
            if(err instanceof SyntaxError) return setError("Couldn't parse JSON response from server.");						
            throw err;
        }
    }
    
    async function sellItem(){
        let response;
        try{
            response = await fetch(`${APIDomain}/myitems/sell`, {
                method: "POST",
                headers: {
                    Authorization: JWTToken, 
                    'Content-Type': 'application/json',
                    itemid: itemID
                },
            });          
        }catch(err){
            if(err instanceof TypeError) return setError("Couldn't connect to server.");		
            throw err;            
        }
        
        if(response.ok) return;
        let objectFromResponse;
        try{
            objectFromResponse = await response.json();
            setError(objectFromResponse.message || ("Received HTTP status " + response.status + " from server."));
        } catch (err) {
            if(err instanceof TypeError) return setError("Couldn't decode body of server response.");		
            if(err instanceof SyntaxError) return setError("Couldn't parse JSON response from server.");						
            throw err;
        }
    }
    
    //Get metadata only for first time
    useEffect(() => {
        fetchChatAndRedraw();
        getMetadataForChat();
    }, []);
    
    //Fetch chat in interval
    useEffect(() => {
        const intervalID = setInterval(() => {
            setMsSinceLastMessageFetch(msSinceLastMessageFetch => msSinceLastMessageFetch + MILLISECONDS_BETWEEN_MESSAGE_FETCH);
        }, MILLISECONDS_BETWEEN_MESSAGE_FETCH);
        if(msSinceLastMessageFetch < MILLISECONDS_BETWEEN_MESSAGE_FETCH) 
            return () => clearInterval(intervalID);
        fetchChatAndRedraw();
        setMsSinceLastMessageFetch(0);
        return () => clearInterval(intervalID);
    }, [msSinceLastMessageFetch]);
    
    function ChatBubble({chatObject}){
        const userIsSender = (chatObject.sender === userID);
        const positionAttributes = userIsSender ? "float-right " : "float-left ";
        
        function Bubble(){
            return (
                <p className="inline-block rounded-[30px] mt-[5px] bg-[#C93400] p-[10px] pl-[20px] pr-[20px]">
                    {chatObject.content}
                </p>
            );            
        }
        
        return (
            <div className={"block clear-both mb-[20px] " + positionAttributes}>
                {
                    userIsSender ? null 
                    : <img src={metadataForChat.otherUserProfilePictureURL} alt='' className='inline-block mr-[20px] w-[60px] h-[60px] rounded-[30px]'/>
                }
            <div className='inline-block align-middle'>
                    <p className={userIsSender ? 'text-right text-[#370A00]' : 'text-left text-[#370A00]'}>{userIsSender ? 'Me' : metadataForChat.otherUserName}</p>
                    <Bubble/>
                </div>
            </div>
        );
    }
    
    function SellConfirmPopup(){
        return (
            <div className="absolute block flex justify-center items-center top-0 left-0 w-[99.2vw] h-[100vh] bg-[rgba(255,255,255,0.5)]">
                <div className="flex flex-col items-center">
                    <h2 className="pt-[15px] pl-[30px] text-[30px] text-[#FF9E21] font-bold text-center">Confirm selling "{metadataForChat.itemName}" to "{metadataForChat.otherUserName}"?</h2>
                    <div className="left-[50%] mt-[20px]">
                        <button
                            onClick={async () => {
                                await sellItem();
                                setMetadataForChat({...metadataForChat, isReadOnly: true});
                                setConfirmingSelling(false);
                            }}
                            className="mr-[50px] w-[90px] h-[50px] rounded-[10px] bg-[#FF9E21]"
                        >Yes</button>
                        <button 
                            onClick={(e) => {setConfirmingSelling(false);}} 
                            className="w-[90px] h-[50px] border-[2px] border-[#FF9E21] rounded-[10px] text-[#FF9E21]"
                        >No</button>                 
                    </div>
                </div>
          </div>      
        );
    }
    
    function Header(){
        const sellButtonShouldAppear = (metadataForChat.selfIsSeller && !metadataForChat.isReadOnly);
      
        return (
            <div className="h-[80px] bg-[#370A00]">
                <img src={metadataForChat.otherUserProfilePictureURL}
                    alt='Other chatting user profile'
                    className="inline-block rounded-[30px] h-[60px] w-[60px] mt-[10px] ml-[12vw] mr-[30px]"
                />
                <label className="inline-block align-middle mr-[15px] text-[30px] font-semibold">{metadataForChat.otherUserName}</label>
                <label className="inline-block align-middle mt-[2px] text-[24px] font-semibold"> on "{metadataForChat.itemName}"</label>
                {
                    sellButtonShouldAppear
                    && <button 
                        onClick={(e) => {setConfirmingSelling(true);}}
                        className="inline-block float-right mr-[12vw] mt-[10px] w-[90px] h-[50px] rounded-[10px] text-[24px] font-semibold bg-[#C93400]"
                        >Sell</button>
                }
            </div>        
        );
    }
    
    return (
        <div className="w-[99.2vw] h-[100vh] bg-[#FFDEB8]">
            {
                confirmingSelling && <SellConfirmPopup/>
            }

            <Header/>
            <div className="overflow-y-auto w-[100%] h-[70vh] pl-[12vw] pr-[12vw] pt-[50px] bg-[#FFDEB8]">
            {
                chatObjects.map(chatObject => <ChatBubble chatObject={chatObject}/>)
            }
            </div>
            
            <div className="absolute left-[12vw] rounded-[15px] bg-white w-[75vw] h-[50px]">
                <textarea
                    value={typingText}
                    placeholder={metadataForChat.isReadOnly ? "The item has been sold." : "Your message here..."}
                    onChange={(htmlEvent) => {
                        if(!metadataForChat.isReadOnly){
                            setTypingText(htmlEvent.target.value.substr(FIRST_CHARACTER, MAX_SENDING_TEXT_CHARACTERS));
                        }
                    }}
                    className="w-[80%] h-[100%] resize-none ml-[20px] p-[10px] pt-[12px] border-0 outline-none text-black bg-white overflow-y-auto"
                />
                <img onClick={sendMessage} src="/chatsend.png" className="float-right h-[30px] mr-[20px] mt-[10px]" alt='send button'/>
            </div>            

            <p style={{color: 'red'}}>{error}</p>
        </div>
    );
}