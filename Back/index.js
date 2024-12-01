const express = require('express');
require('dotenv').config(); // Load environment variables from .env
const app = express();
const { sequelize } = require('./models'); // Import sequelize instance
const authRoutes = require('./routes/auth.routes');


const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Routes
app.use('/auth', authRoutes); // Authentication routes (signup/login)


// Test route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Sync the database and start the server
sequelize.sync()
  .then(() => {
    console.log('Database synced!');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error syncing database:', error);
  });
