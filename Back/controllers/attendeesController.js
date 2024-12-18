// controllers/attendeesController.js
const db = require('../models');

// Get attendees for a specific event
exports.getAttendees = async (req, res) => {
  const { eventId } = req.params; 

  try {
    const attendees = await db.Attendee.findAll({
      where: { eventId }, 
    });

    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving attendees data' });
  }
};

// Clear all attendees for a specific event
exports.clearAttendees = async (req, res) => {
  const { eventId } = req.params; // Extract eventId from the request parameters

  try {
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    // Check if the event exists
    const event = await db.Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Delete all attendees for the specified event
    await db.Attendee.destroy({
      where: { eventId }, // Delete attendees linked to the given eventId
    });

    res.status(200).json({ message: 'All attendees for the event have been cleared' });
  } catch (error) {
    console.error('Error clearing attendees:', error);
    res.status(500).json({ message: 'Error clearing attendees' });
  }
};


// Add new attendees
exports.addAttendees = async (req, res) => {
  try {
    const { attendees } = req.body; // The data from CSV
    const { eventId } = req.params; // Extract the event ID from route parameters

    if (!attendees || !Array.isArray(attendees)) {
      return res.status(400).json({ message: 'Attendees data is missing or invalid' });
    }

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is missing' });
    }

    const attendeesToAdd = attendees.map((attendee) => {
      if (!attendee.name || !attendee.phone || !attendee.email) {
        throw new Error('Attendee data is incomplete');
      }

      return {
        name: attendee.name,
        phoneNumber: attendee.phone,
        email: attendee.email,
        status: 0, 
        eventId, 
      };
    });

    // Bulk insert attendees for better performance
    await db.Attendee.bulkCreate(attendeesToAdd);

    res.status(200).json({ message: 'Attendees added successfully' });
  } catch (error) {
    console.error('Error adding attendees:', error);
    res.status(500).json({ message: 'An error occurred while adding attendees', error: error.message });
  }
};

// Update attendee status
exports.updateStatus = async (req, res) => {
  const { id, status } = req.body;
console.log(id, status)
  try {
    const attendee = await db.Attendee.findByPk(id);
    if (!attendee) {
      return res.status(404).json({ message: "Attendee not found" });
    }

    attendee.status = status;
    await attendee.save();
    res.json(attendee);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: "Error updating attendee status" });
  }
};
