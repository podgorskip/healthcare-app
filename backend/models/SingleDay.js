const mongoose = require('mongoose');
const Slot = require('./Slot');

const SingleDay = new mongoose.Schema({
    date: { type: Date, required: true },
    slots: [Slot.schema]
});

module.exports = mongoose.model('SingleDay', SingleDay);
