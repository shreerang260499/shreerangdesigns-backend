const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create product (admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
    
    const productData = { ...req.body };
    
    // Handle numeric fields
    if (productData.price) {
      productData.price = parseFloat(productData.price);
    }
    if (productData.featured) {
      productData.featured = productData.featured === 'true';
    }
    if (productData.bestseller) {
      productData.bestseller = productData.bestseller === 'true';
    }
    
    // If an image was uploaded, add its path to the product data
    if (req.file) {
      productData.imageUrl = req.file.path.trim(); // Use Cloudinary URL and sanitize
    }
    
    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update product (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
    
    const updateData = { ...req.body };
    
    // Handle numeric fields
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }
    if (updateData.featured) {
      updateData.featured = updateData.featured === 'true';
    }
    if (updateData.bestseller) {
      updateData.bestseller = updateData.bestseller === 'true';
    }
    
    // If an image was uploaded, add its path to the update data
    if (Array.isArray(updateData.imageUrl)) {
      updateData.imageUrl = updateData.imageUrl[0]; // Use the first URL if an array is sent
    }
    if (req.file) {
      updateData.imageUrl = req.file.path.trim(); // Use Cloudinary URL and sanitize
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      updateData,
      { new: true }
    );
    
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
