import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react'; 
import './YourEvents.css';
import { Link } from 'react-router-dom';
import Delete from './Delete';  
import RequestEvent from './RequestEvent'; 

const YourEvents = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);  
  const [showRequestEventModal, setShowRequestEventModal] = useState(false); 
  const [eventToDelete, setEventToDelete] = useState(null);  

  useEffect(() => {
    const fetchEvents = async () => {
      const eventList = [
        { id: 1, name: "WiEmpower 1.0", date: "2024-12-01" },
        { id: 2, name: "AI Workshop", date: "2024-12-05" },
        { id: 3, name: "Hackathon", date: "2024-12-10" },
        { id: 5, name: "Past Event 1", date: "2024-11-25" },
        { id: 6, name: "Past Event 2", date: "2024-11-20" },
      ];
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  const upcomingEvents = events.filter(event => new Date(event.date) > new Date());
  const pastEvents = events.filter(event => new Date(event.date) <= new Date());

  const handleDeleteClick = (eventId) => {
    setEventToDelete(eventId); 
    setShowModal(true);
  };

  const handleDelete = () => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDelete)); 
    setShowModal(false); 
  };

  const handleModalClose = () => {
    setShowModal(false); 
  };

  const handleRequestEventClick = () => {
    setShowRequestEventModal(true);
  };

  const handleRequestEventClose = () => {
    setShowRequestEventModal(false);
  };

  return (
    <div className="eventsPage">
      <div className="headerSection">
        <h2>Your Events</h2>
        <button className="plusButton" onClick={handleRequestEventClick}>
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
              <Link to={`/event/${event.id}`}>
                <button className="editBtn">
                  <Edit size={20} color="#4C8BFF" />
                </button>
              </Link>
              <button className="deleteBtn" onClick={() => handleDeleteClick(event.id)}>
                <Trash2 size={20} />
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

      {showModal && (
        <Delete 
          onClose={handleModalClose} 
          onDelete={handleDelete}
          eventId={eventToDelete} 
        />
      )}

      {showRequestEventModal && (
        <RequestEvent onClose={handleRequestEventClose} />
      )}
    </div>
  );
};

export default YourEvents;
