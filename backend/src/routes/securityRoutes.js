const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/securityController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect, authorize('admin'));

router.get('/blacklist', ctrl.getBlacklist);
router.patch('/blacklist/:id', ctrl.blacklist);
router.patch('/unblacklist/:id', ctrl.unblacklist);

module.exports = router;
