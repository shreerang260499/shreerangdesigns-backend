const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../config/phonepe');

// Create order
router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR', orderId, customerName, customerEmail, customerPhone } = req.body;
  try {
    const orderPayload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      orderId,
      amount,
      currency,
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
    };
    const response = await createOrder(orderPayload);
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'PhonePe order creation failed', error: err.message });
  }
});

// Verify payment (PhonePe webhook or manual verification)
router.post('/verify', async (req, res) => {
  const { paymentId, orderId } = req.body;
  try {
    const paymentPayload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      paymentId,
      orderId,
    };
    const response = await verifyPayment(paymentPayload);
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'PhonePe payment verification failed', error: err.message });
  }
});

module.exports = router;
