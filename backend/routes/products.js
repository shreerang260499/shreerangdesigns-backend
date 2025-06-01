const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Get single product
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Create product (admin only)
router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// Update product (admin only)
router.put('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// Delete product (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

module.exports = router;
