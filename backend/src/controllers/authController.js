/**
 * Auth Controller
 * - Thin layer: validates input, calls service, returns response
 */
const { registerUser, loginUser } = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, department } = req.body;
    const user = await registerUser({ name, email, password, role, department });
    return successResponse(res, { user }, 'User registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    return successResponse(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// Return currently logged-in user info
const getMe = async (req, res) => {
  return successResponse(res, { user: req.user }, 'User fetched');
};

module.exports = { register, login, getMe };
