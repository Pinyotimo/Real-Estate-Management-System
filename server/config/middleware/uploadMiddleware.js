const multer = require('multer');
const { storage } = require('../config/cloudinary');

// Restrict upload batch size and max file size (e.g., 5MB per image)
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;