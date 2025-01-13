const mongoose = require('mongoose');

const Item = new mongoose.Schema({
    id: { type: String, required: true },
    date: [{ day: Date, hour: Number }],
    type: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    sex: { type: String },
    age: { type: Number, required: true },
    details: { type: String },
    price: { type: Number, required: true },
  });
  
module.exports = mongoose.model('Item', Item);
  