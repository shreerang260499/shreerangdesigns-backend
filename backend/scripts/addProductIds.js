const mongoose = require('mongoose');
const Product = require('../models/Product');
const { v4: uuidv4 } = require('uuid');

const MONGO_URI = process.env.MONGO_URI || 'your_mongo_uri_here';

const addProductIds = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const products = await Product.find({ productId: { $exists: false } });
    for (const product of products) {
      product.productId = uuidv4();
      await product.save();
      console.log(`Updated product: ${product.name} with productId: ${product.productId}`);
    }

    console.log('All products updated with productId');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error updating products:', error);
  }
};

addProductIds();
