/**
 * Security Service — Blacklist management
 * - Admin can blacklist a visitor by phone number
 * - Check-in is blocked for blacklisted visitors
 */
const Visitor = require('../models/Visitor');
const logger = require('../utils/logger');

/**
 * Blacklist a visitor — sets is_blacklisted = true on all records with same phone
 */
const blacklistVisitor = async (visitorId, reason, adminId) => {
  const visitor = await Visitor.findById(visitorId);
  if (!visitor) {
    const err = new Error('Visitor not found');
    err.statusCode = 404;
    throw err;
  }

  // Blacklist all records with the same phone number
  await Visitor.updateMany(
    { phone: visitor.phone },
    { is_blacklisted: true, notes: `Blacklisted: ${reason}` }
  );

  logger.warn('Visitor blacklisted', { phone: visitor.phone, reason, adminId });
  return visitor;
};

/**
 * Remove from blacklist
 */
const unblacklistVisitor = async (visitorId, adminId) => {
  const visitor = await Visitor.findById(visitorId);
  if (!visitor) {
    const err = new Error('Visitor not found');
    err.statusCode = 404;
    throw err;
  }

  await Visitor.updateMany(
    { phone: visitor.phone },
    { is_blacklisted: false }
  );

  logger.info('Visitor removed from blacklist', { phone: visitor.phone, adminId });
  return visitor;
};

/**
 * Get all blacklisted visitors
 */
const getBlacklist = async () => {
  return Visitor.find({ is_blacklisted: true })
    .select('name phone purpose notes createdAt')
    .sort({ createdAt: -1 });
};

/**
 * Check if a phone number is blacklisted — used before check-in
 */
const isBlacklisted = async (phone) => {
  const record = await Visitor.findOne({ phone, is_blacklisted: true });
  return !!record;
};

module.exports = { blacklistVisitor, unblacklistVisitor, getBlacklist, isBlacklisted };
