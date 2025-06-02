const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true },
  productType: { type: String, required: true, enum: ['cnc', 'printable'] },
  featured: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  downloadUrl: { type: String },
  downloadFormat: { type: String, required: true },
  dimensions: { type: String, required: true },
  compatibility: { type: String }, // Only required for CNC designs
  createdAt: { type: Date, default: Date.now },
  productId: { type: String, unique: true, default: uuidv4 }
});

module.exports = mongoose.model('Product', productSchema);
