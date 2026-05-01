/**
 * Report Controller — Dashboard stats and reports
 */
const reportService = require('../services/reportService');
const { successResponse } = require('../utils/apiResponse');

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await reportService.getDashboardStats(req.user);
    return successResponse(res, { stats });
  } catch (error) {
    next(error);
  }
};

const getDailyReport = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const report = await reportService.getDailyReport(days);
    return successResponse(res, { report });
  } catch (error) {
    next(error);
  }
};

const getRecentLogs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const logs = await reportService.getRecentLogs(limit);
    return successResponse(res, { logs });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats, getDailyReport, getRecentLogs };
