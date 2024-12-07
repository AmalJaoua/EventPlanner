const { Event, LocalXEvent, MaterialXEvent, Local, Material } = require('../models');
const { Op } = require('sequelize');

const getAvailableLocalsAndMaterials = async (req, res) => {
  try {
    const { startDate, endDate } = req.query; // Expect startDate and endDate in YYYY-MM-DD format
    const rangeStart = new Date(startDate);
    const rangeEnd = new Date(endDate);

    // Step 1: Get all locals that are not booked during the given date range
    const bookedLocals = await LocalXEvent.findAll({
      include: [
        {
          model: Event,
          where: {
            [Op.or]: [
              { dateStart: { [Op.between]: [rangeStart, rangeEnd] } },
              { dateEnd: { [Op.between]: [rangeStart, rangeEnd] } },
              {
                dateStart: { [Op.lte]: rangeStart },
                dateEnd: { [Op.gte]: rangeEnd },
              },
            ],
          },
          attributes: ['id'], // No need to fetch full Event details
        },
      ],
    });

    const bookedLocalIds = bookedLocals.map((localEvent) => localEvent.localId);

    const availableLocals = await Local.findAll({
      where: {
        id: { [Op.notIn]: bookedLocalIds },
      },
    });

    // Step 2: Get all materials whose usage is less than their total quantity during the given date range
    const usedMaterials = await MaterialXEvent.findAll({
      include: [
        {
          model: Event,
          where: {
            [Op.or]: [
              { dateStart: { [Op.between]: [rangeStart, rangeEnd] } },
              { dateEnd: { [Op.between]: [rangeStart, rangeEnd] } },
              {
                dateStart: { [Op.lte]: rangeStart },
                dateEnd: { [Op.gte]: rangeEnd },
              },
            ],
          },
        },
      ],
      attributes: ['materialId', [sequelize.fn('SUM', sequelize.col('quantityUsed')), 'totalUsed']],
      group: ['materialId'],
    });

    const overUsedMaterialIds = [];
    for (const material of usedMaterials) {
      const totalUsed = parseInt(material.get('totalUsed'), 10);
      const materialDetails = await Material.findByPk(material.materialId);
      if (totalUsed >= materialDetails.quantity) {
        overUsedMaterialIds.push(material.materialId);
      }
    }

    const availableMaterials = await Material.findAll({
      where: {
        id: { [Op.notIn]: overUsedMaterialIds },
      },
    });

    // Step 3: Send response
    res.status(200).json({
      availableLocals,
      availableMaterials,
    });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'An error occurred while fetching availability.' });
  }
};

module.exports = { getAvailableLocalsAndMaterials };
