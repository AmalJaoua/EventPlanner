import React, { useState, useEffect } from 'react';
import './LogisticsPage.css';

const LogisticsPage = ({ eventId, startDate, endDate }) => {
  const [activeTab, setActiveTab] = useState('locals');
  const [availableLocals, setAvailableLocals] = useState([]); // Locals from /resources/available
  const [availableMaterials, setAvailableMaterials] = useState([]); // Materials from /resources/available
  const [reservedLocals, setReservedLocals] = useState([]); // Locals from /events/${eventId}/locals
  const [reservedMaterials, setReservedMaterials] = useState([]); // Materials from /events/${eventId}/materials
  const [error, setError] = useState(null); // To handle errors

  // Fetch availability of locals and materials based on start and end date
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`http://localhost:3000/resources/available?startDate=${startDate}&endDate=${endDate}`);
        const data = await response.json();
        console.log('Available Locals:', data.availableLocals); // Debugging line
        console.log('Available Materials:', data.materialsWithSufficientQuantity); // Debugging line
        setAvailableLocals(data.availableLocals); // Set available locals
        setAvailableMaterials(data.materialsWithSufficientQuantity); // Set available materials
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [startDate, endDate]);

  // Fetch locals and materials for the event
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch locals for the event
        const localsResponse = await fetch(`http://localhost:3000/events/${eventId}/locals`);
        if (!localsResponse.ok) {
          throw new Error('Failed to fetch locals');
        }
        const localsData = await localsResponse.json();
        setReservedLocals(localsData.data); // Set reserved locals for the event

        // Fetch materials for the event
        const materialsResponse = await fetch(`http://localhost:3000/events/${eventId}/materials`);
        if (!materialsResponse.ok) {
          throw new Error('Failed to fetch materials');
        }
        const materialsData = await materialsResponse.json();
        setReservedMaterials(materialsData.data); // Set reserved materials for the event
      } catch (error) {
        setError('Error fetching data: ' + error.message);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]); // Run this effect when eventId changes

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents default form submission
    alert('Your request has been sent!'); // Displays an alert
  };

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
                {availableLocals.length > 0 ? (
                  availableLocals.map((local, index) => (
                    <option key={index} value={local.name}>
                      {local.name}
                    </option>
                  ))
                ) : (
                  <option value="">No locals available</option> // Fallback if no locals are available
                )}
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservedLocals.map((local, index) => (
                  <tr key={index}>
                    <td>{local.name}</td>
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
                {availableMaterials.length > 0 ? (
                  availableMaterials.map((material, index) => (
                    <option key={index} value={material.name}>
                      {material.name}
                    </option>
                  ))
                ) : (
                  <option value="">No materials available</option> // Fallback if no materials are available
                )}
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
                  <th>Quantity Used</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservedMaterials.map((material, index) => (
                  <tr key={index}>
                    <td>{material.name}</td>
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
