const express = require("express");
const {
  getProperties,
  createProperty,
} = require("../controllers/propertyController");

const router = express.Router();

router.get("/", getProperties);
router.post("/", createProperty);

module.exports = router;
