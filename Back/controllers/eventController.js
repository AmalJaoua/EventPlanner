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



exports.getAllLocalsWithEvents = async (req, res) => {
  try {
    // Fetch locals that exist in LocalXEvents and have associated events
    const localsWithPendingEvents = await Local.findAll({
      include: [
        {
          model: Event,
          as: 'Events', // Alias defined in the association
          through: {
            where: { status: 0 }, // Filter by status in LocalXEvents
            attributes: [], // Exclude intermediate table fields
          },
          required: true, // Ensures only locals with entries in LocalXEvents are included
          attributes: ['id', 'name', 'dateStart'], // Include desired event fields
        },
      ],
    });

    if (!localsWithPendingEvents) {
      return res.status(404).json({ message: 'No locals with pending events found' });
    }
    if( localsWithPendingEvents.length === 0){
      return res.status(200).json([]);
    }
    // Transform the data into a simpler response format
    const response = localsWithPendingEvents.map((local) => ({
      local: {
        id: local.id,
        name: local.name,
      },
      events: local.Events.map((event) => ({
        id: event.id,
        name: event.name,
        dateStart: event.dateStart,
      })),
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching locals with events:', error);
    res.status(500).json({ error: 'Failed to fetch locals and events', details: error.message });
  }
};
exports.getAllMaterialsWithEvents = async (req, res) => {
  try {
    // Fetch materials that exist in MaterialXEvents and have associated events
    const materialsWithPendingEvents = await Material.findAll({
      include: [
        {
          model: Event,
          as: 'Events', // Alias defined in the association
          through: {
            where: { status: 0 }, // Filter by status in MaterialXEvents
            attributes: [], // Exclude intermediate table fields
          },
          required: true, // Ensures only materials with entries in MaterialXEvents are included
          attributes: ['id', 'name', 'dateStart'], // Include desired event fields
        },
      ],
    });

    if (!materialsWithPendingEvents ) {
      return res.status(404).json({ message: 'No materials with pending events found' });
    }
    if(materialsWithPendingEvents.length === 0){
      return res.status(200).json([]);
    }
    // Transform the data into a simpler response format
    const response = materialsWithPendingEvents.map((material) => ({
      material: {
        id: material.id,
        name: material.name,
      },
      events: material.Events.map((event) => ({
        id: event.id,
        name: event.name,
        dateStart: event.dateStart,
      })),
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching materials with events:', error);
    res.status(500).json({ error: 'Failed to fetch materials and events', details: error.message });
  }
};

exports.updateLocalXEventStatus = async (req, res) => {
  const { localId, eventId, status } = req.body; // Extract localId, eventId, and status from the request body

  try {
    // Validate the input
    if (![0, 1, null].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Ensure both localId and eventId are provided
    if (!localId || !eventId) {
      return res.status(400).json({ message: 'localId and eventId are required' });
    }

    // Find the LocalXEvent based on localId and eventId
    const localXEvent = await LocalXEvent.findOne({
      where: {
        localId: localId,
        eventId: eventId
      }
    });

    if (!localXEvent) {
      return res.status(404).json({ message: 'LocalXEvent not found' });
    }

    // Update the status
    localXEvent.status = status;
    await localXEvent.save(); // Save the updated record

    // Respond with the updated LocalXEvent
    res.status(200).json({
      message: 'Status updated successfully',
      localXEvent: {
        localId: localXEvent.localId,
        eventId: localXEvent.eventId,
        status: localXEvent.status
      }
    });

  } catch (error) {
    console.error('Error updating LocalXEvent status:', error);
    res.status(500).json({ error: 'Failed to update LocalXEvent status', details: error.message });
  }
};
exports.updateMaterialXEventStatus = async (req, res) => {
  const { materialId, eventId, status } = req.body; // Extract localId, eventId, and status from the request body

  try {
    // Validate the input
    if (![0, 1, null].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // Ensure both localId and eventId are provided
    if (!materialId || !eventId) {
      return res.status(400).json({ message: 'localId and eventId are required' });
    }

    // Find the LocalXEvent based on localId and eventId
    const materialXEvent = await MaterialXEvent.findOne({
      where: {
        materialId: materialId,
        eventId: eventId
      }
    });

    if (!materialXEvent) {
      return res.status(404).json({ message: 'LocalXEvent not found' });
    }

    // Update the status
    materialXEvent.status = status;
    await materialXEvent.save(); // Save the updated record

    // Respond with the updated LocalXEvent
    res.status(200).json({
      message: 'Status updated successfully',
      materialXEvent: {
        materialId: materialXEvent.materialId,
        eventId: materialXEvent.eventId,
        status: materialXEvent.status
      }
    });

  } catch (error) {
    console.error('Error updating LocalXEvent status:', error);
    res.status(500).json({ error: 'Failed to update LocalXEvent status', details: error.message });
  }
};