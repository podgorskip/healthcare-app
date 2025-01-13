const mongoose = require('mongoose'); 
const { Schema } = mongoose; 
const TimeSlot = require('./Slot');  

const SingleDay = new mongoose.Schema({
  date: { type: String, required: true }, 
  slots: [{ type: Schema.Types.ObjectId, ref: 'TimeSlot', required: true }],                 
});

module.exports = mongoose.model('SingleDay', SingleDay);
