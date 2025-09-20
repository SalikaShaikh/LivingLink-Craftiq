// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // DEBUG: Log what's in the token
    console.log('JWT Decoded:', decoded);
    
    // Use the data from the token directly
    req.user = {
      _id: decoded.id, // This should be "68c6f2d6ccc37963d47119ec"
      role: decoded.role // This should be "resident"
    };
    
    // DEBUG: Log what we're setting as req.user
    console.log('Req.user set to:', req.user);
    
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ message: 'Not authorized, token invalid' });
  }
};

exports.authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: Access denied' });
  }
  next();
};