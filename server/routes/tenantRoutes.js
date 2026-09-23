const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getTenantOverview,
  makePayment,
  submitComplaint,
} = require("../controllers/tenantController");

router.get("/overview", protect, getTenantOverview);
router.post("/pay", protect, makePayment);
router.post("/complaints", protect, submitComplaint);

module.exports = router;