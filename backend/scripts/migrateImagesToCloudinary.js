const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function migrateImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const products = await Product.find();

    for (const product of products) {
      if (product.imageUrl && !product.imageUrl.startsWith('http')) {
        const localImagePath = path.join(__dirname, '../public/images', product.imageUrl);

        if (fs.existsSync(localImagePath)) {
          const result = await cloudinary.uploader.upload(localImagePath, {
            folder: 'products',
          });

          product.imageUrl = result.secure_url;
          await product.save();

          console.log(`Migrated image for product: ${product.name}`);
        } else {
          console.warn(`Image not found for product: ${product.name}`);
        }
      }
    }

    console.log('Image migration completed');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

migrateImages();
