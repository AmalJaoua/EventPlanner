// controllers/attendeesController.js
const db = require('../models');

// Get all attendees
exports.getAttendees = async (req, res) => {
  try {
    const attendees = await db.Attendee.findAll();
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving attendees data' });
  }
};

// Clear all attendees
exports.clearAttendees = async (req, res) => {
  try {
    // Delete all attendees for the event (modify this logic based on event ID or criteria)
    await db.Attendee.destroy({
      where: {}, // Delete all attendees
    });
    res.status(200).json({ message: 'All attendees cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing attendees' });
  }
};

// Add new attendees
exports.addAttendees = async (req, res) => {
  try {
    const attendees = req.body.attendees; // The data from CSV
    if (!attendees || !Array.isArray(attendees)) {
      return res.status(400).json({ message: 'Attendees data is missing or invalid' });
    }

    for (let attendee of attendees) {
      // Validate attendee data
      if (!attendee.name || !attendee.phone || !attendee.email) {
        return res.status(400).json({ message: 'Attendee data is incomplete' });
      }

      // Add attendees one by one (or use bulkCreate for better performance)
      await db.Attendee.create({
        name: attendee.name,
        phoneNumber: attendee.phone,
        email: attendee.email,
        status: 0, // Assuming CSV contains a "status" field
      });
    }
    res.status(200).json({ message: 'Attendees added successfully' });
  } catch (error) {
    console.error('Error adding attendees:', error);
    res.status(500).json({ message: 'An error occurred while adding attendees', error: error.message });
  }
};
