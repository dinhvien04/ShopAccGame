const config = require('config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');

// @desc    Admin login
exports.loginAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Find admin by username
    let admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ 
        errors: [{ msg: 'Tên đăng nhập hoặc mật khẩu không chính xác' }] 
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(400).json({ 
        errors: [{ msg: 'Tài khoản admin đã bị vô hiệu hóa' }] 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ 
        errors: [{ msg: 'Tên đăng nhập hoặc mật khẩu không chính xác' }] 
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Create JWT payload
    const payload = {
      admin: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions
      },
      type: 'admin'
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: '8h' }, // Admin session 8 hours
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token,
          admin: {
            id: admin.id,
            username: admin.username,
            fullName: admin.fullName,
            email: admin.email,
            role: admin.role,
            permissions: admin.permissions
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// @desc    Get logged in admin
exports.getLoggedInAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ msg: 'Admin không tồn tại' });
    }
    res.json(admin);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// @desc    Create new admin (only SuperAdmin)
exports.createAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email, fullName, role, permissions } = req.body;

  try {
    // Check if admin with username or email already exists
    let existingAdmin = await Admin.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingAdmin) {
      return res.status(400).json({ 
        errors: [{ msg: 'Admin với username hoặc email này đã tồn tại' }] 
      });
    }

    // Create new admin
    const admin = new Admin({
      username,
      password,
      email,
      fullName,
      role,
      permissions,
      createdBy: req.admin.id
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();

    res.json({ 
      msg: 'Admin đã được tạo thành công',
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// @desc    Update admin password
exports.updateAdminPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { currentPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.admin.id);

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ 
        errors: [{ msg: 'Mật khẩu hiện tại không chính xác' }] 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    admin.updatedAt = new Date();

    await admin.save();

    res.json({ msg: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};

// @desc    Get all admins (only SuperAdmin)
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select('-password')
      .populate('createdBy', 'username fullName')
      .sort({ createdAt: -1 });
    
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Lỗi server');
  }
};




