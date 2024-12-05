module.exports = (sequelize, DataTypes) => {
    const MaterialXEvent = sequelize.define('MaterialXEvent', {
      materialId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Materials', // Name of the Material table
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
      quantityUsed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  
    return MaterialXEvent;
  };
  