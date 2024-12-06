module.exports = (sequelize, DataTypes) => {
    const Attendee = sequelize.define('Attendee', {
      phoneNumber: {
        type: DataTypes.STRING,
        primaryKey: true, // Unique identifier for attendees
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true, // Ensures valid email format
        },
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 'Pending', // Default status
      },
    });
  
    // Define the relationship with the Event model
    Attendee.associate = (models) => {
      Attendee.belongsTo(models.Event, {
        foreignKey: 'eventId', // Foreign key linking attendee to an event
        as: 'event',           // Alias for accessing the related event
        onDelete: 'CASCADE',   // Deletes attendees if the associated event is deleted
      });
    };
  
    return Attendee;
  };
  