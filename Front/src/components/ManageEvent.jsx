import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import SidebarEvent from "./SidebarEvent";
import LogisticsPage from "./LogisticsPage";
import AttendeesPage from "./AttendeesPage";
import OcsPage from "./OcsPage";
import { TokenContext } from "./Tokencontext";
import "./ManageEvent.css";

const ManageEvent = () => {
  const { eventId } = useParams(); // Use useParams to get eventId from URL
  const [activePage, setActivePage] = useState("logistics");
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const { token } = useContext(TokenContext);

  useEffect(() => {
    console.log("eventId from URL:", eventId); // Log the eventId to verify it's passed correctly
    if (!eventId || !token) return;

    const fetchEvent = async () => {
      try {
        console.log("Fetching event with ID:", eventId); // Log the eventId before the fetch
        const response = await fetch(`http://localhost:3000/events/${eventId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json();
          console.error("Error fetching event:", data.error || "Failed to fetch event"); // Log the error if the fetch fails
          throw new Error(data.error || "Failed to fetch event");
        }

        const eventData = await response.json();
        console.log("Fetched event data:", eventData); // Log the event data fetched from the backend
        setEvent(eventData);
      } catch (err) {
        console.error("Fetch event error:", err); // Log the error if there's a catch block issue
        setError(err.message);
      }
    };

    fetchEvent();
  }, [eventId, token]); // Trigger fetch when eventId or token changes

  const renderPage = () => {
    switch (activePage) {
      case "logistics":
        return <LogisticsPage eventId={eventId}/>;
      case "attendees":
        return <AttendeesPage />;
      case "ocs":
        return <OcsPage />;
      default:
        return <LogisticsPage />;
    }
  };

  if (error) {
    console.log("Error state:", error); // Log error state if any error occurs
    return <div className="error">Error: {error}</div>;
  }

  if (!event) {
    console.log("Event is loading..."); // Log loading state if event is not yet fetched
    return <div className="loading">Loading event details...</div>;
  }

  return (
    <div className="manageEvent">
      <SidebarEvent event={event} />
      <div className="mainContent">
        <nav>
          <button onClick={() => setActivePage("logistics")}>Logistics</button>
          <button onClick={() => setActivePage("attendees")}>Attendees</button>
          <button onClick={() => setActivePage("ocs")}>OCs</button>
        </nav>

        

        {renderPage()}
      </div>
    </div>
  );
};

export default ManageEvent;
