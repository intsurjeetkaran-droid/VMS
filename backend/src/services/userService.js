/**
 * User Service
 * - Admin-level user management operations
 */
const User = require('../models/User');
const logger = require('../utils/logger');

const getAllUsers = async (filters = {}) => {
  return User.find(filters).select('-password').sort({ createdAt: -1 });
};

const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

const updateUser = async (id, data) => {
  // Prevent role escalation via this route — admin must explicitly set role
  const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  logger.info('User updated', { userId: id });
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  logger.info('User deactivated', { userId: id });
  return user;
};

const getEmployees = async () => {
  return User.find({ role: 'employee', isActive: true }).select('name email department');
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, getEmployees };
