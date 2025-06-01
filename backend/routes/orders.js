const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all orders (admin only)
router.get('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  const orders = await Order.find().populate('user').populate('products.product');
  res.json(orders);
});

// Get user orders
router.get('/my', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('products.product');
  res.json(orders);
});

// Create order
router.post('/', auth, async (req, res) => {
  const { products, amount, paymentId } = req.body;
  const order = new Order({ user: req.user.id, products, amount, paymentId, status: 'paid' });
  await order.save();
  res.status(201).json(order);
});

module.exports = router;
