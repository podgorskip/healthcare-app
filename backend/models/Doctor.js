const mongoose = require('mongoose');
const SingleDay = require('./SingleDay');  
const User= require('./User');  

const Doctor = new mongoose.Schem({
  id: { type: String, required: true },                     
  phoneNo: { type: String },                                
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  availability: {
    presence: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SingleDay' }],            
    absence: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SingleDay' }]      
  },
});

module.exports = mongoose.model('Doctor', Doctor);
