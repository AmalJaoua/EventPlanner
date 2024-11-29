import React, { useState } from 'react';
import './Delete.css'; // This will contain the styles

const Delete = ({ onClose, onDelete }) => {
  const [reason, setReason] = useState('');

  const handleDeleteClick = () => {
    onDelete(reason);  // Pass the reason for deletion
    onClose();  // Close the modal
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
