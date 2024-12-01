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
        )}
        {activeTab === 'materials' && (
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
        )}
      </div>
    </div>
  );
};

export default LogisticsPage;
