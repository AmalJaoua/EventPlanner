const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config(); // Load environment variables from .env
const cors = require('cors'); // Import the CORS package
const app = express();
const { sequelize } = require('./models'); // Import sequelize instance
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const eventRoutes = require('./routes/event.routes');
const attendeesRoutes = require('./routes/attendees.routes');
const OcsRoutes = require('./routes/ocs.routes');
const ResourcesRoutes = require('./routes/resources.routes');
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware

app.use(cookieParser()); // For parsing cookies
// Enable CORS for all routes
app.use(cors({
  
  credentials: true // Allow cookies to be sent with requests
}));

// Or, if you want to restrict to specific origins, you can configure it like this:
// app.use(cors({ origin: 'http://yourfrontend.com' }));

// Routes
app.use('/auth', authRoutes); // Authentication routes (signup/login)
app.use('/user', userRoutes);
app.use('/events', eventRoutes);  // Corrected this line
app.use('/attendees', attendeesRoutes);
app.use('/ocs', OcsRoutes);
app.use('/resources', ResourcesRoutes);

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
