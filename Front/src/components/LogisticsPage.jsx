import React, { useState, useEffect } from 'react';
import './LogisticsPage.css';

const LogisticsPage = ({ eventId, startDate, endDate }) => {
  const [activeTab, setActiveTab] = useState('locals');
  const [availableLocals, setAvailableLocals] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const [reservedLocals, setReservedLocals] = useState([]);
  const [reservedMaterials, setReservedMaterials] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/resources/available?startDate=${startDate}&endDate=${endDate}`
        );
        const data = await response.json();
        setAvailableLocals(data.availableLocals || []);
        setAvailableMaterials(data.materialsWithSufficientQuantity || []);
      } catch (error) {
        console.error("Error fetching availability:", error);
        setError('Failed to fetch available resources.');
      }
    };

    fetchAvailability();
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const localsResponse = await fetch(`http://localhost:3000/events/${eventId}/locals`);
        if (!localsResponse.ok) {
          throw new Error('Failed to fetch locals');
        }
        const localsData = await localsResponse.json();
        setReservedLocals(localsData.data || []);

        const materialsResponse = await fetch(`http://localhost:3000/events/${eventId}/materials`);
        if (!materialsResponse.ok) {
          throw new Error('Failed to fetch materials');
        }
        const materialsData = await materialsResponse.json();
        setReservedMaterials(materialsData.data || []);
      } catch (error) {
        console.error("Error fetching event data:", error);
        setError('Failed to fetch event resources.');
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isLocalTab = activeTab === 'locals';
    const selectId = isLocalTab ? 'localSelect' : 'materialSelect';
    const quantityId = 'materialQuantity';

    const selectedId = document.getElementById(selectId).value;
    const message = e.target.message.value;
    const quantity = isLocalTab ? null : parseInt(document.getElementById(quantityId).value, 10);

    if (!selectedId) {
      alert('Please select an item.');
      return;
    }

    try {
      const endpoint = isLocalTab
        ? `http://localhost:3000/events/${eventId}/local/${selectedId}`
        : `http://localhost:3000/events/${eventId}/material/${selectedId}`;

      const body = isLocalTab
        ? { message }
        : { message, quantityUsed: quantity };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${isLocalTab ? 'Local' : 'Material'} added successfully!`);

        if (isLocalTab) {
          setReservedLocals([...reservedLocals, data.localXEvent]);
        } else {
          setReservedMaterials([...reservedMaterials, data.materialXEvent]);
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting the request:', error);
      alert('An error occurred while submitting your request.');
    }
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
                {availableLocals.map((local, index) => (
                  <option key={index} value={local.id}>
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
                {availableMaterials.map((material, index) => (
                  <option key={index} value={material.id}>
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
              <label htmlFor="materialQuantity">Quantity:</label>
              <input
                type="number"
                id="materialQuantity"
                name="quantity"
                placeholder="Enter quantity"
                min="1"
                required
              />
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
