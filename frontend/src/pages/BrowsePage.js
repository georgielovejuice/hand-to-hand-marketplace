import React, { useState, useEffect } from 'react'
import SearchBar from '../components/Searchbar'
import Container from '../components/Container'
export default function BrowsePage({apiURL, userID, setViewingItemID}) {
    const [items, setItems] = useState([]);
    const [error, setError] = useState("");
    const [searchText, setSearchText] = useState('');
    const [waitingForResponse, setWaitingForResponse] = useState(false);

    async function fetchItems(){
      setWaitingForResponse(true);      
      setError("");

      async function receivedResponse(response){
        setWaitingForResponse(false);      
        try{
          const objectFromResponse = await response.json();
          if(!response.ok)
            return setError(`Received HTTP status ${response.status} from server.`);
          if(objectFromResponse.error)
            return setError(objectFromResponse.error);            
          setItems(objectFromResponse.items);           
        }
        catch(err){
          if(err instanceof TypeError)
            return setError("Could not decode response from server.");
          if(err instanceof SyntaxError)
            return setError("Could not parse response from server as JSON.");
          throw err;
        }   
      }
      function catchException(excp){
        setWaitingForResponse(false);      
        if(excp instanceof TypeError)
          return setError("Lost connection to server.");
        throw excp;        
      }

      const responsePromise = fetch(apiURL, {
        method: "POST",
        body: JSON.stringify({
          requestType: "getItems",
          searchBarText: searchText,
          query: {},
          userID: userID
        }),
        headers: {'Content-Type': 'application/json'}
      });
      
      responsePromise.then(receivedResponse, catchException);
    }

  useEffect(() => {
    fetchItems()
  }, [searchText])
  
  const displayLoadingScreen = waitingForResponse && !error;

  return (
    <div className='min-h-screen bg-[#FEECD3]'>
      {
        displayLoadingScreen &&
        <div className="fixed z-10 flex justify-center items-center w-[100vw] h-[100vh] bg-[rgba(255,255,255,0.9)]">
            <p className="inline-block font-[500] text-[24px] text-[#FF9E21]">
              Thinking of items for you...
            </p>
        </div>
      }
      {
        error &&
        <div className="absolute z-10 flex flex-col justify-center items-center w-full h-full bg-[rgba(255,255,255,0.9)]">
            <p className="font-[500] text-[24px] text-red-500">
              {error}          
            </p>
            <button
                onClick={(_) => {
                  fetchItems();
                }}
                className="mt-[20px] w-[90px] h-[50px] rounded-[10px] bg-[#FF9E21]"
            >Reload</button>  
        </div>
      }
    
      <SearchBar setSearchText={setSearchText} fetchItems={fetchItems}></SearchBar>
      <div className='flex justify-center flex-wrap gap-9 p-6'>
      {items.map((item) => (
        //Added key because console was complaining.
        <Container item={item} key={item._id} setViewingItemID={setViewingItemID}/>
      ))}
      </div>
    </div>
  )
}
