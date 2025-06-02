const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // allow social users
  isAdmin: { type: Boolean, default: false },
  mobile: { type: String, required: false } // allow social users
});

module.exports = mongoose.model('User', userSchema);
