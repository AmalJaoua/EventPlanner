// /middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = {
  authenticate: (req, res, next) => {
    const token = req.cookies.token; // Assuming JWT is stored in a cookie named 'token'

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, SECRET); // Verify the JWT token
      req.user = decoded; // Attach decoded user info to the request
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  },

  isAdmin: (req, res, next) => {
    // Check if user is admin
    if (req.user.type !== 0) {
      return res.status(403).json({ error: 'Access forbidden. Admins only.' });
    }
    next();
  }
};
