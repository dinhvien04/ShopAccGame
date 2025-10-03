const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const adminAuthController = require('../controllers/adminAuth');
const adminAuth = require('../middleware/adminAuth');
const superAdmin = require('../middleware/superAdmin');

// @route   POST api/admin/auth/login
// @desc    Admin login
// @access  Public
router.post(
    '/login',
    [
        check('username', 'Tên đăng nhập là bắt buộc').not().isEmpty(),
        check('password', 'Mật khẩu là bắt buộc').exists(),
    ],
    adminAuthController.loginAdmin
);

// @route   GET api/admin/auth/me
// @desc    Get logged in admin
// @access  Private (Admin)
router.get('/me', adminAuth, adminAuthController.getLoggedInAdmin);

// @route   POST api/admin/auth/create
// @desc    Create new admin
// @access  Private (SuperAdmin only)
router.post(
    '/create',
    [
        adminAuth,
        superAdmin,
        [
            check('username', 'Username phải từ 3-20 ký tự').isLength({ min: 3, max: 20 }),
            check('password', 'Mật khẩu phải ít nhất 6 ký tự').isLength({ min: 6 }),
            check('email', 'Email không hợp lệ').isEmail(),
            check('fullName', 'Họ tên là bắt buộc').not().isEmpty(),
            check('role', 'Role không hợp lệ').isIn(['SuperAdmin', 'Admin', 'Moderator'])
        ]
    ],
    adminAuthController.createAdmin
);

// @route   PUT api/admin/auth/password
// @desc    Update admin password
// @access  Private (Admin)
router.put(
    '/password',
    [
        adminAuth,
        [
            check('currentPassword', 'Mật khẩu hiện tại là bắt buộc').exists(),
            check('newPassword', 'Mật khẩu mới phải ít nhất 6 ký tự').isLength({ min: 6 })
        ]
    ],
    adminAuthController.updateAdminPassword
);

// @route   GET api/admin/auth/admins
// @desc    Get all admins
// @access  Private (SuperAdmin only)
router.get('/admins', [adminAuth, superAdmin], adminAuthController.getAllAdmins);

module.exports = router;
