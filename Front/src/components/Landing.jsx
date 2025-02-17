import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css'; 

const Landing = () => {
  return (
    <div className="landingPage">
      <img className="logolanding" src="/logo.png" alt=""/>
      <h1 className="title">Event Planner</h1>
      <p className="description">
  Our <span className="highlight">Event Planner</span> offers a dedicated web platform where clubs and individuals can efficiently <span className="highlight">organize and  manage </span> their events. From <span className="highlight">user registration</span> to <span className="highlight">event creation</span> and <span className="highlight">participant tracking</span>, this solution ensures <span className="highlight">streamlined coordination</span> for all activities. <br /><span className="highlight">Join now</span> to stay connected and make the most of every opportunity at Sup'Com!
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
