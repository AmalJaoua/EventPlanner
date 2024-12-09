const db = require('../models'); // Import Sequelize models
const bcrypt = require('bcrypt');

// Create an OC (user with type = 3) and associate with an event
exports.createOC = async (req, res) => {
  const { eventId } = req.params; // Extract eventId from route parameters
  const { name, email, password,phoneNumber } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  try {
    // Check if the event exists
    const event = await db.Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user with type = 3 (OC)
    const newOC = await db.User.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      type: 3,
    });
    
    console.log("Created OC: ", newOC);  // Log the created OC object to check the id
    
    // Check if the id is set correctly
  

    // Associate the OC with the event in UsersXEvents
    await db.UsersXEvents.create({
      userId: newOC.userId,
      eventId,
    });

    res.status(201).json({ message: "OC created successfully.", data: newOC });
  } catch (error) {
    res.status(500).json({ message: "Error creating OC.", error: error.message });
  }
};

// Fetch all OCs for a specific event
exports.getOCsByEvent = async (req, res) => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: "Event ID is required." });
  }

  try {
    const ocs = await db.User.findAll({
      where: { type: 3 }, // Only OCs
      include: {
        model: db.Event,
        where: { id: eventId }, // Filter by specific event
        through: { attributes: [] }, // Exclude intermediate table details
      },
    });

    res.status(200).json({ message: "OCs retrieved successfully.", data: ocs });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving OCs.", error: error.message });
  }
};
