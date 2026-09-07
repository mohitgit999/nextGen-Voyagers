// server/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.SESSION_SECRET || 'voyager-super-secret-key-2026';

// Protect routes - requires valid JWT Bearer token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (error) {
    console.error('Auth token verification error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

// Optional auth - attaches user if token is present, continues as guest if not
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore invalid token for optional auth, treat as guest
      req.user = null;
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
