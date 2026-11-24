const jwt = require('jsonwebtoken');
const User = require('../models/User');
const memoryStore = require('../config/memoryStore');
const { isDbConnected } = require('../config/db');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'nearme_super_secret_jwt_key_2026'
      );

      if (isDbConnected()) {
        req.user = await User.findById(decoded.id).select('-passwordHash');
      } else {
        const found = memoryStore.users.find((u) => u._id.toString() === decoded.id.toString());
        if (found) {
          const { passwordHash, ...safeUser } = found;
          req.user = safeUser;
        }
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized: user no longer exists'
        });
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: token expired or invalid'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: no authentication token provided'
    });
  }
};

// Optional auth: populate req.user if token exists, but don't reject if not
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'nearme_super_secret_jwt_key_2026'
      );

      if (isDbConnected()) {
        req.user = await User.findById(decoded.id).select('-passwordHash');
      } else {
        const found = memoryStore.users.find((u) => u._id.toString() === decoded.id.toString());
        if (found) {
          const { passwordHash, ...safeUser } = found;
          req.user = safeUser;
        }
      }
    } catch (err) {
      // Ignore token failure for optional routes
    }
  }
  next();
};

// Admin only middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required'
    });
  }
};

module.exports = { protect, optionalAuth, admin };
