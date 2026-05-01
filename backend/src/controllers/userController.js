/**
 * User Controller — Admin user management
 */
const userService = require('../services/userService');
const { successResponse } = require('../utils/apiResponse');

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, { users });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, { user });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return successResponse(res, { user }, 'User updated');
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    return successResponse(res, {}, 'User deactivated');
  } catch (error) {
    next(error);
  }
};

// Get all employees — used in visitor form dropdown
const getEmployees = async (req, res, next) => {
  try {
    const employees = await userService.getEmployees();
    return successResponse(res, { employees });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, updateUser, deleteUser, getEmployees };
