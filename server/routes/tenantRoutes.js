const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTenantOverview,
  makePayment,
  submitComplaint,
} = require('../controllers/tenantController');

router.use(protect);

router.get('/overview', getTenantOverview);
router.post('/pay', makePayment);
router.post('/complaints', submitComplaint);

module.exports = router;