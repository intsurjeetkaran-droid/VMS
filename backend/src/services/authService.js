/**
 * Auth Service
 * - Business logic for login and registration
 * - Separated from controller to keep routes thin
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Generate a signed JWT token for a user
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Register a new user (Admin only action)
 */
const registerUser = async ({ name, email, password, role, department }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.create({ name, email, password, role, department });
  logger.info('New user registered', { userId: user._id, role: user.role });
  return user;
};

/**
 * Login — validate credentials and return token
 */
const loginUser = async ({ email, password }) => {
  // Explicitly select password since it's excluded by default
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.isActive) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    logger.warn('Failed login attempt', { email });
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const token = generateToken(user._id);
  logger.info('User logged in', { userId: user._id, role: user.role });

  // Return user without password
  const userObj = user.toObject();
  delete userObj.password;

  return { user: userObj, token };
};

module.exports = { registerUser, loginUser };
