import React, { useState, useContext } from 'react';
import axios from 'axios'; 
import { TokenContext } from './Tokencontext'; 
import './Delete.css';

const Delete = ({ onClose, eventId }) => { 
  const { token } = useContext(TokenContext);
  const [reason, setReason] = useState('');

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`http://localhost:3000/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Event deleted successfully!');
      onClose(); 
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <h3>Are you sure you want to delete this event?</h3>
        <textarea 
          placeholder="Write the reason for cancellation..." 
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="modalButtons">
          <button className="discardBtn" onClick={onClose}>Discard</button>
          <button className="deleteBtn1" onClick={handleDeleteClick}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
