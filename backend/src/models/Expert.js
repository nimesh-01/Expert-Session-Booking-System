const mongoose = require('mongoose');

const expertSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    experience: {
        type: Number, // Years of experience
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    availableSlots: [{
        date: { type: String, required: true }, // Format: YYYY-MM-DD
        slots: [{ type: String, required: true }] // e.g., "10:00 AM", "11:00 AM"
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Expert', expertSchema);
