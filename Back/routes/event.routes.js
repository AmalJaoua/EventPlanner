const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/authMiddleware'); // Import auth middleware

// Define your routes and use the middleware for protected routes
router.post('/', authenticate, eventController.createEvent); // Protect create event route
router.get('/', eventController.getAllEvents); // Public route
router.get('/:eventId', eventController.getEventById); // Public route
//router.put('/:eventId', authenticate, eventController.updateEvent); // Protect update event route
router.delete('/:eventId', authenticate, eventController.deleteEvent); // Protect delete event route
// Route to get locals of an event
router.get('/:eventId/locals', eventController.getLocalsOfEvent);

// Route to get materials of an event
router.get('/:eventId/materials', eventController.getMaterialsOfEvent);
module.exports = router;
