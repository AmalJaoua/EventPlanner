const { Event, LocalXEvent, MaterialXEvent, Local, Material } = require('../models');
const { Op, where, fn, col } = require('sequelize');

const getAvailableLocalsAndMaterials = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // Expect startDate and endDate in ISO format

    // Log input dates for debugging
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);

    // Step 1: Get all locals that are **booked** during the given date range (Only those used in events)
    const bookedLocals = await Local.findAll({
      include: [
        {
          model: Event,
          as: 'Events',
          where: {
            [Op.or]: [
              { dateStart: { [Op.between]: [startDate, endDate] } },
              { dateEnd: { [Op.between]: [startDate, endDate] } },
              {
                dateStart: { [Op.lte]: startDate },
                dateEnd: { [Op.gte]: endDate },
              },
            ],
          },
          attributes: ['id'], // Only need Event ID for checking overlap
        },
      ],
    });

    // Log booked locals for debugging
    console.log("Booked Locals:", bookedLocals);

    // Extract booked local IDs
    const bookedLocalIds = bookedLocals.map((localEvent) => localEvent.id); // Get localId from the relation
    console.log("Booked Local IDs:", bookedLocalIds);

    // Step 2: Get available locals (those not booked in the date range)
    const availableLocals = await Local.findAll({
      where: {
        id: {
          [Op.notIn]: bookedLocalIds, // Only get locals that are not booked in the given date range
        },
      },
    });

    // Log available locals for debugging
    console.log("Available Locals:", availableLocals);

// Find all materials that are being used during the given date range
const bookedMaterials = await Material.findAll({
  include: [
    {
      model: Event,
      as: 'Events', // This should match the alias used in your associations
      through: {
        model: MaterialXEvent,
        attributes: ['materialId', 'quantityUsed'], // Fetch the quantityUsed from the junction table
      },
      where: {
        [Op.or]: [
          { dateStart: { [Op.between]: [startDate, endDate] } },
          { dateEnd: { [Op.between]: [startDate, endDate] } },
          { dateStart: { [Op.lte]: startDate }, dateEnd: { [Op.gte]: endDate } },
        ],
      },
      attributes: ['id'], // Only need Event ID, no need to fetch full event details
    },
  ],
});

// Get the material IDs and their quantities used in the events
const materialUsage = bookedMaterials.map((material) => {
  return material.Events.map((event) => {
    return {
      materialId: material.id,
      quantityUsed: event.MaterialXEvent.quantityUsed,
    };
  });
}).flat();

// Aggregate the quantities used per material
const materialUsageAggregated = materialUsage.reduce((acc, { materialId, quantityUsed }) => {
  if (acc[materialId]) {
    acc[materialId] += quantityUsed;
  } else {
    acc[materialId] = quantityUsed;
  }
  return acc;
}, {});

// Now find all materials that have enough quantity remaining
const availableMaterials = await Material.findAll({
  where: {
    quantity: {
      [Op.gte]: 1, // Ensure that only materials with at least 1 quantity are available
    },
  },
});

// Check materials with usage but still have available quantity
const materialsWithSufficientQuantity = availableMaterials.filter(material => {
  const totalUsed = materialUsageAggregated[material.id] || 0;
  // Check if the material still has remaining quantity
  return material.quantity - totalUsed > 0;  // This ensures the material still has available quantity
});



    // Step 3: Send response
    res.status(200).json({
      availableLocals,
      materialsWithSufficientQuantity,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'An error occurred while fetching availability.' });
  }
};

module.exports = { getAvailableLocalsAndMaterials };
