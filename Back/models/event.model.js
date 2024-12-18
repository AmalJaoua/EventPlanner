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
    status: { 
      type: DataTypes.INTEGER,
      defaultValue: 0, 
      allowNull: false,
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

  // Define associations
  Event.associate = (models) => {
    // BelongsTo association with User
      Event.belongsToMany(models.User, {
        through: models.UsersXEvents,
        foreignKey: 'eventId',
      });
    

    // HasMany association with Attendee
    Event.hasMany(models.Attendee, {
      foreignKey: 'eventId', // Foreign key linking attendees to events
      as: 'attendees',       // Alias for accessing attendees of an event
      onDelete: 'CASCADE',   // Deletes attendees if the event is deleted
      onUpdate: 'CASCADE',
    });

    // BelongsToMany association with Material through MaterialXEvent
    Event.belongsToMany(models.Material, {
      through: models.MaterialXEvent, // Junction table model
      foreignKey: 'eventId',          // Foreign key in the junction table
      otherKey: 'materialId',         // Other foreign key in the junction table
      // as: 'materials',                // Alias for accessing related materials
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // BelongsToMany association with Local through LocalsXEvent
    Event.belongsToMany(models.Local, {
      through: models.LocalXEvent,  // Junction table model name
      foreignKey: 'eventId',   // Foreign key in the junction table
      otherKey: 'localId',     // Other foreign key in the junction table
      // as: 'locals',  
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',          // Alias for accessing related locals
    });
    
  };

  return Event;
};
