const mongoose = require('mongoose');

const TimeSlot = new mongoose.Schema({
  id: { type: Number, required: true },  
  from: { type: String, required: true }, 
  to: { type: String, required: true },   
});

module.exports = mongoose.model('TimeSlot', TimeSlot);
