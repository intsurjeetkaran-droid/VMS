/**
 * Auth Middleware
 * - Verifies JWT token from Authorization header
 * - Attaches decoded user to req.user
 * - Role guard: authorize(...roles) restricts access by role
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/apiResponse');
const logger = require('../utils/logger');

// Verify JWT and attach user to request
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Not authorized, no token', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user from DB — ensures deactivated users are blocked
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return errorResponse(res, 'User not found or deactivated', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    logger.warn('Auth middleware failed', { error: error.message });
    return errorResponse(res, 'Not authorized, invalid token', 401);
  }
};

// Role-based access control — usage: authorize('admin', 'receptionist')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn('Unauthorized role access attempt', {
        userId: req.user._id,
        role: req.user.role,
        requiredRoles: roles,
      });
      return errorResponse(res, `Role '${req.user.role}' is not authorized for this action`, 403);
    }
    next();
  };
};

module.exports = { protect, authorize };
