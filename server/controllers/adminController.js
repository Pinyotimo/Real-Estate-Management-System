const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry'); // Assumes Inquiry model exists

const buildAuditEntry = (actor, action) => ({
  _id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  actorName: actor?.name || 'System',
  action,
  createdAt: new Date(),
});

let auditLogs = [];

const recordAuditLog = (actor, action) => {
  auditLogs = [buildAuditEntry(actor, action), ...auditLogs].slice(0, 100);
};

// @desc    Get system-wide summary metrics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const totalTenants = await User.countDocuments({ role: 'tenant' });
    const totalProperties = await Property.countDocuments();
    const totalInquiries = await Inquiry.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAgents,
        totalTenants,
        totalProperties,
        totalInquiries,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ suspended: { $ne: true } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get suspended users list
// @route   GET /api/admin/users/suspended
// @access  Private (Admin only)
const getSuspendedUsers = async (req, res) => {
  try {
    const users = await User.find({ suspended: true })
      .select('-password')
      .sort({ suspendedAt: -1, updatedAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();
    recordAuditLog(req.user, `Changed ${user.email}'s role to ${role}`);

    res.status(200).json({ success: true, message: `User role updated to ${role}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Suspend user account and invalidate their sessions
// @route   PUT /api/admin/users/:id/suspend
// @access  Private (Admin only)
const suspendUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Admins cannot suspend their own account' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.suspended = true;
    user.suspendedAt = new Date();
    user.tokenVersion += 1;
    await user.save();
    recordAuditLog(req.user, `Suspended ${user.email}`);

    res.status(200).json({ success: true, message: 'User suspended successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unsuspend user account
// @route   PUT /api/admin/users/:id/unsuspend
// @access  Private (Admin only)
const unsuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.suspended = false;
    user.suspendedAt = null;
    await user.save();
    recordAuditLog(req.user, `Unsuspended ${user.email}`);

    res.status(200).json({ success: true, message: 'User unsuspended successfully', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Invalidate all active sessions
// @route   POST /api/admin/force-logout-all
// @access  Private (Admin only)
const forceLogoutAll = async (req, res) => {
  try {
    await User.updateMany({}, { $inc: { tokenVersion: 1 } });
    recordAuditLog(req.user, 'Forced logout for all users');

    res.status(200).json({ success: true, message: 'All sessions invalidated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recent admin audit activity
// @route   GET /api/admin/audit-logs
// @access  Private (Admin only)
const getAuditLogs = async (req, res) => {
  res.status(200).json({ success: true, data: auditLogs });
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await user.deleteOne();
    recordAuditLog(req.user, `Deleted user ${user.email}`);
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getSuspendedUsers,
  updateUserRole,
  suspendUser,
  unsuspendUser,
  forceLogoutAll,
  getAuditLogs,
  deleteUser,
};
