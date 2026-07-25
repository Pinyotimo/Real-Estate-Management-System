const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAdminStats,
  getAllUsers,
  getSuspendedUsers,
  updateUserRole,
  suspendUser,
  unsuspendUser,
  forceLogoutAll,
  getAuditLogs,
  deleteUser,
} = require('../controllers/adminController');

// All routes here strictly require Admin access
router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.get('/users/suspended', getSuspendedUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/unsuspend', unsuspendUser);
router.delete('/users/:id', deleteUser);
router.post('/force-logout-all', forceLogoutAll);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
