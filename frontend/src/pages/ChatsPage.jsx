import {useState, useEffect} from 'react';

export default function ChatsPage({APIDomain, JWTToken, userID, redirectToChatPage}){
    const MILLISECONDS_BETWEEN_MESSAGE_FETCH = 5000;
    
    const [chatPreviewObjects, setChatPreviewObjects] = useState([]);
    const [errorMessage, setErrorMessage] = useState([]);
    const [msSinceLastMessageFetch, setMsSinceLastMessageFetch] = useState(0);

    function ChatPreviewElement({chatPreviewObject}){
        function truncateString(string, maxCharacters){
            const FIRST_CHARACTER = 0;
            return string.length > maxCharacters ? (string.substr(FIRST_CHARACTER, maxCharacters) + '...') : string;
        }
            
        return(
            <button onClick={() => {
                    redirectToChatPage(chatPreviewObject.itemID, chatPreviewObject.otherUserID);
                }} 
                className="w-[100%] h-[75px] mb-[20px] block bg-[#C93400]"
            >
                <img className="float-left object-cover w-[120px] h-[100%]" src={chatPreviewObject.itemImageURL}>
                </img>
                <div className="float-left ml-[20px]">
                    <h3 className="mt-[8px] text-left font-semibold text-[22px] text-[#FFD6A7]">{truncateString(chatPreviewObject.itemName, 40)}</h3>
                    <p  className="ml-[1px] text-left font-semibold text-[16px]">
                    {truncateString(`${chatPreviewObject.senderName}: ${chatPreviewObject.lastMessage}`, 70)}
                    </p>
                </div>
                <p className="float-right mt-[47px] mr-[40px] text-[10px]">{new Date(chatPreviewObject.timepoint).toLocaleString()}</p>
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
        <div className="w-[100%] h-[100%] bg-[#FEECD3]">
            <h1 className="text-[48px] ml-[35px] pt-[15px] font-[700] text-[#7C2808]">Chats</h1>
            <div className="overflow-y-auto overflow-x-auto w-[75vw] h-[80vh] mt-[30px] ml-[12vw]">
            {
                chatPreviewObjects.map(object => <ChatPreviewElement chatPreviewObject={object}/>)
            }
            </div>
        <p style={{color: 'red'}}>{errorMessage}</p>
        </div>
    );
}