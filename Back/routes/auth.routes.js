const express = require('express');
const { signup, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);
router.get('/validate-token', authMiddleware.authenticate, authMiddleware.authorizeAdmin, (req, res) => { res.status(200).json({ type: req.user.type }); });
module.exports = router;
