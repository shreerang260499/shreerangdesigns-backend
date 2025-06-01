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

// Secure download endpoint
router.get('/download/:orderId/:productId', auth, async (req, res) => {
  const { orderId, productId } = req.params;
  const order = await Order.findById(orderId).populate('products.product');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  // Only allow if user owns the order or is admin
  if (!req.user.isAdmin && String(order.user) !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const orderedProduct = order.products.find(p => String(p.product._id) === productId);
  if (!orderedProduct) return res.status(404).json({ message: 'Product not found in order' });
  const downloadUrl = orderedProduct.product.downloadUrl;
  if (!downloadUrl) return res.status(404).json({ message: 'No download available' });
  // Redirect to the download URL (could be a signed URL for S3, etc.)
  return res.redirect(downloadUrl);
});

module.exports = router;
