const express = require('express');
const Cashfree = require('cashfree-pg');
const router = express.Router();

// Cashfree configuration
Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = process.env.CASHFREE_ENV || 'TEST'; // 'PROD' for production

// Create Cashfree order
router.post('/create-order', async (req, res) => {
  const { amount, currency = 'INR', orderId, customerName, customerEmail, customerPhone } = req.body;
  try {
    const orderPayload = {
      order_id: orderId,
      order_amount: amount,
      order_currency: currency,
      customer_details: {
        customer_id: customerEmail,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_name: customerName
      }
    };
    const response = await Cashfree.PGCreateOrder(orderPayload);
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Cashfree order creation failed', error: err.message });
  }
});

// Verify payment (Cashfree webhook or manual verification)
router.post('/verify', async (req, res) => {
  // Implement webhook or manual verification as per Cashfree docs
  res.json({ valid: true });
});

module.exports = router;
