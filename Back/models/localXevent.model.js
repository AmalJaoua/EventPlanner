module.exports = (sequelize, DataTypes) => {
  const LocalXEvent = sequelize.define('LocalXEvent', {
    localId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Locals', // Name of the Local table
        key: 'id',
      },
      primaryKey: true,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events', // Name of the Event table
        key: 'id',
      },
      primaryKey: true,
    },
  }, { tableName: 'LocalXEvent' }); // Explicit table name for junction table

  return LocalXEvent;
};
