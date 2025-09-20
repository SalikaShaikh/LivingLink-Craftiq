// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g. "18:00-22:00"
  purpose: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Secretary id
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);