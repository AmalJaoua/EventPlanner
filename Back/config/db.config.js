require('dotenv').config(); // Load .env variables

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'defaultUsername',
    password: process.env.AIVEN_PASSWORD || null,
    database: process.env.DB_NAME || 'defaultdb',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
    ssl: false,  // Disables SSL
  },
  },
};
