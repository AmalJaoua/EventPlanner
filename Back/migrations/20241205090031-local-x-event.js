'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LocalXEvents', {
      localId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Locals',
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
    await queryInterface.dropTable('LocalXEvents');
  },
};
