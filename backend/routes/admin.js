const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const adminAuth = require('../middleware/adminAuth');

// @route   GET api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', adminAuth, adminController.getAllUsers);

module.exports = router;
