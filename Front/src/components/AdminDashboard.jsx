import React, { useState } from "react";
import  RequestedEventsAdmin from "./RequestedEventsAdmin";
import AllEventsAdmin from "./AllEventsAdmin";
import RequestedLocals from "./RequestedLocals"; 
import RequestedMaterials from "./RequestedMaterials"; 
import "./AdminDashboard.css";
import "./SidebarAdmin.css"
const SidebarAdmin = ({ setActivePage }) => {
  return (
    <div className="sidebarAdmin">
      <h2>Admin</h2>
      <div className="detailsAdmin">
        <button className="sidebarLink" onClick={() => setActivePage("ue")}>
          All Events
        </button>
        <button className="sidebarLink" onClick={() => setActivePage("re")}>
          Requested Events
        </button>
        <button className="sidebarLink" onClick={() => setActivePage("rl")}>
          Requested Locals
        </button>
        <button className="sidebarLink" onClick={() => setActivePage("rm")}>
          Requested Materials
        </button>
      </div>
    </div>
  );
};
const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("ue"); 
  const renderActivePage = () => {
    switch (activePage) {
      case "ue":
        return <AllEventsAdmin />;
       case "re":
        return <RequestedEventsAdmin />;
        case "rl":
          return <RequestedLocals />;
       case "rm":
       return <RequestedMaterials />;
      default:
        return <AllEventsAdmin />;
    }
  };

  return (
    <div className="adminPage">
      <SidebarAdmin setActivePage={setActivePage} />
      <div className="eventsPageAdmin">{renderActivePage()}</div>
    </div>
  );
};

export default AdminDashboard
