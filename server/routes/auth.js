const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User'); // your User model
const verifyToken = require('../middleware/verifyToken'); // your auth middleware

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: 'uploads/profiles',
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, WebP allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Update user profile
router.put('/me', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const { name, username, email, phone } = req.body;
    const userId = req.user.id;

    // Build update object
    const updateData = {
      name: name || undefined,
      username: username || undefined,
      email: email || undefined,
      phone: phone || undefined,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // Handle file upload if present
    if (req.file) {
      updateData.profilePicture = `/uploads/profiles/${req.file.filename}`;
    }

    // Update user
    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || 'Failed to update profile',
    });
  }
});

module.exports = router;