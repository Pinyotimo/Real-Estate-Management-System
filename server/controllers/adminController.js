const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry'); // Assumes Inquiry model exists

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
    const users = await User.find().select('-password').sort({ createdAt: -1 });
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

    res.status(200).json({ success: true, message: `User role updated to ${role}`, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
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
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};