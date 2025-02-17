import React, { useState, useEffect } from "react";
import RequestedEventsAdmin from "./RequestedEventsAdmin";
import AllEventsAdmin from "./AllEventsAdmin";
import RequestedLocals from "./RequestedLocals"; 
import RequestedMaterials from "./RequestedMaterials"; 
import { Link } from 'react-router-dom';
import "./AdminDashboard.css";
import "./SidebarAdmin.css";

const SidebarAdmin = ({ setActivePage }) => {
  return (
    <div className="sidebarAdmin">
      <Link className="logoSideBa" to="/yourevents">
        <img className="logoSideBar" src="/logoText.png" alt="" />
        </Link>
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        const response = await fetch('http://localhost:3000/auth/validate-token', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();
        setIsAdmin(data.type === 0);
      } catch (error) {
        console.error("Authentication error", error);
      }
    };

    checkAdmin();
  }, []);

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

  return isAdmin ? (
    <div className="adminPage">
      <SidebarAdmin setActivePage={setActivePage} />
      <div className="eventsPageAdmin">{renderActivePage()}</div>
    </div>
  ) : (
    <div>Access denied</div>
  );
};

export default AdminDashboard;
