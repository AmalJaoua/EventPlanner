import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import './AdminDashboard.css';
import { useToken } from './Tokencontext'; // Assuming you're using a context to store the token

const RequestedLocals = () => {
  const { token } = useToken(); // Get the token from context or any other state management solution

  const [locals, setLocals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocals = async () => {
      try {
        const response = await fetch('http://localhost:3000/resources/adminLocals', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch locals');
        }

        const data = await response.json();
        setLocals(data);
      } catch (error) {
        console.error('Error fetching locals:', error);
        setError('Failed to fetch locals');
      } finally {
        setLoading(false);
      }
    };

    fetchLocals();
  }, [token]);

  const handleStatusChange = async (localId, eventId, status) => {
    // Log the localId, eventId, and status to the console
    console.log('Sending PUT request with localId:', localId, 'eventId:', eventId, 'status:', status);
  
    try {
      const response = await fetch('http://localhost:3000/resources/localXevent/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ localId, eventId, status }), // Pass localId, eventId, and status
      });
  
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
  
      const updatedLocal = locals.map(local => {
        if (local.id === localId) {
          local.events = local.events.map(event => {
            if (event.id === eventId) {
              event.status = status; // Update the event status locally
            }
            return event;
          });
        }
        return local;
      });
  
      setLocals(updatedLocal); // Update the state to reflect the status change
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  if (loading) {
    return <p>Loading locals...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h3>Requested Locals</h3>
      <div className="eventListHeader">
        <p className="headerItem">Local</p>
        <p className="headerItem">Event</p>
        <p className="headerItem dateHeader">Date</p>
        <p className="headerItem actionHeader">Action</p>
      </div>
      <ul className="eventList">
        {locals.map((local) => (
          local.events.map((event) => (
            <li key={`${local.id}-${event.id}`} className="eventItem">
              <p className="eventName">{local.local.name}</p>
              <p className="eventName">{event.name}</p>
              <p className="eventName">{new Date(event.dateStart).toLocaleString()}</p>
              <div className="eventActions">
                <button
                  className="approveBtn"
                  onClick={() => handleStatusChange(local.local.id, event.id, 1)} // 1 for approve
                >
                  <Check size={20} color="green" />
                </button>
                <button
                  className="rejectBtn"
                  onClick={() => handleStatusChange(local.local.id, event.id, 0)} // 0 for reject
                >
                  <X size={20} color="red" />
                </button>
              </div>
            </li>
          ))
        ))}
      </ul>
    </>
  );
};

export default RequestedLocals;
