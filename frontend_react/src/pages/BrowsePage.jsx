import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import SearchBar from '../components/Searchbar'
import Container from '../components/Container'
import { Link } from 'react-router'
import api from '../api/axio'


export default function BrowsePage() {
    const [items, setItems] = useState([])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("api/items")
        setItems(res.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchItems()
  }, [])

  return (
    <>
    <div className='min-h-screen bg-orange-200'>
        <Navbar></Navbar>
        <SearchBar></SearchBar>
        <div className='flex justify-center flex-wrap gap-9 p-6'>
        {items.map((item) => (
          <Link key={item._id} to={`/details/${item._id}`}>
            <Container item={item} />
          </Link>
        ))}
      </div>
         
    </div>
    </>


  )
}
