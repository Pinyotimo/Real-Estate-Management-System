const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAgentOverview,
  getTenantsList,
  assignTenant,
  unassignTenant,
  updateOperations,
  addExpense,
} = require('../controllers/agentController');

router.use(protect, authorize('agent', 'admin'));

router.get('/overview', getAgentOverview);
router.get('/tenants', getTenantsList);
router.put('/properties/:id/assign', assignTenant);
router.put('/properties/:id/unassign', unassignTenant);
router.put('/properties/:id/operations', updateOperations);
router.post('/expenses', addExpense);

module.exports = router;