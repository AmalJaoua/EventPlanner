import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import './AttendeesPage.css';

const AttendeesPage = () => {
  const [attendees, setAttendees] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchAttendees = async () => {
      const attendeeList = [
        { name: "John Doe", phone: "123-456-7890", status: 1 },
        { name: "Jane Smith", phone: "987-654-3210", status: 0 },
        { name: "Alice Brown", phone: "456-123-7890", status: 1 },
      ];
      setAttendees(attendeeList);
    };

    fetchAttendees();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      alert(`File "${file.name}" selected.`);
    } else {
      alert('Please upload a valid CSV file.');
      e.target.value = ''; // Reset file input
    }
  };

  return (
    <div className="attendeesPage">
      <h2>Manage Attendees</h2>
      <p>Here you can manage event attendees.</p>
      <div className="addFileSection">
        <button
          className="plusButton"
          onClick={() => document.getElementById('fileInput').click()}
        >
          <Plus size={24} color="#244855" />
        </button>
        <input
          id="fileInput"
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <p className="addFileText">Add file of attendees</p>
      </div>

      <h3>Attendee List</h3>

      {/* Header row for Attendees List */}
      <div className="attendeeListHeader">
        <p className="headerItem">Name</p>
        <p className="headerItem">Phone</p>
        <p className="headerItem statusHeader">Status</p>
      </div>

      {/* Attendees List */}
      <ul className="attendeeList">
        {attendees.map((attendee, index) => (
          <li key={index} className="attendeeItem">
            <p className="attendeeName">{attendee.name}</p>
            <p className="attendeePhone">{attendee.phone}</p>
            <p
              className={`attendeeStatus ${
                attendee.status === 1 ? "statusCheckedIn" : "statusNotCheckedIn"
              }`}
            >
              {attendee.status === 1 ? "Checked In" : "Not Checked In"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AttendeesPage;
