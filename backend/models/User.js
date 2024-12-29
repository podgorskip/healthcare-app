const mongoose = require('mongoose');

const User = new mongoose.Schema({
    id: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String, required: true },
    sex: { type: String, enum: ['MALE', 'FEMALE'] },
    age: { type: Number },
    scheduledVisits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ScheduledVisit' }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }] 
});

module.exports = mongoose.model('User', User);
