module.exports = (sequelize, DataTypes) => {
    const UsersXEvents = sequelize.define('UsersXEvents', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Events',
          key: 'id',
        },
      },
    });
  
    return UsersXEvents;
  };
  