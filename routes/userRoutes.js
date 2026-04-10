const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Endpoint: GET http://localhost:8003/api/users/profile
// Notice we put `protect` in the middle! It runs first.
router.get('/profile', protect, getUserProfile);

module.exports = router;