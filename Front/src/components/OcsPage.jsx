import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import './OcsPage.css';
import { useParams } from 'react-router-dom';
import { useToken } from './Tokencontext';

const OcsPage = () => {
  const [ocs, setOcs] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { token } = useToken();
  const { eventId } = useParams();

  useEffect(() => {
    const fetchOCs = async () => {
      try {
        const response = await fetch(`http://localhost:3000/ocs/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (response.ok) {
          setOcs(result.data);
        } else {
          alert(result.message || 'Error retrieving OCs.');
        }
      } catch (error) {
        alert('Network error, please try again.');
      }
    };

    fetchOCs();
  }, [eventId, token]);

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/ocs/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('OC successfully associated with the event.');
        setOcs([...ocs, { email: formData.email }]);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setIsFormVisible(false);
      } else if (result.message === 'User not found. Please create an account first.') {
        alert('The specified user does not exist. Please ask them to sign up first.');
      } else {
        alert(result.message || 'Error occurred during association.');
      }
    } catch (error) {
      alert('Network error, please try again.');
    }
  };

  return (
    <div className="ocsPage">
      <h2>Manage OCs</h2>
      <p>Here you can manage event OCs.</p>
      <div className="addFileSection">
        <button className="plusButton" onClick={toggleForm}>
          <Plus size={24} color="#244855" />
        </button>
        <p className="addFileText">Add OC Account</p>
      </div>

      {isFormVisible && (
        <form className="ocForm" onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add OC</button>
        </form>
      )}

      <h3>OC List</h3>
      <div className="ocListHeader">
        <p className="ocHeaderItem">Email</p>
      </div>
      <ul className="ocList">
        {ocs.map((oc, index) => (
          <li key={index} className="ocItem">
            <p className="ocEmail">{oc.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OcsPage;
