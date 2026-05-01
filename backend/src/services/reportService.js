/**
 * Report Service
 * - Aggregates data for dashboards and reports
 */
const Visitor = require('../models/Visitor');
const Log = require('../models/Log');
const User = require('../models/User');

/**
 * Dashboard stats — counts by status
 */
const getDashboardStats = async (user) => {
  const baseQuery = user.role === 'employee' ? { host_id: user._id } : {};

  const [total, pending, approved, checkedIn, checkedOut, rejected] = await Promise.all([
    Visitor.countDocuments(baseQuery),
    Visitor.countDocuments({ ...baseQuery, status: 'pending' }),
    Visitor.countDocuments({ ...baseQuery, status: 'approved' }),
    Visitor.countDocuments({ ...baseQuery, status: 'checked-in' }),
    Visitor.countDocuments({ ...baseQuery, status: 'checked-out' }),
    Visitor.countDocuments({ ...baseQuery, status: 'rejected' }),
  ]);

  return { total, pending, approved, checkedIn, checkedOut, rejected };
};

/**
 * Daily visitor report — visitors per day for last N days
 */
const getDailyReport = async (days = 7) => {
  const since = new Date();
  since.setDate(since.getDate() - days);

  return Visitor.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

/**
 * Recent activity logs
 */
const getRecentLogs = async (limit = 20) => {
  return Log.find()
    .populate('visitor_id', 'name phone')
    .populate('performed_by', 'name role')
    .sort({ timestamp: -1 })
    .limit(limit);
};

module.exports = { getDashboardStats, getDailyReport, getRecentLogs };
