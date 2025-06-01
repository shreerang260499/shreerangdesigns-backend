const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  description: String,
  active: { type: Boolean, default: true },
  expiresAt: Date
});

module.exports = mongoose.model('PromoCode', promoCodeSchema);
