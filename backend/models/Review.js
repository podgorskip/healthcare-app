const mongoose = require('mongoose'); 

const Review = new mongoose.Schema({
    id: { type: String },
    score: { type: Number, required: true },
    comment: { type: String, required: true },
    visit: { type: mongoose.Schema.Types.ObjectId, ref: 'ScheduledVisit', required: true },
    date: { type: Date, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});
  
module.exports = mongoose.model('Review', Review);
  