const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);

// Get all employees — used in visitor form (any logged-in user)
router.get('/employees', ctrl.getEmployees);

// Admin-only routes
router.get('/', authorize('admin'), ctrl.getUsers);
router.get('/:id', authorize('admin'), ctrl.getUser);
router.put('/:id', authorize('admin'), ctrl.updateUser);
router.delete('/:id', authorize('admin'), ctrl.deleteUser);

module.exports = router;
