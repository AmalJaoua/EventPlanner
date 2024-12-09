module.exports = (sequelize, DataTypes) => {
    const UsersXEvents = sequelize.define('UsersXEvents', {

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'Events',
          key: 'id',
        },
      },
    });
  
    return UsersXEvents;
  };
  