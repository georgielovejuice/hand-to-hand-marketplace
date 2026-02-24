import React, { useState, useEffect } from 'react'
import SearchBar from '../components/Searchbar'
import Container from '../components/Container'
import axios from "axios";

export default function BrowsePage({apiURL, userID, setViewingItemID}) {
    const [items, setItems] = useState([]);
    const [searchText, setSearchText] = useState('');

    const fetchItems = async () => {
      try {
        const res = await axios.post("http://localhost:5001/api", {
            requestType: "getItems",
            searchBarText: searchText,
            query: {},
            userID: userID,
        })
        setItems(res.data.items)
      } catch (error) {
        console.error(error)
      }
    }

  useEffect(() => {

    fetchItems()
  }, [searchText])

  return (
    <>
    <div className='min-h-screen bg-orange-200'>
        <SearchBar setSearchText={setSearchText} fetchItems={fetchItems}></SearchBar>
        <div className='flex justify-center flex-wrap gap-9 p-6'>
        {items.map((item) => (
          <Container item={item} setViewingItemID={setViewingItemID}/>
        ))}
      </div>
    </div>
    </>
  )
}
