const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAssignments,
  getAvailableUnits,
  createAssignment,
  activateLease,
  terminateLease,
} = require("../controllers/assignmentController");

// Base path: /api/assignments
router.use(protect, authorize("agent", "admin"));

router.get("/", getAssignments);
router.get("/available-units", getAvailableUnits);
router.post("/", createAssignment);
router.put("/:id/activate", activateLease);
router.put("/:id/terminate", terminateLease);

module.exports = router;