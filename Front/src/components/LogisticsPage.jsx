import React, { useState, useEffect } from 'react';
import './LogisticsPage.css';

const LogisticsPage = ({ eventId }) => {
  const [activeTab, setActiveTab] = useState('locals');
  const [locals, setLocals] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState(null); // To handle errors

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents default form submission
    alert('Your request has been sent!'); // Displays an alert
  };

  useEffect(() => {
    // Fetch locals and materials when the eventId is available
    const fetchData = async () => {
      try {
        // Fetch locals
        const localsResponse = await fetch(`http://localhost:3000/events/${eventId}/locals`);
        if (!localsResponse.ok) {
          throw new Error('Failed to fetch locals');
        }
        const localsData = await localsResponse.json();
        setLocals(localsData.data);

        // Fetch materials
        const materialsResponse = await fetch(`http://localhost:3000/events/${eventId}/materials`);
        if (!materialsResponse.ok) {
          throw new Error('Failed to fetch materials');
        }
        const materialsData = await materialsResponse.json();
        setMaterials(materialsData.data);
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]); // Run this effect when the eventId changes

  return (
    <div className="logisticsPage">
      <h2>Manage Logistics</h2>
      <p>Here you can manage event logistics.</p>
      <div className="buttonGroup">
        <button
          className={`toggleButton ${activeTab === 'locals' ? 'active' : ''}`}
          onClick={() => handleTabClick('locals')}
        >
          Locals
        </button>
        <button
          className={`toggleButton ${activeTab === 'materials' ? 'active' : ''}`}
          onClick={() => handleTabClick('materials')}
        >
          Materials
        </button>
      </div>
      <div className="contentArea">
        {error && <p className="error">{error}</p>}

        {activeTab === 'locals' && (
          <>
            <form className="logisticsForm" onSubmit={handleSubmit}>
              <label htmlFor="localSelect">Select Local:</label>
              <select id="localSelect" name="local" required>
                <option value="">Select...</option>
                {locals.map((local, index) => (
                  <option key={index} value={local.name}>
                    {local.name}
                  </option>
                ))}
              </select>
              <label htmlFor="localMessage">Message:</label>
              <textarea
                id="localMessage"
                name="message"
                placeholder="Add your message here..."
                required
              ></textarea>
              <button type="submit">Submit</button>
            </form>
            <h3>List of Reserved Locals</h3>
            <table className="reservationTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity Used</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {locals.map((local, index) => (
                  <tr key={index}>
                    <td>{local.name}</td>
                    <td>{local.quantityUsed}</td>
                    <td className={local.status ? 'approved' : 'notApproved'}>
                      {local.status ? 'Approved' : 'Not Approved'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {activeTab === 'materials' && (
          <>
            <form className="logisticsForm" onSubmit={handleSubmit}>
              <label htmlFor="materialSelect">Select Material:</label>
              <select id="materialSelect" name="material" required>
                <option value="">Select...</option>
                {materials.map((material, index) => (
                  <option key={index} value={material.name}>
                    {material.name}
                  </option>
                ))}
              </select>
              <label htmlFor="materialMessage">Message:</label>
              <textarea
                id="materialMessage"
                name="message"
                placeholder="Add your message here..."
                required
              ></textarea>
              <button type="submit">Submit</button>
            </form>
            <h3>List of Reserved Materials</h3>
            <table className="reservationTable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Quantity Used</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material, index) => (
                  <tr key={index}>
                    <td>{material.name}</td>
                    <td>{material.quantity}</td>
                    <td>{material.quantityUsed}</td>
                    <td className={material.status ? 'approved' : 'notApproved'}>
                      {material.status ? 'Approved' : 'Not Approved'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default LogisticsPage;
