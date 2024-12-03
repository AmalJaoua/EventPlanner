import React, { useState } from 'react';
import './LogisticsPage.css';

const LogisticsPage = () => {
  const [activeTab, setActiveTab] = useState('locals'); // Default tab is 'locals'

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents default form submission
    alert('Your request has been sent!'); // Displays an alert
  };

  // Mock data for the list
  const localReservations = [
    { name: 'A215', date: '2024-12-01', status: 'Approved' },
    { name: 'A214', date: '2024-12-02', status: 'Pending' },
  ];

  const materialReservations = [
    { name: 'Projector', date: '2024-12-01', status: 'Approved' },
    { name: 'Light', date: '2024-12-03', status: 'Pending' },
  ];

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
        {activeTab === 'locals' && (
          <>
            <form className="logisticsForm" onSubmit={handleSubmit}>
              <label htmlFor="localSelect">Select Local:</label>
              <select id="localSelect" name="local" required>
                <option value="">Select...</option>
                <option value="A215">A215</option>
                <option value="A214">A214</option>
                <option value="B215">B215</option>
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
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {localReservations.map((local, index) => (
                  <tr key={index}>
                    <td>{local.name}</td>
                    <td>{local.date}</td>
                    <td>{local.status}</td>
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
                <option value="projector">Projector</option>
                <option value="light">Light</option>
                <option value="tele">Tele</option>
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
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {materialReservations.map((material, index) => (
                  <tr key={index}>
                    <td>{material.name}</td>
                    <td>{material.date}</td>
                    <td>{material.status}</td>
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
