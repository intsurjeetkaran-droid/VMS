const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/appointmentController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

router.post('/', ctrl.create);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

// Employee approves/rejects
router.patch('/:id/status', authorize('employee'), ctrl.updateStatus);

// Admin or creator can delete
router.delete('/:id', authorize('admin', 'receptionist'), ctrl.remove);

module.exports = router;
