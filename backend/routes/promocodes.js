const express = require('express');
const PromoCode = require('../models/PromoCode');
const auth = require('../middleware/auth');

const router = express.Router();

// Admin: Create promo code
router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  const { code, discountPercent, description, expiresAt } = req.body;
  try {
    const promo = new PromoCode({ code, discountPercent, description, expiresAt });
    await promo.save();
    res.status(201).json(promo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: List all promo codes
router.get('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  const promos = await PromoCode.find();
  res.json(promos);
});

// Admin: Update promo code
router.put('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  try {
    const promo = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(promo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete promo code
router.delete('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Forbidden' });
  await PromoCode.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// Public: Validate promo code
router.post('/validate', async (req, res) => {
  const { code } = req.body;
  console.log('Received promo code:', code); // Debug log
  const promo = await PromoCode.findOne({ code, active: true });
  console.log('Promo code found:', promo); // Debug log
  if (!promo) return res.status(404).json({ message: 'Invalid or expired promo code' });
  if (promo.expiresAt && new Date() > promo.expiresAt) return res.status(400).json({ message: 'Promo code expired' });
  res.json({ discountPercent: promo.discountPercent, description: promo.description });
});

module.exports = router;
