import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Signup from './components/Signup';
import Login from './components/Login'; 
import ManageEvent from './components/ManageEvent'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/event/:id" element={<ManageEvent />} />
      </Routes>
    </Router>
  );
}

export default App
