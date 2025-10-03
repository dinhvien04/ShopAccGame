const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('config');
const Admin = require('../models/Admin');

const connectDB = async () => {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const createSuperAdmin = async () => {
  await connectDB();

  try {
    // Check if SuperAdmin already exists
    const existingSuperAdmin = await Admin.findOne({ role: 'SuperAdmin' });
    
    if (existingSuperAdmin) {
      console.log('SuperAdmin đã tồn tại!');
      console.log('Username:', existingSuperAdmin.username);
      console.log('Email:', existingSuperAdmin.email);
      process.exit(0);
    }

    // Create SuperAdmin
    const superAdminData = {
      username: 'superadmin',
      password: 'admin123456', // Nên đổi mật khẩu sau khi tạo
      email: 'admin@shopt1.com',
      fullName: 'Super Administrator',
      role: 'SuperAdmin',
      permissions: {
        manageUsers: true,
        manageListings: true,
        manageTransactions: true,
        viewStats: true,
        manageAdmins: true
      },
      isActive: true
    };

    const admin = new Admin(superAdminData);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(superAdminData.password, salt);

    await admin.save();

    console.log('✅ SuperAdmin đã được tạo thành công!');
    console.log('===================================');
    console.log('Username: superadmin');
    console.log('Password: admin123456');
    console.log('Email: admin@shopt1.com');
    console.log('===================================');
    console.log('⚠️  Hãy đăng nhập và đổi mật khẩu ngay!');
    
    process.exit(0);
  } catch (err) {
    console.error('Lỗi khi tạo SuperAdmin:', err.message);
    process.exit(1);
  }
};

createSuperAdmin();




