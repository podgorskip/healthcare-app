const mongoose = require('mongoose');

const Comment = new mongoose.Schema({
  id: { type: String },                     
  comment: { type: String },                                
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  date: { type: Date }
});

module.exports = mongoose.model('Comment', Comment);
