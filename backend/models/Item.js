const mongoose = require('mongoose');
const { type } = require('os');

const Item = new mongoose.Schema({
    date: [{ day: {
                type: Date,
                required: true, 
            },
            hour: {
                type: Number,
                required: true, 
            }
        }
    ],
    type: { type: String, required: true },
    details: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true },
    sex: { type: String, required: true },
    age: { type: Number, required: true }
});

module.exports = mongoose.model('Item', Item);
