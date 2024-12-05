module.exports = (sequelize, DataTypes) => {
    const Material = sequelize.define('Material', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  
    // Define the relationship with the Event model
    Material.associate = (models) => {
      Material.belongsToMany(models.Event, {
        through: models.MaterialXEvent, // Junction table model
        foreignKey: 'materialId',       // Foreign key in the junction table
        otherKey: 'eventId',            // Other foreign key in the junction table
        as: 'events',                   // Alias for accessing related events
      });
    };
  
    return Material;
  };
  