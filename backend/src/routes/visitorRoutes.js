const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/visitorController');
const { protect, authorize } = require('../middlewares/auth');

// All visitor routes require authentication
router.use(protect);

// Search — must be before /:id to avoid conflict
router.get('/search', ctrl.searchVisitors);

// CRUD
router.post('/', authorize('receptionist', 'admin'), ctrl.createVisitor);
router.get('/', ctrl.getVisitors);
router.get('/:id', ctrl.getVisitor);
router.put('/:id', authorize('receptionist', 'admin'), ctrl.updateVisitor);

// Check-in / Check-out — Receptionist only
router.patch('/:id/checkin', authorize('receptionist', 'admin'), ctrl.checkIn);
router.patch('/:id/checkout', authorize('receptionist', 'admin'), ctrl.checkOut);

// Approve / Reject — Employee only
router.patch('/:id/status', authorize('employee'), ctrl.updateStatus);

module.exports = router;
