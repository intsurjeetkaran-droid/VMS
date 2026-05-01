const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.get('/stats', ctrl.getDashboardStats);
router.get('/daily', authorize('admin', 'receptionist'), ctrl.getDailyReport);
router.get('/logs', authorize('admin', 'receptionist'), ctrl.getRecentLogs);

module.exports = router;
