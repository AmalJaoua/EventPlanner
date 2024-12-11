// /controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Signup controller
exports.signup = async (req, res) => {
  const { email, phoneNumber, password, type } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      phoneNumber,
      password: hashedPassword,
      type: 1 // Default type for new users
    });

    res.status(201).json({ message: 'User created successfully', userId: user.userId });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user', details: error.message });
  }
};

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user.userId, email: user.email, type: user.type },
      SECRET,
      { expiresIn: '1h' }
    );

    // Set the token as an HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevents JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Only set the cookie over HTTPS in production
      maxAge: 3600000, // 1 hour expiration
      sameSite: 'Strict', // Helps with CSRF protection
    });

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
};
// Check if the user is admin
exports.checkAdmin = (req, res) => {
  if (req.user.type === 0) {
    return res.status(200).json({ userType: req.user.type }); // Admin
  } else {
    return res.status(403).json({ error: 'Forbidden' });
  }
};
