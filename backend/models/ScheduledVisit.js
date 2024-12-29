const mongoose = require('mongoose');

const ScheduledVisit = new mongoose.Schema({
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
    price: { type: Number, required: true, min: 0 }
});

module.exports = mongoose.model('ScheduledVisit', ScheduledVisit);
