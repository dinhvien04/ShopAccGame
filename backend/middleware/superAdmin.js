module.exports = function (req, res, next) {
    // Check for SuperAdmin role
    if (req.admin && req.admin.role === 'SuperAdmin') {
        next();
    } else {
        res.status(403).json({ msg: 'Truy cập bị từ chối. Chỉ SuperAdmin mới có quyền.' });
    }
};
