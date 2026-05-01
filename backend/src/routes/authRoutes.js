const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/auth');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register — Admin only
router.post('/register', protect, authorize('admin'), register);

// GET /api/auth/me — any logged-in user
router.get('/me', protect, getMe);

module.exports = router;
