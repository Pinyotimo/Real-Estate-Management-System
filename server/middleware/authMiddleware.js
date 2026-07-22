const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }

      // Reject tokens issued before a force-logout / suspend bumped tokenVersion
      if (decoded.tokenVersion !== req.user.tokenVersion) {
        return res.status(401).json({ success: false, message: 'Session expired, please log in again' });
      }

      if (req.user.suspended) {
        return res.status(403).json({ success: false, message: 'This account has been suspended' });
      }

      // Track activity without blocking the request on the write
      User.findByIdAndUpdate(req.user._id, { lastActiveAt: new Date() }).catch(() => {});

      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user?.role}' is not authorized to perform this action`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };