// routes/attendeesRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware'); // Import auth middleware
const attendeesController = require('../controllers/attendeesController');

// Route to get all attendees
router.get('/',authenticate, attendeesController.getAttendees);

// Route to clear attendees
router.delete('/clear',authenticate, attendeesController.clearAttendees);

// Route to add new attendees
router.post('/',authenticate, attendeesController.addAttendees);

module.exports = router;
