import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css'; 

const Landing = () => {
  return (
    <div className="landingPage">
      <h1 className="title">Event Planner</h1>
      <p className="description">
        Plan and organize your events effortlessly with Event Planner. Sign up to get started or log in to manage your events.
      </p>
      <div className="buttonGroup">
      <Link to="/signup">
          <button className="button signup">Sign Up</button>
        </Link>
        <Link to="/login">
          <button className="button login">Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
