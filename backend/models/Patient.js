const mongoose = require('mongoose');
const Cart = require('./Cart');

const Patient = new mongoose.Schema({
  id: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
});

module.exports = mongoose.model('Patient', Patient);
