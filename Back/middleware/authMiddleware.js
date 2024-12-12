const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // JWT secret key

module.exports = {
  // Protect routes with JWT token
  authenticate: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, SECRET); // Verify token with the secret
      req.user = decoded; // Attach decoded user info to the request
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  },

  // Authorize admin users (type=0)
  authorizeAdmin: (req, res, next) => {
    if (req.user.type !== 0) {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
  },
};
