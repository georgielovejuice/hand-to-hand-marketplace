import React from 'react'
import { Route, Routes } from 'react-router';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import TestAuth from './pages/Testing';

const App = () => {
  return (
    <div data-theme="coffee">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path='/test' element={<TestAuth/>}/>
      </Routes>
      </div>
  )
}

export default App;