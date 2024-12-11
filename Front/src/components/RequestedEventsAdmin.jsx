import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react'; 
import './AdminDashboard.css';

const RequestedEventsAdmin = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventList = [
        { id: 1, name: "WiEmpower 1.0", date: "2024-12-21" },
        { id: 2, name: "AI Workshop", date: "2024-12-05" },
        { id: 3, name: "Hackathon", date: "2024-12-10" },
        { id: 5, name: "Past Event 1", date: "2024-11-25" },
        { id: 6, name: "Past Event 2", date: "2024-11-20" },
      ];
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  return (
    <>
      <h3>Upcoming Events</h3>
      <div className="eventListHeader">
        <p className="headerItem">Name</p>
        <p className="headerItem dateHeader">Date</p>
        <p className="headerItem actionHeader">Action</p>
      </div>
      <ul className="eventList">
        {events.map((event, index) => (
          <li key={index} className="eventItem">
            <p className="eventName">{event.name}</p>
            <p className="eventDate">{event.date}</p>
            <div className="eventActions">
                <button className="approveBtn">
                  <Check size={20} color="green" />
                </button>
              <button className="rejectBtn" >
                <X size={20} color='red' />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RequestedEventsAdmin;
