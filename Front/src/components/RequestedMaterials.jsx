import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react'; 
import './AdminDashboard.css';

const RequestedMaterials = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      const materialList = [
        { id: 1,name:"Projecteur" ,eventname: "WiEmpower 1.0",aq:"7", date: "2024-12-21" },
        { id: 2,name:"Tableau" ,eventname: "AI Workshop", aq:"7",date: "2024-12-05" },
        { id: 3,name:"Chaises" , eventname: "Hackathon",aq:"7", date: "2024-12-10" },
      ];
      setMaterials(materialList);
    };

    fetchMaterials();
  }, []);

  return (
    <>
      <h3>Requested Materiels</h3>
      <div className="eventListHeader">
        <p className="headerItem">Name</p>
        <p className="headerItem">Event</p>
        <p className="headerItem">Availabe Quantity</p>
        <p className="headerItem dateHeader">Date</p>
        <p className="headerItem actionHeader">Action</p>
      </div>
      <ul className="eventList">
        {materials.map((material, index) => (
          <li key={index} className="eventItem">
            <p className="eventName">{material.name}</p>
            <p className="eventDate">{material.eventname}</p>
            <p className="eventDate">{material.aq}</p>
            <p className="eventDate">{material.date}</p>
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

export default RequestedMaterials;
