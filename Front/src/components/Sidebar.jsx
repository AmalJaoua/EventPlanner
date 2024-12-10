import React from "react";
import "./Sidebar.css";

const Sidebar = ({ event }) => {
  return (
    <div className="sidebar">
      <h2>Event Details</h2>
      <div className="details">
        <p><strong>Name:</strong> {event.name}</p>
        <p><strong>Start Date:</strong> {new Date(event.dateStart).toLocaleString()}</p>
        <p><strong>End Date:</strong> {new Date(event.dateEnd).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Sidebar;
