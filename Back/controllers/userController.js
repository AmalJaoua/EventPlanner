const { User } = require('../models');

// Get user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id); // `req.user` is set in authMiddleware
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user details', details: error.message });
  }
};
