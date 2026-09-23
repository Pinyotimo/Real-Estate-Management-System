const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const { registerUser, loginUser, getMe, updateProfile } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('profilePicture'), updateProfile);

module.exports = router;