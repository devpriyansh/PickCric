const express = require('express');
const router = express.Router();
const { sendOtp, register, login } = require('../controllers/authController');

// Authentication Endpoints
// Base URL in server.js should be: app.use('/api/auth', authRoutes);

router.post('/send-otp', sendOtp);
router.post('/register', register);
router.post('/login', login);

module.exports = router;