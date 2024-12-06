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
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('LocalXEvents');
  },
};
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
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('LocalXEvents');
  },
};
