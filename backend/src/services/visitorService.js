/**
 * Visitor Service
 * - All business logic for visitor CRUD and status management
 */
const Visitor = require('../models/Visitor');
const Log = require('../models/Log');
const logger = require('../utils/logger');
const { isBlacklisted } = require('./securityService');

/**
 * Create a new visitor record (Receptionist)
 */
const createVisitor = async (data, receptionistId) => {
  const visitor = await Visitor.create({ ...data, registered_by: receptionistId });
  logger.info('Visitor created', { visitorId: visitor._id, receptionist: receptionistId });
  return visitor;
};

/**
 * Get all visitors — Admin/Receptionist see all, Employee sees only their own
 */
const getVisitors = async (user, filters = {}) => {
  const query = { ...filters };

  if (user.role === 'employee') {
    query.host_id = user._id;
  }

  return Visitor.find(query)
    .populate('host_id', 'name email department')
    .populate('registered_by', 'name')
    .sort({ createdAt: -1 });
};

/**
 * Get single visitor by ID
 */
const getVisitorById = async (id) => {
  const visitor = await Visitor.findById(id)
    .populate('host_id', 'name email department')
    .populate('registered_by', 'name');

  if (!visitor) {
    const err = new Error('Visitor not found');
    err.statusCode = 404;
    throw err;
  }
  return visitor;
};

/**
 * Update visitor details
 */
const updateVisitor = async (id, data) => {
  const visitor = await Visitor.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('host_id', 'name email department');

  if (!visitor) {
    const err = new Error('Visitor not found');
    err.statusCode = 404;
    throw err;
  }

  logger.info('Visitor updated', { visitorId: id });
  return visitor;
};

/**
 * Check-in a visitor
 * - Sets status to 'checked-in' and records entry_time
 * - Creates a log entry
 */
const checkInVisitor = async (visitorId, receptionistId) => {
  const visitor = await Visitor.findById(visitorId);

  if (!visitor) {
    const err = new Error('Visitor not found');
    err.statusCode = 404;
    throw err;
  }

  if (visitor.status === 'checked-in') {
    const err = new Error('Visitor is already checked in');
    err.statusCode = 400;
    throw err;
  }

  if (visitor.status === 'rejected') {
    const err = new Error('Cannot check in a rejected visitor');
    err.statusCode = 400;
    throw err;
  }

  // Block blacklisted visitors — security check
  if (visitor.is_blacklisted) {
    const err = new Error('This visitor is blacklisted and cannot be checked in');
    err.statusCode = 403;
    throw err;
  }

  visitor.status = 'checked-in';
  visitor.entry_time = new Date();
  await visitor.save();

  // Create audit log
  await Log.create({ type: 'checkin', visitor_id: visitorId, performed_by: receptionistId });

  logger.info('Visitor checked in', { visitorId, receptionist: receptionistId });
  return visitor;
};

/**
 * Check-out a visitor
 * - Sets status to 'checked-out' and records exit_time
 * - Creates a log entry
 */
const checkOutVisitor = async (visitorId, receptionistId) => {
  const visitor = await Visitor.findById(visitorId);

  if (!visitor) {
    const err = new Error('Visitor not found');
    err.statusCode = 404;
    throw err;
  }

  if (visitor.status !== 'checked-in') {
    const err = new Error('Visitor is not currently checked in');
    err.statusCode = 400;
    throw err;
  }

  visitor.status = 'checked-out';
  visitor.exit_time = new Date();
  await visitor.save();

  await Log.create({ type: 'checkout', visitor_id: visitorId, performed_by: receptionistId });

  logger.info('Visitor checked out', { visitorId, receptionist: receptionistId });
  return visitor;
};

/**
 * Approve or reject a visitor (Employee)
 */
const updateVisitorStatus = async (visitorId, status, employeeId) => {
  const visitor = await Visitor.findOne({ _id: visitorId, host_id: employeeId });

  if (!visitor) {
    const err = new Error('Visitor not found or not assigned to you');
    err.statusCode = 404;
    throw err;
  }

  visitor.status = status;
  await visitor.save();

  logger.info('Visitor status updated by employee', { visitorId, status, employeeId });
  return visitor;
};

/**
 * Search visitors by name or phone
 */
const searchVisitors = async (query, user) => {
  const baseQuery = user.role === 'employee' ? { host_id: user._id } : {};

  return Visitor.find({
    ...baseQuery,
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { phone: { $regex: query, $options: 'i' } },
    ],
  })
    .populate('host_id', 'name email department')
    .limit(20);
};

module.exports = {
  createVisitor,
  getVisitors,
  getVisitorById,
  updateVisitor,
  checkInVisitor,
  checkOutVisitor,
  updateVisitorStatus,
  searchVisitors,
};
