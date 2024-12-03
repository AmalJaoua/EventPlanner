module.exports = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dateStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dateEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  
    // Define the relationship with the User model
    Event.associate = (models) => {
      Event.belongsTo(models.User, {
        foreignKey: 'userId',  // Foreign key to associate Event with User
        as: 'user',  // Alias to access the user who created the event
      });
    };
    Event.hasMany(models.Attendee, {
      foreignKey: 'eventId',  // Foreign key linking attendees to events
      as: 'attendees',        // Alias for accessing attendees of an event
      onDelete: 'CASCADE',    // Deletes attendees if the event is deleted
    });

    Event.belongsToMany(models.Material, {
    through: models.MaterialXEvent, // Junction table model
    foreignKey: 'eventId',          // Foreign key in the junction table
    otherKey: 'materialId',         // Other foreign key in the junction table
    as: 'materials',                // Alias for accessing related materials
  });
  Event.belongsToMany(models.Local, {
    through: models.LocalsXEvent, // Junction table model
    foreignKey: 'eventId',        // Foreign key in the junction table
    otherKey: 'localId',          // Other foreign key in the junction table
    as: 'locals',                 // Alias for accessing related locals
  });
    return Event;
  };
  