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
      },
      eventId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Events',
          key: 'id',
        },
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('LocalXEvents');
  },
};
