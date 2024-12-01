const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // To handle JSON payloads

// Placeholder route to test if server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

db.sequelize.sync()
  .then(() => {
    console.log('Database synced!');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });