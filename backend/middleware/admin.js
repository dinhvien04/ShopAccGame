const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Check for admin role
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Admin resource.' });
  }
};
