const mongoose = require('mongoose');

const Slot = new mongoose.Schema({
    from: { type: String, required: true },
    to: { type: String, required: true }
});

module.exports = mongoose.model('Slot', Slot);
