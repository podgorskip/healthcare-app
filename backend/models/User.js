const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = new mongoose.Schema({
    id: { type: String },
    role: { type: String, required: true},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true},
    sex: { type: String },
    age: { type: Number }
});

User.statics.findByUsername = function (username) {
    const query = this.findOne({ username });
    return query;
  };

User.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password); 
};

User.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10); 
    }
    next();
});

module.exports = mongoose.model('User', User);
