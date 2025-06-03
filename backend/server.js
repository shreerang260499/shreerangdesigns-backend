// Entry point for the backend server
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const promoCodeRoutes = require('./routes/promocodes');
const resetRoutes = require('./routes/reset');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'https://shreerangdesigns.in',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());

// Serve static files
app.use('/uploads', express.static('uploads'));
app.use('/images', express.static('public/images'));

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/promocodes', promoCodeRoutes);
app.use('/api/reset', resetRoutes);

const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      console.log(`MongoDB connected: ${mongoose.connection.host}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));
