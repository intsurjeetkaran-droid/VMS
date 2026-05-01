/**
 * Visitor Controller
 * - Delegates all logic to visitorService
 */
const visitorService = require('../services/visitorService');
const { successResponse } = require('../utils/apiResponse');

const createVisitor = async (req, res, next) => {
  try {
    const visitor = await visitorService.createVisitor(req.body, req.user._id);
    return successResponse(res, { visitor }, 'Visitor registered', 201);
  } catch (error) {
    next(error);
  }
};

const getVisitors = async (req, res, next) => {
  try {
    // Support optional status filter via query param: ?status=pending
    const filters = req.query.status ? { status: req.query.status } : {};
    const visitors = await visitorService.getVisitors(req.user, filters);
    return successResponse(res, { visitors });
  } catch (error) {
    next(error);
  }
};

const getVisitor = async (req, res, next) => {
  try {
    const visitor = await visitorService.getVisitorById(req.params.id);
    return successResponse(res, { visitor });
  } catch (error) {
    next(error);
  }
};

const updateVisitor = async (req, res, next) => {
  try {
    const visitor = await visitorService.updateVisitor(req.params.id, req.body);
    return successResponse(res, { visitor }, 'Visitor updated');
  } catch (error) {
    next(error);
  }
};

const checkIn = async (req, res, next) => {
  try {
    const visitor = await visitorService.checkInVisitor(req.params.id, req.user._id);
    return successResponse(res, { visitor }, 'Visitor checked in');
  } catch (error) {
    next(error);
  }
};

const checkOut = async (req, res, next) => {
  try {
    const visitor = await visitorService.checkOutVisitor(req.params.id, req.user._id);
    return successResponse(res, { visitor }, 'Visitor checked out');
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const visitor = await visitorService.updateVisitorStatus(req.params.id, status, req.user._id);
    return successResponse(res, { visitor }, `Visitor ${status}`);
  } catch (error) {
    next(error);
  }
};

const searchVisitors = async (req, res, next) => {
  try {
    const { q } = req.query;
    const visitors = await visitorService.searchVisitors(q, req.user);
    return successResponse(res, { visitors });
  } catch (error) {
    next(error);
  }
};

module.exports = { createVisitor, getVisitors, getVisitor, updateVisitor, checkIn, checkOut, updateStatus, searchVisitors };
