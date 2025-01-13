import mongoose, { Schema } from 'mongoose';

const Review = new mongoose.Schema({
    id: { type: String, required: true },
    score: { type: Number, required: true },
    comment: { type: String, required: true },
    visit: { type: mongoose.Schema.Types.ObjectId, ref: 'ScheduledVisit', required: true },
    date: { type: Date, default: Date.now },
  });
  
module.exports = mongoose.model('Review', Review);
  