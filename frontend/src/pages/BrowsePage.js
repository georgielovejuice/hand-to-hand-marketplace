import React, { useState, useEffect } from 'react'
import SearchBar from '../components/Searchbar'
import Container from '../components/Container'
import axios from "axios";

export default function BrowsePage({apiURL, userID, setViewingItemID}) {
    const [items, setItems] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [waitingForResponse, setWaitingForResponse] = useState(false);

    const fetchItems = async () => {
      function receivedResponse(response){
        setWaitingForResponse(false);
        setItems(response.data.items);    
      }
        
      try {
        const responsePromise = axios.post("http://localhost:5001/api", {
            requestType: "getItems",
            searchBarText: searchText,
            query: {},
            userID: userID,
        });
        
        setWaitingForResponse(true);
        responsePromise.then(receivedResponse, alert);
        
      } catch (error) {
        console.error(error)
      }
    }

  useEffect(() => {

    fetchItems()
  }, [searchText])

  return (
    <div className='min-h-screen bg-orange-200'>
      {
        waitingForResponse && 
        <div className="absolute flex justify-center items-center w-[100vw] h-[100vh] bg-[rgba(255,255,255,0.9)]">
            <p className="inline-block font-[500] text-[24px] text-[#FF9E21]">
              Thinking of items for you...
            </p>
        </div>
      }
      <SearchBar setSearchText={setSearchText} fetchItems={fetchItems}></SearchBar>
      <div className='flex justify-center flex-wrap gap-9 p-6'>
      {items.map((item) => (
        <Container item={item} setViewingItemID={setViewingItemID}/>
      ))}
      </div>
      
    </div>
  )
}
