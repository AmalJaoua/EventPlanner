import React, { useState, useEffect, useCallback } from 'react';
import { X, Check } from 'lucide-react';
import './AdminDashboard.css';
import { useToken } from './Tokencontext'; // Assuming you're using a context to store the token

const RequestedMaterials = () => {
  const { token } = useToken(); // Get the token from context or any other state management solution
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback for fetchMaterials
  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/resources/adminMaterials', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }

      const data = await response.json();
      setMaterials(data);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setError('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]); // Run fetchMaterials when the component mounts

  const handleStatusChange = async (materialId, eventId, status) => {
    try {
      const response = await fetch('http://localhost:3000/resources/materialXevent/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ materialId, eventId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Optimistically update the status in the UI
      const updatedMaterials = materials.map((material) => {
        if (material.material.id === materialId) {
          material.events = material.events.map((event) => {
            if (event.id === eventId) {
              event.status = status; // Update the status of the event
            }
            return event;
          });
        }
        return material;
      });

      setMaterials(updatedMaterials);
      await fetchMaterials(); // Refetch materials to ensure data is up to date
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status');
    }
  };

  if (loading) {
    return <p>Loading materials...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (materials.length === 0) {
    return <h2>No materials requests submitted</h2>;
  }

  return (
    <>
      <h3>Requested Materials</h3>
      <div className="eventListHeader">
        <p className="headerItem">Material</p>
        <p className="headerItem">Event</p>
        <p className="headerItem">Date</p>
        <p className="headerItem actionHeader">Action</p>
      </div>
      <ul className="eventList">
        {materials.map((material) =>
          material.events.map((event) => (
            <li key={`${material.material.id}-${event.id}`} className="eventItem">
              <p className="eventName">{material.material.name}</p>
              <p className="eventName">{event.name}</p>
              <p className="eventName">{new Date(event.dateStart).toLocaleString()}</p>
              <div className="eventActions">
                <button
                  className="approveBtn"
                  onClick={() => handleStatusChange(material.material.id, event.id, 1)}
                >
                  <Check size={20} color="green" />
                </button>
                <button
                  className="rejectBtn"
                  onClick={() => handleStatusChange(material.material.id, event.id, null)}
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

export default RequestedMaterials;
