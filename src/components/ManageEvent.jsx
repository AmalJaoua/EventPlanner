import React, { useState } from 'react';
import Sidebar from './Sidebar';
import LogisticsPage from './LogisticsPage';
import AttendeesPage from './AttendeesPage';
import OcsPage from './OcsPage';
import './ManageEvent.css';

const ManageEvent = () => {
  const [activePage, setActivePage] = useState('logistics');

  const event = {
    name: 'Annual Tech Conference',
    startDate: '2024-12-01',
    endDate: '2024-12-03',
  };

  const renderPage = () => {
    switch (activePage) {
      case 'logistics':
        return <LogisticsPage />;
      case 'attendees':
        return <AttendeesPage />;
      case 'ocs':
        return <OcsPage />;
      default:
        return <LogisticsPage />;
    }
  };

  return (
    
    <div className="manageEvent">
      <Sidebar event={event} />
      <div className="mainContent">
        <nav>
          <button onClick={() => setActivePage('logistics')}>Logistics</button>
          <button onClick={() => setActivePage('attendees')}>Attendees</button>
          <button onClick={() => setActivePage('ocs')}>OCs</button>
        </nav>
        {renderPage()}
      </div>
    </div>
  );
};

export default ManageEvent;
