const mongoose = require('mongoose');

const Absence = new mongoose.Schema({
    absence: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SingleDay' }]
});

module.exports = mongoose.model('Absence', Absence);
