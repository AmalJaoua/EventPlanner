import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Signup from './components/Signup';
import Login from './components/Login'; 
import ManageEvent from './components/ManageEvent';  
import Landing from './components/Landing';
import YourEvents from './components/YourEvents';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event/:id" element={<ManageEvent />} />
        <Route path="/yourevents" element={<YourEvents />} />
      </Routes>
    </Router>
  );
}

export default App
