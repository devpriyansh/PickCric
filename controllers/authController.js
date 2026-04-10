const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const User = require('../models/User');
const Otp = require('../models/Otp');

// --- Email Setup (Nodemailer) ---
// You will need to put your real email and App Password in your .env file
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, // e.g., your-email@gmail.com
    pass: process.env.EMAIL_PASS  // e.g., your-16-digit-app-password
  }
});

// API 1: Send OTP to Email
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered. Please login." });
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60000); // Expires in 10 minutes

    // Delete any old OTPs for this email to prevent conflicts
    await Otp.destroy({ where: { email } });

    // Save new OTP to database
    await Otp.create({ email, otpCode, expiresAt });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify your email</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f8fafc;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header {
          background-color: #0F172A; /* Your navy-900 */
          padding: 30px 40px;
          text-align: center;
        }
        .logo {
          font-size: 28px;
          font-weight: 900;
          color: #ffffff;
          margin: 0;
          letter-spacing: -1px;
        }
        .logo span {
          color: #22C55E; /* Your neon-green */
        }
        .content {
          padding: 40px;
          color: #334155;
          line-height: 1.6;
        }
        .title {
          font-size: 20px;
          font-weight: 700;
          color: #0F172A;
          margin-top: 0;
          margin-bottom: 16px;
        }
        .code-container {
          background-color: #f1f5f9;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          margin: 32px 0;
          border: 1px dashed #cbd5e1;
        }
        .code {
          font-family: 'Courier New', Courier, monospace;
          font-size: 36px;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: 8px;
          margin: 0;
        }
        .warning {
          font-size: 13px;
          color: #64748b;
          margin-top: 32px;
          border-top: 1px solid #e2e8f0;
          padding-top: 24px;
        }
        .footer {
          background-color: #f8fafc;
          padding: 24px 40px;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo">Pick<span>Cric</span>.</h1>
        </div>
        <div class="content">
          <h2 class="title">Verify your email address</h2>
          <p>Hello,</p>
          <p>Please use the verification code below to complete your PickCric registration. This code is valid for the next <strong>10 minutes</strong>.</p>
          
          <div class="code-container">
            <p class="code">${otpCode}</p>
          </div>
          
          <p>If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
          
          <div class="warning">
            <strong>Security Tip:</strong> PickCric staff will never ask you for this code. Please do not share it with anyone.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} PickCric Daily Fantasy Sports. All rights reserved.<br>
          This is an automated message, please do not reply.
        </div>
      </div>
    </body>
    </html>
    `;

    // Send Email
    const mailOptions = {
      from: `"PickCric Security" <${process.env.EMAIL_USER}>`, // Looks much cleaner in the inbox
      to: email,
      subject: 'Your PickCric Verification Code',
      html: htmlContent // We use 'html' here instead of 'text'
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "OTP sent to your email" });

  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// API 2: Verify OTP & Register
exports.register = async (req, res) => {
  try {
    const { email, username, password, otp } = req.body;

    if (!email || !username || !password || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const emailTaken = await User.findOne({ where: { email } });
    if (emailTaken) {
      return res.status(400).json({ message: "Email is already registered. Please login." });
    }

    // 1. Check if username is already taken
    const usernameTaken = await User.findOne({ where: { username } });
    if (usernameTaken) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // 2. Verify OTP
    const validOtp = await Otp.findOne({
      where: {
        email,
        otpCode: otp,
        expiresAt: { [Op.gt]: new Date() } // Ensure it hasn't expired
      }
    });

    if (!validOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create User
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // 5. Clean up the used OTP
    await Otp.destroy({ where: { email } });

    // 6. Generate Login Token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET || 'fallback_secret_key_change_me_in_production',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

// API 3: Login
exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: "Please provide email/username and password" });
    }

    // Find user by either email OR username
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: emailOrUsername },
          { username: emailOrUsername }
        ]
      }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key_change_me_in_production',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: { id: user.id, username: user.username, email: user.email, wallet: user.walletBalance }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};