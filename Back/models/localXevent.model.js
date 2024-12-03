module.exports = (sequelize, DataTypes) => {
    const LocalXEvent = sequelize.define('LocalXEvent', {
      localId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Locals',  // Name of the Local table
          key: 'id',
        },
        allowNull: false,
      },
      eventId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Events', // Name of the Event table
          key: 'id',
        },
        allowNull: false,
      },
      // Add any additional attributes for the relationship here if needed.
      // For example, you could track the capacity or availability status of the local for the event.
    });
  
    return LocalXEvent;
  };
  