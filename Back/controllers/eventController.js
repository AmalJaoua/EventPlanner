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


// Get Locals of an Event
exports.getLocalsOfEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: Local,
          as: 'locals',
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event.locals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Materials of an Event
exports.getMaterialsOfEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId, {
      include: [
        {
          model: Material,
          as: 'materials',
        },
      ],
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event.materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
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
