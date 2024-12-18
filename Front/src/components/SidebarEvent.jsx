import React from 'react';
import { Link } from 'react-router-dom';
import { CircleArrowLeft } from 'lucide-react';
import './SidebarEvent.css';

const SidebarEvent = ({ event }) => {
  return (
    <div className="sidebar">
      <div className="titleSideBar">
        <Link to="/yourevents">
          <button className="backButton"><CircleArrowLeft /></button>
        </Link>
        <h2>Event Details</h2>
      </div>
      <div className="details">
        <p><strong>Name:</strong> {event.name}</p>
        <p><strong>Start Date:</strong> {new Date(event.dateStart).toLocaleString()}</p>
        <p><strong>End Date:</strong> {new Date(event.dateEnd).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default SidebarEvent;
