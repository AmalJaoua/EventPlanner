import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react'; 
import './AdminDashboard.css';

const RequestedLocals = () => {
  const [locals, setLocals] = useState([]);

  useEffect(() => {
    const fetchLocals = async () => {
      const localList = [
        { id: 1,name:"A217" ,eventname: "WiEmpower 1.0", date: "2024-12-21" },
        { id: 2,name:"A218" ,eventname: "AI Workshop",date: "2024-12-05" },
        { id: 3,name:"A219" , eventname: "Hackathon", date: "2024-12-10" },
      ];
      setLocals(localList);
    };

    fetchLocals();
  }, []);

  return (
    <>
      <h3>Requested Locals</h3>
      <div className="eventListHeader">
        <p className="headerItem">Name</p>
        <p className="headerItem">Event</p>
        <p className="headerItem dateHeader">Date</p>
        <p className="headerItem actionHeader">Action</p>
      </div>
      <ul className="eventList">
        {locals.map((local, index) => (
          <li key={index} className="eventItem">
            <p className="eventName">{local.name}</p>
            <p className="eventDate">{local.eventname}</p>
            <p className="eventDate">{local.date}</p>
            <div className="eventActions">
                <button className="approveBtn">
                  <Check size={20} color="green" />
                </button>
              <button className="rejectBtn" >
                <X size={20} color='red' />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default RequestedLocals;
