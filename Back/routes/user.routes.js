const express = require('express');
const { getUserDetails } = require('../controllers/userController');  // Make sure this is correct
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Ensure getUserDetails is defined in the controller and imported correctly
router.get('/profile', authMiddleware.authenticate, getUserDetails);

module.exports = router;
