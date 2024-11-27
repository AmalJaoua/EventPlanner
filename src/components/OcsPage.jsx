import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import './OcsPage.css';

const OcsPage = () => {
  const [ocs, setOcs] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const newOc = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    setOcs([...ocs, newOc]);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setIsFormVisible(false);
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
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Add OC</button>
        </form>
      )}

      <h3>OC List</h3>
      <div className="ocListHeader">
        <p className="ocHeaderItem">Name</p>
        <p className="ocHeaderItem">Email</p>
        <p className="ocHeaderItem passwordHeader">Password</p>
      </div>
      <ul className="ocList">
        {ocs.map((oc, index) => (
          <li key={index} className="ocItem">
            <p className="ocName">{oc.name}</p>
            <p className="ocEmail">{oc.email}</p>
            <p className="ocPassword">{oc.password}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OcsPage;
