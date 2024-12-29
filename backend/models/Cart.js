
const mongoose = require('mongoose');
const Item = require('./Item');

const Cart = new mongoose.Schema({
    items: { type: [Item.schema], default: [] },
});

module.exports = mongoose.model('Cart', Cart);
