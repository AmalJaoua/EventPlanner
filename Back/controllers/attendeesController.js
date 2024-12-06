// controllers/attendeesController.js
const db = require('../models');

// Get all attendees
exports.getAttendees = async (req, res) => {
  try {
    const attendees = await db.Attendees.findAll();
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving attendees data' });
  }
};

// Clear all attendees
exports.clearAttendees = async (req, res) => {
  try {
    // Delete all attendees for the event (modify this logic based on event ID or criteria)
    await db.Attendees.destroy({
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
    for (let attendee of attendees) {
      // Add attendees one by one (or use bulkCreate for better performance)
      await db.Attendees.create({
        name: attendee.name,
        phone: attendee.phone,
        status: 0, // Assuming CSV contains a "status" field
      });
    }
    res.status(200).json({ message: 'Attendees added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding attendees' });
  }
};
