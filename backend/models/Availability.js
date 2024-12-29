const mongoose = require('mongoose');
const SingleDay = require('./SingleDay'); 

const Availability = new mongoose.Schema({
    type: { type: String, required: true, enum: ['presence', 'absence'] },
    availabilities: { type: [SingleDay.schema], default: [] },
});

module.exports = mongoose.model('Availability', Availability);
