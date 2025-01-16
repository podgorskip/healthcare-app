const mongoose = require('mongoose');

const ScheduledVisit = new mongoose.Schema({
  date: [{ day: Date, hour: Number }],
  type: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String },
  sex: { type: String },
  age: { type: Number, required: true },
  details: { type: String },
  price: { type: Number, required: true },
  cancelled: { type: Boolean, default: false },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
});

module.exports = mongoose.model('ScheduledVisit', ScheduledVisit);
