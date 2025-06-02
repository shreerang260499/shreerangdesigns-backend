const mongoose = require('mongoose');
const PromoCode = require('../models/PromoCode');

const MONGO_URI = process.env.MONGO_URI || 'your_mongo_uri_here';

console.log('Using MONGO_URI:', MONGO_URI);

const checkPromoCodes = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const promoCodes = await PromoCode.find({ active: true });
    console.log('Active Promo Codes:', promoCodes);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error checking promo codes:', error);
  }
};

checkPromoCodes();
