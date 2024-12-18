// routes/attendeesRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware'); // Import auth middleware
const attendeesController = require('../controllers/attendeesController');

// Route to get all attendees
router.get('/:eventId',authenticate, attendeesController.getAttendees);

// Route to clear attendees
router.delete('/:eventId/clear',authenticate, attendeesController.clearAttendees);

// Route to add new attendees
router.post('/:eventId',authenticate, attendeesController.addAttendees);
router.put('/update-status', attendeesController.updateStatus);

module.exports = router;
