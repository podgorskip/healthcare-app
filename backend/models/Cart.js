const mongoose = require('mongoose'); 
const { Schema } = mongoose; 
const Item = require('./Item');

const Cart = new mongoose.Schema({
  id: { type: String, required: true },
  items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
});

module.exports = mongoose.model('Cart', Cart);
