const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // JWT secret key

// Signup controller
exports.signup = async (req, res) => {
  const { email, phoneNumber, password, type } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const type=1;
    // Create user
    const user = await User.create({
      email,
      phoneNumber,
      password: hashedPassword,
      type,
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
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login time
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user.userId, email: user.email, type: user.type },
      SECRET, // Use the secret key here
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in', details: error.message });
  }
};
