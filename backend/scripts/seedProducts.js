const Product = require('../models/Product');
const products = [
  {
    name: 'Modern CNC Door 1',
    description: 'A beautiful modern CNC door design.',
    price: 1999,
    imageUrl: '/images/door1.jpg',
    category: 'Modern'
  },
  {
    name: 'Classic CNC Door 2',
    description: 'A classic CNC door design for traditional homes.',
    price: 2499,
    imageUrl: '/images/door2.jpg',
    category: 'Classic'
  }
];

async function seed() {
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log('Products seeded');
  process.exit();
}

seed();
