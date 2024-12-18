import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react'; 
import './AdminDashboard.css';
import { useToken } from './Tokencontext'; // Assuming you're using a context to store the token

const RequestedEventsAdmin = () => {
  const { token } = useToken(); // Get the token from context or any other state management solution

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); // State to store filtered events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/events', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add your token if required
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data); // Set all events

      } catch (error) {
        setError('Error fetching events');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]); // Re-run when token changes
console.log(events);
  // Filter events after they are fetched
  useEffect(() => {
    const pendingEvents = events.filter(event => event.status === 0);
    setFilteredEvents(pendingEvents); // Update state with filtered events
    console.log('Filtered Pending Events:', pendingEvents);
  }, [events]); // Only run when events change

  // Loading and error states
  if (loading) {
    return <p>Loading events...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h3>Upcoming Events</h3>
      <div className="eventListHeader">
        <p className="headerItem">Name</p>
        <p className="headerItem dateHeader">Date</p>
        <p className="headerItem actionHeader">Action</p>
      </div>
      <ul className="eventList">
        {filteredEvents.map((event) => (
          <li key={event.id} className="eventItem">
            <p className="eventName">{event.name}</p>
            <p className="eventDate">{event.date}</p>
            <div className="eventActions">
              <button className="approveBtn">
                <Check size={20} color="green" />
              </button>
              <button className="rejectBtn">
                <X size={20} color="red" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RequestedEventsAdmin;
