import React, { useState, useEffect, useCallback } from 'react';
import { X, Check } from 'lucide-react';
import './AdminDashboard.css';
import { useToken } from './Tokencontext';

const RequestedLocals = () => {
  const { token } = useToken(); // Get the token from context or any other state management solution

  const [locals, setLocals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback for fetchLocals
  const fetchLocals = useCallback(async () => {
    try {
      setLoading(true);
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
  }, [token]); // Ensure fetchLocals has correct dependencies

  useEffect(() => {
    fetchLocals();
  }, [fetchLocals]); // Run fetchLocals when the component mounts

  const handleStatusChange = async (localId, eventId, status) => {
    try {
      const response = await fetch('http://localhost:3000/resources/localXevent/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ localId, eventId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedLocal = locals.map((local) => {
        if (local.id === localId) {
          local.events = local.events.map((event) => {
            if (event.id === eventId) {
              event.status = status; // Update the event status locally
            }
            return event;
          });
        }
        return local;
      });

      setLocals(updatedLocal);
      await fetchLocals(); // Refetch the data after updating
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

  if (locals.length === 0) {
    return <h2>No locals requests submitted</h2>;
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
        {locals.map((local) =>
          local.events.map((event) => (
            <li key={`${local.id}-${event.id}`} className="eventItem">
              <p className="eventName">{local.local.name}</p>
              <p className="eventName">{event.name}</p>
              <p className="eventName">{new Date(event.dateStart).toLocaleString()}</p>
              <div className="eventActions">
                <button
                  className="approveBtn"
                  onClick={() => handleStatusChange(local.local.id, event.id, 1)}
                >
                  <Check size={20} color="green" />
                </button>
                <button
                  className="rejectBtn"
                  onClick={() => handleStatusChange(local.local.id, event.id, null)}
                >
                  <X size={20} color="red" />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
};

export default RequestedLocals;
