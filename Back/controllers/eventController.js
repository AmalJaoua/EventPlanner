const { Event, Local, Material } = require('../models');
// Create a new event
exports.createEvent = async (req, res) => {
  try {
    // Since the authenticate middleware has already verified the token, 
    // the user info (like user.id) is available in req.user
    const user = req.user;

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
    res.status(500).json({ error: 'Error creating event', details: error.message });
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

// // Update an event
// exports.updateEvent = async (req, res) => {
//   try {
//     // The user is already authenticated, and their info is in req.user
//     const user = req.user;

//     const event = await Event.findByPk(req.params.eventId);
//     if (!event) {
//       return res.status(404).json({ error: 'Event not found' });
//     }

//     if (event.userId !== user.id) {
//       return res.status(403).json({ error: 'You are not authorized to update this event' });
//     }

//     const { name, description, dateStart, dateEnd } = req.body;
//     await event.update({ name, description, dateStart, dateEnd });
//     res.status(200).json({ message: 'Event updated successfully', event });
//   } catch (error) {
//     res.status(500).json({ error: 'Error updating event', details: error.message });
//   }
// };


// Get Materials for a specific event
exports.getMaterialsByEvent = async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required." });
  }

  try {
    // Fetch materials associated with the event
    const materials = await db.Material.findAll({
      include: {
        model: db.Event,
        where: { id: eventId }, // Filter by the specific event ID
        through: { attributes: [] }, // Exclude the join table attributes
      },
    });

    res.status(200).json({ message: "Materials retrieved successfully.", data: materials });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving materials.", error: error.message });
  }
};

// Get Locals for a specific event
exports.getLocalsByEvent = async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required." });
  }

  try {
    // Fetch locals associated with the event
    const locals = await db.Local.findAll({
      include: {
        model: db.Event,
        where: { id: eventId }, // Filter by the specific event ID
        through: { attributes: [] }, // Exclude the join table attributes
      },
    });

    res.status(200).json({ message: "Locals retrieved successfully.", data: locals });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving locals.", error: error.message });
  }
};
// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    // The user is already authenticated, and their info is in req.user
    const user = req.user;

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
    res.status(500).json({ error: 'Error deleting event', details: error.message });
  }
};
