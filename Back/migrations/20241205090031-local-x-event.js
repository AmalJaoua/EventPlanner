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
        onDelete: 'CASCADE',
      },
      eventId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Events',
          key: 'id',
        },
        allowNull: false,
        primaryKey: true,
        onDelete: 'CASCADE',
      },
      message: {
        type: Sequelize.TEXT, // Use Sequelize.TEXT if longer messages are needed
        allowNull: true, // Nullable
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false, // 
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('LocalXEvents');
  },
};
