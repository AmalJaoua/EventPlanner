import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react'; 
import './AdminDashboard.css';
import { useToken } from './Tokencontext'; // Assuming you're using a context to store the token

const RequestedMaterials = () => {
  const { token } = useToken(); // Get the token from context or any other state management solution
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
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
    };

    fetchMaterials();
  }, [token]);

  const handleStatusChange = async (materialId, eventId, status) => {
    try {
      console.log('Sending PUT request with materialId:', materialId, 'eventId:', eventId, 'status:', status);

      const response = await fetch('http://localhost:3000/resources/materialXevent/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ materialId, eventId, status }), // Pass materialId, eventId, and status
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

      setMaterials(updatedMaterials); // Update the state to reflect the status change

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
        {materials.map((material) => (
          material.events.map((event) => (
            <li key={`${material.material.id}-${event.id}`} className="eventItem">
              <p className="eventName">{material.material.name}</p>
              <p className="eventName">{event.name}</p>
              <p className="eventName">{new Date(event.dateStart).toLocaleString()}</p>
              <div className="eventActions">
                <button 
                  className="approveBtn" 
                  onClick={() => handleStatusChange(material.material.id, event.id, 1)} // Approve status
                >
                  <Check size={20} color="green" />
                </button>
                <button 
                  className="rejectBtn" 
                  onClick={() => handleStatusChange(material.material.id, event.id, 0)} // Reject status
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

export default RequestedMaterials;
