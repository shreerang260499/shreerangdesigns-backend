const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR', receipt } = req.body;
  try {
    const options = { amount: amount * 100, currency, receipt };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Razorpay order creation failed' });
  }
});

// Verify payment signature
router.post('/verify', (req, res) => {
  const { order_id, payment_id, signature } = req.body;
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(order_id + '|' + payment_id);
  const generatedSignature = hmac.digest('hex');
  if (generatedSignature === signature) {
    res.json({ valid: true });
  } else {
    res.status(400).json({ valid: false });
  }
});

module.exports = router;
