const db = require('../models'); // Import Sequelize models
const bcrypt = require('bcrypt');

// Create an OC (user with type = 2) and associate with an event
exports.createOC = async (req, res) => {
  const { eventId } = req.params; // Extract eventId from route parameters
  const { email } = req.body; // Only email is provided in this form

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Check if the event exists
    const event = await db.Event.findByPk(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check if the user exists in the users table
    const existingUser = await db.User.findOne({ where: { email } });
    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found. Please create an account first." });
    }

    // Associate the user with the event in UsersXEvents
    await db.UsersXEvents.create({
      userId: existingUser.userId,
      eventId,
    });

    res.status(201).json({
      message: "OC associated with the event successfully.",
      data: { userId: existingUser.userId, eventId },
    });
  } catch (error) {
    res.status(500).json({ message: "Error associating OC with event.", error: error.message });
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
      where: { type: 2 }, // Only OCs
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
