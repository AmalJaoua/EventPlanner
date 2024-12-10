const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/authMiddleware');

// Route to create a new event (protected)
router.post('/', authenticate, eventController.createEvent);

// Route to get all events (public)
router.get('/', eventController.getAllEvents);

// Route to get details of a specific event by ID (public)
router.get('/:eventId',authenticate, eventController.getEventById);

// Route to delete a specific event by ID (protected)
router.delete('/:eventId', authenticate, eventController.deleteEvent);

// Route to get locals of a specific event by ID (public)
router.get('/:eventId/locals', eventController.getLocalsByEvent);

// Route to get materials of a specific event by ID (public)
router.get('/:eventId/materials', eventController.getMaterialsByEvent);

module.exports = router;
