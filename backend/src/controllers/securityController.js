/**
 * Security Controller — Blacklist management
 */
const svc = require('../services/securityService');
const { successResponse } = require('../utils/apiResponse');

const getBlacklist = async (req, res, next) => {
  try {
    const list = await svc.getBlacklist();
    return successResponse(res, { blacklist: list });
  } catch (err) { next(err); }
};

const blacklist = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const visitor = await svc.blacklistVisitor(req.params.id, reason || 'No reason provided', req.user._id);
    return successResponse(res, { visitor }, 'Visitor blacklisted');
  } catch (err) { next(err); }
};

const unblacklist = async (req, res, next) => {
  try {
    const visitor = await svc.unblacklistVisitor(req.params.id, req.user._id);
    return successResponse(res, { visitor }, 'Visitor removed from blacklist');
  } catch (err) { next(err); }
};

module.exports = { getBlacklist, blacklist, unblacklist };
