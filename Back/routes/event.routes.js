const express = require('express');
const router = express.Router();
const { createMaterialXEvent, createLocalXEvent,getMaterialsByEvent,getLocalsByEvent,deleteEvent,getEventById,getAllEventsByUser,createEvent } = require('../controllers/eventController');
const eventController = require('../controllers/eventController');
const { authenticate } = require('../middleware/authMiddleware');

// Route to create a new event (protected)
router.post('/', authenticate, createEvent);

// Route to get all events (protected)
router.get('/',authenticate, getAllEventsByUser);

// Route to get details of a specific event by ID (public)
router.get('/:eventId',authenticate, getEventById);

// Route to delete a specific event by ID (protected)
router.delete('/:eventId', authenticate, deleteEvent);

// Route to get locals of a specific event by ID (public)
router.get('/:eventId/locals', getLocalsByEvent);

// Route to get materials of a specific event by ID (public)
router.get('/:eventId/materials', getMaterialsByEvent);
// Route for creating MaterialXEvent
router.post('/:eventid/material/:materialid', createMaterialXEvent);

// Route for creating LocalXEvent
router.post('/:eventid/local/:localid', createLocalXEvent);
module.exports = router;
