module.exports = {
    HOST: "localhost",
    USER: "supcom", 
    PASSWORD: "admin", 
    DB: "events", 
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
  