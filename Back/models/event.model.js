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
  
    return Event;
  };
  