const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const router = express.Router();

// In-memory store for reset tokens (for demo; use DB in production)
const resetTokens = {};

// POST /api/reset/request
router.post('/request', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ message: 'If that email exists, a reset link has been sent.' });
  const token = crypto.randomBytes(32).toString('hex');
  resetTokens[token] = { userId: user._id, expires: Date.now() + 1000 * 60 * 30 };
  // Send email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  await transporter.sendMail({
    to: user.email,
    subject: 'Password Reset - ShreeRang Designs',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 30 minutes.</p>`
  });
  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

// POST /api/reset/verify
router.post('/verify', async (req, res) => {
  const { token } = req.body;
  const data = resetTokens[token];
  if (!data || data.expires < Date.now()) return res.status(400).json({ message: 'Invalid or expired token' });
  res.json({ valid: true });
});

// POST /api/reset/complete
router.post('/complete', async (req, res) => {
  const { token, password } = req.body;
  const data = resetTokens[token];
  if (!data || data.expires < Date.now()) return res.status(400).json({ message: 'Invalid or expired token' });
  const user = await User.findById(data.userId);
  if (!user) return res.status(400).json({ message: 'User not found' });
  user.password = await bcrypt.hash(password, 10);
  await user.save();
  delete resetTokens[token];
  res.json({ message: 'Password reset successful' });
});

module.exports = router;
