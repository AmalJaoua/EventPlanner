const jwt = require('jsonwebtoken');
const { Event } = require('../models');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Helper function to verify token and extract user info
const verifyToken = (authHeader) => {
  if (!authHeader) {
    throw new Error('No token provided');
  }
  const token = authHeader.split(' ')[1];
  return jwt.verify(token, SECRET);
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const user = verifyToken(req.header('Authorization'));
    
    const { name, description, dateStart, dateEnd } = req.body;
    const event = await Event.create({
      name,
      description,
      dateStart,
      dateEnd,
      userId: user.id, // Attach user ID from token
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized or invalid token', details: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events', details: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching event', details: error.message });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const user = verifyToken(req.header('Authorization'));
    
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.userId !== user.id) {
      return res.status(403).json({ error: 'You are not authorized to update this event' });
    }

    const { name, description, dateStart, dateEnd } = req.body;
    await event.update({ name, description, dateStart, dateEnd });
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized or invalid token', details: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const user = verifyToken(req.header('Authorization'));

    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.userId !== user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this event' });
    }

    await event.destroy();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized or invalid token', details: error.message });
  }
};
