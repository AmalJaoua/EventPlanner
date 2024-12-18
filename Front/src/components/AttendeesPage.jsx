import React, { useState, useEffect } from "react";
import Papa from 'papaparse';
import axios from 'axios'; 
import { Plus, Trash2 } from "lucide-react";
import { useToken } from './Tokencontext'; 
import { useParams } from 'react-router-dom';
import "./AttendeesPage.css";

const AttendeesPage = () => {
  const [attendees, setAttendees] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useToken(); 
  const { eventId } = useParams(); 

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/attendees/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setAttendees(response.data);
      } catch (error) {
        console.error('Error fetching attendees:', error);
      } finally {
        setLoading(false); 
      }
    };

    fetchAttendees();
  }, [eventId, token]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          try {
            const parsedData = result.data;
            const isValid = parsedData.every((row) => {
              return row.name && row.phone && row.email; 
            });

            if (!isValid) {
              alert("The CSV file contains empty cells or missing required fields. Please check and re-upload.");
              return;
            }

            const response = await fetch(`http://localhost:3000/attendees/${eventId}`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json" ,
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({ attendees: parsedData }),
            });

            if (response.ok) {
              alert("Attendees added successfully!");
              const updatedResponse = await axios.get(`http://localhost:3000/attendees/${eventId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              setAttendees(updatedResponse.data); // Update the state
            } else {
              const errorData = await response.json();
              alert(`Error: ${errorData.message}`);
            }
          } catch (error) {
            console.error("Error uploading attendees:", error);
          }
        },
      });
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleClearAttendees = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/attendees/${eventId}/clear`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert("All attendees have been cleared!");
        const updatedResponse = await axios.get(`http://localhost:3000/attendees/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setAttendees(updatedResponse.data); 
      } else {
        alert(`Error clearing attendees: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error clearing attendees:", error);
      alert("An error occurred while clearing attendees.");
    }
  };

  const toggleStatus = async (attendeeId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/attendees/update-status`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ id: attendeeId, status: !currentStatus }),
      });
      if (response.ok) {
        const updatedAttendee = await response.json();
        setAttendees((prevAttendees) =>
          prevAttendees.map((attendee) =>
            attendee.id === updatedAttendee.id ? updatedAttendee : attendee
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="attendeesPage">
      <h2>Manage Attendees</h2>
      <p>Here you can manage event attendees.</p>
      <div className="addFileSection">
        <div className="addFileSectionAdd">
          <button
            className="plusButton"
            onClick={() => document.getElementById("fileInput").click()}
          >
            <Plus size={24} color="#244855" />
          </button>
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <p className="addFileText">Add file of attendees</p>
        </div>
        <div className="">
          <button
            className="deleteBtn"
            onClick={handleClearAttendees}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <h3>Attendee List</h3>

      <div className="attendeeListHeader">
        <p className="headerItem">Name</p>
        <p className="headerItem">Phone</p>
        <p className="headerItem statusHeader">Status</p>
      </div>

      {attendees.length === 0 ? (
        <h3>No attendees added yet</h3>
      ) : (
        <ul className="attendeeList">
          {attendees.map((attendee) => (
            <li key={attendee.phoneNumber} className="attendeeItem">
              <p className="attendeeName">{attendee.name}</p>
              <p className="attendeePhone">{attendee.phoneNumber}</p>
              <p
                className={`attendeeStatus ${
                  attendee.status === true ? "statusCheckedIn" : "statusNotCheckedIn"
                }`}
              >
                {attendee.status === true ? "Checked In" : "Not Checked In"}
              </p>
              <input
                type="checkbox"
                checked={attendee.status === true}
                onChange={() => toggleStatus(attendee.id, attendee.status)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttendeesPage;
