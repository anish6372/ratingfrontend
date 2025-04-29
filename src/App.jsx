import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import './App.css'
import Login from './components/Login';
import Signup from './components/Signup';



import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import StoreOwnerDashboard from './components/StoreOwnerDashboard';

function App() {
 

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path='/user' element={<UserDashboard/>} />
        <Route path='/stores' element={<StoreOwnerDashboard/>} />
        
       
      </Routes>
    </Router>
     
    </>
  )
}

export default App
