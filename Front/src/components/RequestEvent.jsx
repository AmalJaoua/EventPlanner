import React, { useState, useContext } from 'react';
import axios from 'axios'; 
import { X } from 'lucide-react';
import { TokenContext } from "./Tokencontext";
import './RequestEvent.css';

const RequestEvent = ({ onClose }) => {
  const { token } = useContext(TokenContext); 
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.endDateTime) <= new Date(formData.startDateTime)) {
      setError('End date/time must be after the start date/time.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/events', 
        {
          name: formData.name,
          description: formData.description,
          dateStart: formData.startDateTime,
          dateEnd: formData.endDateTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Include token
        }
      );
      alert('Request submitted successfully!');
      console.log('Event created:', response.data);
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event. Please try again.');
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <span className="closeBtn" onClick={onClose}>
          <X size={24} color="#E64833" />
        </span>
        <h3 className="modalTitle">Request an Event</h3>
        {error && <p className="errorMessage">{error}</p>}
        <form onSubmit={handleSubmit} className="modalForm">
          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="startDateTime"
            value={formData.startDateTime}
            onChange={handleChange}
            required
          />
          <input
            type="datetime-local"
            name="endDateTime"
            value={formData.endDateTime}
            onChange={handleChange}
            required
          />
          <button type="submit" className="submitBtn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default RequestEvent;
