const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imageUrl: String,
  category: String,
  createdAt: { type: Date, default: Date.now },
  downloadUrl: { type: String }
});

module.exports = mongoose.model('Product', productSchema);
