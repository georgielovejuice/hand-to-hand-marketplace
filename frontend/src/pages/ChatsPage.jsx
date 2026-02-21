import {useState, useEffect} from 'react';

export default function ChatsPage({APIDomain, JWTToken, userID, redirectToChatPage}){
    const MILLISECONDS_BETWEEN_MESSAGE_FETCH = 3000;
    
    const [chatPreviewObjects, setChatPreviewObjects] = useState([]);
    const [errorMessage, setErrorMessage] = useState([]);
    const [msSinceLastMessageFetch, setMsSinceLastMessageFetch] = useState(0);

    function ChatPreviewElement({chatPreviewObject}){ 
        return(
            <button onClick={() => {
                    redirectToChatPage(chatPreviewObject.itemID, chatPreviewObject.otherUserID);
                }} 
                className=" p-[5px] mb-[5px] block bg-zinc-700 text-white"
            >                
                {`${chatPreviewObject.itemName}: ${chatPreviewObject.lastMessage}`}
            </button>
        );
    }

    async function fetchChatPreviews(){
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
            response = await fetch(`${APIDomain}/chat/preview`, {
                method: "GET",
                headers: {Authorization: JWTToken},
            });
        }catch(err){
            //No catch for AbortError, React couldn't find its definition
            if(err instanceof TypeError) return setErrorMessage("Couldn't connect to server.");		
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
				setErrorMessage(objectFromResponse.message 
                                || ("Received HTTP status " + response.status + " from server."));
				return;
			}
        } catch (err) {
			//No catch for AbortError, React couldn't find its definition
			if(err instanceof TypeError) return setErrorMessage("Couldn't decode body of server response.");		
			if(err instanceof SyntaxError) return setErrorMessage("Couldn't parse JSON response from server.");						
            throw err;
		}

        if(!(objectFromResponse instanceof Array)) 
            return setErrorMessage("Response not an Array.");
        setChatPreviewObjects(objectFromResponse);
    }
    
    useState(() => {
        fetchChatPreviews();
    }, []);
    
    useEffect(() => {
        const intervalID = setInterval(() => {
            setMsSinceLastMessageFetch(msSinceLastMessageFetch => msSinceLastMessageFetch + MILLISECONDS_BETWEEN_MESSAGE_FETCH);
        }, MILLISECONDS_BETWEEN_MESSAGE_FETCH);
        if(msSinceLastMessageFetch < MILLISECONDS_BETWEEN_MESSAGE_FETCH) return () => clearInterval(intervalID);
        fetchChatPreviews();
        setMsSinceLastMessageFetch(0);
        return () => clearInterval(intervalID);
    }, [msSinceLastMessageFetch]);

    return(
        <div>
        <h1 className="text-[48px]">Chats</h1>
        {
            chatPreviewObjects.map(object => <ChatPreviewElement chatPreviewObject={object}/>)
        }
        <p style={{color: 'red'}}>{errorMessage}</p>
        </div>
    );
}