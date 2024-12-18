import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';
import Delete from './Delete';
import { useToken } from './Tokencontext'; // Assuming you're using a context to store the token

const AllEventsAdmin = () => {
 
  const { token } = useToken(); // Get the token from context or any other state management solution
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from the backend with authorization token
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/events', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        setError('Error fetching events');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchEvents();
    }
  }, [token]);

  // Handle delete click
  const handleDeleteClick = (eventId) => {
    setEventToDelete(eventId);
    setShowModal(true);
  };

  // Delete event by making a DELETE request to the backend with authorization token
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the event');
      }
     
      // Remove event from local state after successful deletion
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventToDelete));
      setShowModal(false);
      
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  // Show loading or error message
  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const upcomingEvents = events.filter((event) => new Date(event.dateEnd) > new Date());
  const pastEvents = events.filter((event) => new Date(event.dateEnd) <= new Date());

  return (
    <>
      <div className="headerSection">
        <h2>All Events</h2>
        <Link to="/create-event">
          <button className="plusButton">
            <Plus size={30} color="#244855" />
          </button>
        </Link>
      </div>

      <h3>Upcoming Events</h3>
      <div className="eventListHeader">
        <p className="headerItem">Name</p>
        <p className="headerItem dateHeader">Date</p>
        <p className="headerItem actionHeader">Action</p>
      </div>
      <ul className="eventList">
        {upcomingEvents.map((event) => (
          <li key={event.id} className="eventItem">
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
        {pastEvents.map((event) => (
          <li key={event.id} className="eventItem">
            <p className="eventName">{event.name}</p>
            <p className="eventDate">{event.date}</p>
            <div className="eventActions">
              <Link to={`/event/${event.id}`}>
                <button className="viewDetailsBtn">View Details</button>
              </Link>
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
    </>
  );
};

export default AllEventsAdmin;
