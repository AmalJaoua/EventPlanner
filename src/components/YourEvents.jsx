import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react'; 
import './YourEvents.css';

const YourEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventList = [
        { name: "WiEmpower 1.0", date: "2024-12-01" },
        { name: "AI Workshop", date: "2024-12-05"},
        { name: "Hackathon", date: "2024-12-10" },
        { name: "Past Event 1", date: "2024-11-25"},
        { name: "Past Event 2", date: "2024-11-20"},
      ];
      setEvents(eventList);
    };

    fetchEvents();
  }, []);


  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
  const pastEvents = events.filter(event => new Date(event.date) <= new Date());

  return (
    <div className="eventsPage">
      <div className="headerSection">
        <h2>Your Events</h2>
        <button className="plusButton" >
          <Plus size={30} color="#244855" />
        </button>
      </div>

      <h3>Upcoming Events</h3>
      <div className="eventListHeader">
        <p className="headerItem">Name</p>
        <p className="headerItem dateHeader">Date</p>
        <p className="headerItem actionHeader">Action</p>
      </div>
      <ul className="eventList">
        {upcomingEvents.map((event, index) => (
          <li key={index} className="eventItem">
            <p className="eventName">{event.name}</p>
            <p className="eventDate">{event.date}</p>
            <div className="eventActions">
              <button className="editBtn">
                <Edit size={20} color="#4C8BFF" />
              </button>
              <button className="deleteBtn">
                <Trash2 size={20} color="#E64833" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Past Events</h3>
      <div className="eventListHeader">
        <p className="headerItem">Name</p>
        <p className="headerItem dateHeader">Date</p>
        <p className="headerItem actionHeader">Action</p>
      </div>
      <ul className="eventList">
        {pastEvents.map((event, index) => (
          <li key={index} className="eventItem">
            <p className="eventName">{event.name}</p>
            <p className="eventDate">{event.date}</p>
            <div className="eventActions">
              <button className="viewDetailsBtn">
                View Details
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourEvents;
