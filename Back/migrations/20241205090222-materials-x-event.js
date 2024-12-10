'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MaterialXEvents', {
      materialId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Materials',
          key: 'id',
        },
        allowNull: false,
        primaryKey: true,
      },
      
      eventId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Events',
          key: 'id',
        },
        allowNull: false,
        primaryKey: true,
      },

      quantityUsed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      message: {
        type: Sequelize.TEXT, // Use Sequelize.TEXT if longer messages are needed
        allowNull: true, // Nullable
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: flase, // 
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('MaterialXEvents');
  },
};
