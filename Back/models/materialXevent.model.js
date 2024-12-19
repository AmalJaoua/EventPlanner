module.exports = (sequelize, DataTypes) => {
    const MaterialXEvent = sequelize.define('MaterialXEvent', {
      MxEid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      materialId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Materials', // Name of the Material table
          key: 'id',
        },
        allowNull: false,
        primaryKey: true,
      },
      eventId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Events', // Name of the Event table
          key: 'id',
        },
        allowNull: false,
        primaryKey: true,
      },
      quantityUsed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      message: {
        type: DataTypes.TEXT, 
        allowNull: true, // Nullable
      },
      status: {
        type: DataTypes.BOOLEAN, // Boolean field
        allowNull: true, 
        defaultValue:0,
      },
    });
  
    return MaterialXEvent;
  };
  