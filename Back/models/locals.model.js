module.exports = (sequelize, DataTypes) => {
    const Local = sequelize.define('Local', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    // Define the relationship with the Event model
    Local.associate = (models) => {
      Local.belongsToMany(models.Event, {
        through: models.LocalXEvent,  // Junction table model
        foreignKey: 'localId',        // Foreign key in the junction table
        otherKey: 'eventId',          // Other foreign key in the junction table
        as: 'events',                 // Alias for accessing related events
      });
    };
  
    return Local;
  };
  