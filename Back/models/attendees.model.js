module.exports = (sequelize, DataTypes) => {
  const Attendee = sequelize.define('Attendee', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Events',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  });

  // Add a unique constraint for the composite key
  Attendee.addHook('afterSync', async () => {
    await sequelize.query(
      `ALTER TABLE Attendees ADD UNIQUE (phoneNumber, eventId);`
    );
  });

  Attendee.associate = (models) => {
    Attendee.belongsTo(models.Event, {
      foreignKey: 'eventId',
      as: 'event',
      onDelete: 'CASCADE',
    });
  };

  return Attendee;
};
