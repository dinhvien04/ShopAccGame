const config = require('config');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('x-admin-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'Không có token, truy cập bị từ chối' });
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        // Check if token is for admin
        if (decoded.type !== 'admin') {
            return res.status(401).json({ msg: 'Token không hợp lệ cho admin' });
        }

        // Check if admin still exists and is active
        const admin = await Admin.findById(decoded.admin.id);
        if (!admin || !admin.isActive) {
            return res.status(401).json({ msg: 'Admin không tồn tại hoặc đã bị vô hiệu hóa' });
        }

        req.admin = decoded.admin;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token không hợp lệ' });
    }
};
