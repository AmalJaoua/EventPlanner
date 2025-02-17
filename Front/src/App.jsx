import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Signup from './components/Signup';
import Login from './components/Login'; 
import ManageEvent from './components/ManageEvent';  
import Landing from './components/Landing';
import YourEvents from './components/YourEvents';
import AdminDashboard from './components/AdminDashboard';
import { TokenProvider } from './components/Tokencontext';
import AttendeesPage from './components/AttendeesPage';

function App() {
  return (
    <TokenProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event/:eventId" element={<ManageEvent />} />
        <Route path="/event/oc/:eventId" element={<AttendeesPage />} />
        <Route path="/yourevents" element={<YourEvents />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
    </TokenProvider>
  );
}

export default App
