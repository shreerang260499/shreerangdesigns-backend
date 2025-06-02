require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  {
    name: 'Modern CNC Door Design',
    description: 'A beautiful modern CNC door design featuring geometric patterns. Perfect for contemporary homes and offices.',
    price: 1999,
    imageUrl: '/images/modern-cnc-door.jpg',
    category: 'modern',
    productType: 'cnc',
    featured: true,
    bestseller: true,
    downloadFormat: 'DXF, DWG',
    dimensions: '2100mm x 900mm',
    compatibility: 'Compatible with all standard CNC machines',
    downloadUrl: '/downloads/modern-cnc-door.zip'
  },
  {
    name: 'Classic Door Pattern',
    description: 'A timeless classic CNC door design that brings elegance to any entrance.',
    price: 2499,
    imageUrl: '/images/classic-door.jpg',
    category: 'traditional',
    productType: 'cnc',
    featured: true,
    downloadFormat: 'DXF, DWG',
    dimensions: '2100mm x 900mm',
    compatibility: 'Compatible with all standard CNC machines',
    downloadUrl: '/downloads/classic-door.zip'
  },
  {
    name: 'Abstract Wall Art Print',
    description: 'Modern abstract art print perfect for home or office decoration.',
    price: 999,
    imageUrl: '/images/abstract-art.jpg',
    category: 'modern',
    productType: 'printable',
    featured: true,
    downloadFormat: 'JPG, PNG (300 DPI)',
    dimensions: 'A3, A4 sizes included',
    downloadUrl: '/downloads/abstract-art.zip'
  }
];

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany();
    console.log('Cleared existing products');

    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`Seeded ${createdProducts.length} products successfully`);

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit();
  }
}

seed();
