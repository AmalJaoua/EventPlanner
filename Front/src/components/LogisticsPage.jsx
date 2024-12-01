import React, { useState } from 'react';
import './LogisticsPage.css';

const LocalsForm = () => (
  <form className="logisticsForm">
    <label htmlFor="localsSelect">Select a Local:</label>
    <select id="localsSelect" name="local">
      <option value="A215">A215</option>
      <option value="A214">A214</option>
      <option value="B215">B215</option>
    </select>
    <label htmlFor="localMessage">Message:</label>
    <textarea id="localMessage" name="message" placeholder="Enter your message..." rows="4"></textarea>
    <button type="submit">Submit</button>
  </form>
);

const MaterialsForm = () => (
  <form className="logisticsForm">
    <label htmlFor="materialsSelect">Select a Material:</label>
    <select id="materialsSelect" name="material">
      <option value="Projector">Projector</option>
      <option value="Light">Light</option>
      <option value="Tele">Tele</option>
    </select>
    <label htmlFor="materialMessage">Message:</label>
    <textarea id="materialMessage" name="message" placeholder="Enter your message..." rows="4"></textarea>
    <button type="submit">Submit</button>
  </form>
);

const LogisticsPage = () => {
  const [activeComponent, setActiveComponent] = useState('Locals');

  return (
    <div className="logisticsPage">
      <h2>Manage Logistics</h2>
      <p>Here you can manage event logistics.</p>
      <div className="buttonGroup">
        <button
          className={`toggleButton ${activeComponent === 'Locals' ? 'active' : ''}`}
          onClick={() => setActiveComponent('Locals')}
        >
          Locals
        </button>
        <button
          className={`toggleButton ${activeComponent === 'Materials' ? 'active' : ''}`}
          onClick={() => setActiveComponent('Materials')}
        >
          Materials
        </button>
      </div>
      <div className="contentArea">
        {activeComponent === 'Locals' && <LocalsForm />}
        {activeComponent === 'Materials' && <MaterialsForm />}
      </div>
    </div>
  );
};

export default LogisticsPage;
