module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    
    User.associate = (models) => {
      User.belongsToMany(models.Event, {
        through: models.UsersXEvents,
        foreignKey: 'userId',
      });
    };
  
    return User;
  };
  