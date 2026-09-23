const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getAvailableUnits,
  createAssignment,
  getAssignments,
  getAssignmentById,
  approveAssignment,
  uploadDocuments,
  verifyDocument,
  signLease,
  uploadSignedAgreement,
  terminateAssignment,
  renewAssignment,
} = require("../controllers/tenantAssignmentController");

router.use(protect);

router.get("/available-units", authorize("agent", "admin"), getAvailableUnits);

router.route("/").get(getAssignments).post(authorize("agent", "admin"), createAssignment);

router.put("/:id/approve", authorize("agent", "admin"), approveAssignment);
router.get("/:id", getAssignmentById);

router.post(
  "/:id/documents",
  upload.fields([
    { name: "national_id", maxCount: 1 },
    { name: "passport_photo", maxCount: 1 },
    { name: "employment_letter", maxCount: 1 },
    { name: "bank_statement", maxCount: 1 },
    { name: "kra_pin", maxCount: 1 },
    { name: "guarantor_document", maxCount: 3 },
    { name: "other", maxCount: 3 },
  ]),
  uploadDocuments
);

router.put("/:id/documents/:docId/verify", authorize("agent", "admin"), verifyDocument);
router.put("/:id/sign", signLease);
router.post("/:id/signed-agreement", upload.single("signed_agreement"), uploadSignedAgreement);
router.put("/:id/terminate", authorize("agent", "admin"), terminateAssignment);
router.post("/:id/renew", authorize("agent", "admin"), renewAssignment);

module.exports = router;