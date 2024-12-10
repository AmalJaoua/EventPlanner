import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Signup from './components/Signup';
import Login from './components/Login'; 
import ManageEvent from './components/ManageEvent';  
import Landing from './components/Landing';
import YourEvents from './components/YourEvents';
import { TokenProvider } from './components/Tokencontext';
function App() {
  return (
    <TokenProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event/:eventId" element={<ManageEvent />} />
        <Route path="/yourevents" element={<YourEvents />} />
      </Routes>
    </Router>
    </TokenProvider>
  );
}

export default App
