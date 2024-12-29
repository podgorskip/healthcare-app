const mongoose = require('mongoose');

const Presence = new mongoose.Schema({
    presence: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SingleDay' }]
});

module.exports = mongoose.model('Presence', Presence);
