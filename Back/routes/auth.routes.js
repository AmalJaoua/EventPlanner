// /routes/authRoutes.js
const express = require('express');
const { signup, login, checkAdmin } = require('../controllers/authController');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected route: check if the user is admin
router.get('/check-admin', authenticate, isAdmin, checkAdmin);

module.exports = router;
