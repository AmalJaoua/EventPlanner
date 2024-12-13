import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react'; 
import './YourEvents.css';
import { Link } from 'react-router-dom';
import Delete from './Delete';  
import RequestEvent from './RequestEvent'; 
import { useToken } from './Tokencontext'; // Make sure you have a Tokencontext

const YourEvents = () => {
  const { token } = useToken(); // Access token from Tokencontext
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);  
  const [showRequestEventModal, setShowRequestEventModal] = useState(false); 
  const [eventToDelete, setEventToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/events', {
          method:'GET',
          headers: { Authorization: `Bearer ${token}` }, 
        });
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.filter(event => event.status === 1)); 
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };    
    fetchEvents();
  }, [token]); // Dependency array updated to include token
  console.log("These are my events",events);
  
  const upcomingEvents = events.filter(event => new Date(event.dateStart) > new Date());
  const pastEvents = events.filter(event => new Date(event.dateStart) <= new Date());
  console.log("These are my upcoming events",upcomingEvents);
  console.log("These are my past events",pastEvents);

  const handleDeleteClick = (eventId) => {
    setEventToDelete(eventId); 
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete the event');
      }
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDelete));
      setShowModal(false);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
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

  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="eventsPage">
      {events.length === 0 ? (
        <div className="noEvents">
           <h3 className='noEventsH3'>No events yet, create your event now!</h3>
           <button className="plusButton" onClick={handleRequestEventClick}>
              <Plus size={30} color="#244855" />
            </button>
         
        </div>
      ) : (
        <>
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
                <p className="eventDate">{new Date(event.dateStart).toISOString().split('T')[0]}</p>
                <div className="eventActions">
                  <Link to={`/event/${event.id}`}>
                    <button className="editBtn">
                      <Edit size={20} color="#4C8BFF" />
                    </button>
                  </Link>
                  <button
                    className="deleteBtn"
                    onClick={() => handleDeleteClick(event.id)}
                  >
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
                <p className="eventDate">{new Date(event.dateStart).toISOString().split('T')[0]}</p>
                <div className="eventActions">
                  <button className="viewDetailsBtn">View Details</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
  
      {showModal && (
        <Delete
          onClose={handleModalClose}
          onDelete={handleDelete}
          eventId={eventToDelete}
        />
      )}
  
      {showRequestEventModal && <RequestEvent onClose={handleRequestEventClose} />}
    </div>
  );  
};

export default YourEvents;
