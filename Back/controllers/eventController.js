const jwt = require('jsonwebtoken');
const { Event, Local, Material,User,UsersXEvents,LocalXEvent,MaterialXEvent } = require('../models');
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
    });
    const userxevent = await UsersXEvents.create({
      userId: user.id,
      eventId: event.id
    });
  
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ error: 'Error creating event', details: error.message });
  }
};

// Get all events
// Get all events by user
exports.getAllEventsByUser = async (req, res) => {
  try {
    const userId = req.user.id; // User ID from middleware

    // Fetch the user to validate their access
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(403).json({ error: 'Forbidden: User not found' });
    }

    // If the user type is 0 (admin or special user), return all events
    if (user.type === 0) {
      const events = await Event.findAll({
        attributes: ['id', 'name', 'description', 'dateStart','status', 'dateEnd', 'createdAt', 'updatedAt'], // Select only Event fields
      });

      if (events.length === 0) {
        return res.status(200).json([]);
      }      

      return res.status(200).json(events);
    }

    // If the user type is not 0, fetch events related to this user
    const events = await Event.findAll({
      include: [
        {
          model: User,
          where: { userId },
          attributes: ['type'],
        },
      ],
      attributes: ['id', 'name', 'description', 'dateStart', 'dateEnd', 'status', 'createdAt', 'updatedAt'],
    });
    

    if (events.length === 0) {
      return res.status(200).json([]);
    }    

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
    res.status(500).json({ error: 'Error fetching user events', details: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const userId = req.user.id; // User ID is already set by the authenticate middleware

    // Fetch the user to check if they have the correct type (admin or authorized user)
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(403).json({ error: 'Forbidden: User not found' });
    }

    // If the user type is 0 (admin or special user), return the event without checking ownership
    if (user.type === 0) {
      const event = await Event.findByPk(req.params.eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }

      return res.status(200).json(event);
    }

    // If the user type is not 0, fetch the event and check ownership
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if the user is associated with the event in usersXevents
    const userEvent = await UsersXEvents.findOne({
      where: { userId, eventId: req.params.eventId },
    });

    if (!userEvent) {
      return res.status(403).json({ error: 'Forbidden: Event does not belong to the user' });
    }

    // Return the event if all checks pass
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
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
    const materials = await Material.findAll({
      include: {
        model: Event,
        where: { id: eventId }, // Filter by the specific event ID
        through: { attributes: ['status', 'quantityUsed'] }, // Include the 'status' field from the join table
      },
    });

    // Process the data to match the required format
    const processedMaterials = materials.map(material => {
      const materialData = material.toJSON();
      const eventData = material.Events[0] ? material.Events[0].MaterialXEvent : {}; // Assuming there's always at least one event
      return {
        id: materialData.id,
        name: materialData.name,
        quantity: materialData.quantity,
        status: eventData.status || false,
        quantityUsed: eventData.quantityUsed || 0,
      };
    });

    res.status(200).json({
      message: "Materials retrieved successfully.",
      data: processedMaterials,
    });
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
    const locals = await Local.findAll({
      include: {
        model: Event,
        where: { id: eventId }, // Filter by the specific event ID
        through: { attributes: ['status'] }, // Include the 'status' field from the join table
      },
    });

    // Process the data to match the required format
    const processedLocals = locals.map(local => {
      const localData = local.toJSON();
      const eventData = local.Events[0] ? local.Events[0].LocalXEvent : {}; // Assuming there's always at least one event
      return {
        id: localData.id,
        name: localData.name,
        status: eventData.status || false, // Default to false if no status
      };
    });

    res.status(200).json({
      message: "Locals retrieved successfully.",
      data: processedLocals,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving locals.", error: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const user = req.user;

    // Check if the user is type 0, which allows deleting any event
    if (user.type === 0) {
      const event = await Event.findByPk(req.params.eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      await event.destroy();
      return res.status(200).json({ message: 'Event deleted successfully' });
    }

    // Check if the user is authorized to delete the event
    const userEvent = await UsersXEvents.findOne({
      where: {
        userId: user.id,
        eventId: req.params.eventId,
      },
    });

    if (!userEvent) {
      return res.status(404).json({ error: 'Event not found or you are not authorized to delete it' });
    }

    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    await event.destroy();

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event', details: error.message });
  }
};
exports.createMaterialXEvent = async (req, res) => {
  try {
    const { eventid, materialid } = req.params;
    const { quantityUsed,message  } = req.body;

    // Validate if event and material exist
    const event = await Event.findByPk(eventid);
    const material = await Material.findByPk(materialid);

    if (!event || !material) {
      return res.status(404).json({ message: 'Event or Material not found' });
    }

    // Create the MaterialXEvent
    const materialXEvent = await MaterialXEvent.create({
      eventId: eventid,
      materialId: materialid,
      quantityUsed,
      message,
    });

    res.status(201).json({ message: 'MaterialXEvent created successfully', materialXEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createLocalXEvent = async (req, res) => {
  try {
    const { eventid, localid } = req.params;
    const { message  } = req.body;
    // Validate if event and local exist
    const event = await Event.findByPk(eventid);
    const local = await Local.findByPk(localid);

    if (!event || !local) {
      return res.status(404).json({ message: 'Event or Local not found' });
    }

    // Create the LocalXEvent
    const localXEvent = await LocalXEvent.create({
      eventId: eventid,
      localId: localid,
      message,
    });

    res.status(201).json({ message: 'LocalXEvent created successfully', localXEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

