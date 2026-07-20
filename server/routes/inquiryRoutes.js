const express = require("express");
const {
  getInquiries,
  createInquiry,
} = require("../controllers/inquiryController");

const router = express.Router();

router.get("/", getInquiries);
router.post("/", createInquiry);

module.exports = router;
