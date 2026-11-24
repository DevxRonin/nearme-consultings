const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const memoryStore = require('../config/memoryStore');
const { isDbConnected } = require('../config/db');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'nearme_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email address already exists'
        });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        passwordHash: password,
        phone: phone || '',
        role: role === 'admin' ? 'admin' : 'customer'
      });

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    }

    // In-memory fallback
    const existing = memoryStore.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = {
      _id: memoryStore.generateId(),
      name,
      email: normalizedEmail,
      passwordHash,
      phone: phone || '',
      role: role === 'admin' ? 'admin' : 'customer',
      createdAt: new Date().toISOString()
    };
    memoryStore.users.push(newUser);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        token: generateToken(newUser._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || '').toLowerCase().trim();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id)
        }
      });
    }

    // In-memory fallback
    const user = memoryStore.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    let user = req.user;
    if (isDbConnected() && req.user._id) {
      user = await User.findById(req.user._id);
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
