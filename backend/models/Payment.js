// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  receiptNumber: { type: String, required: true, unique: true },
  month: { type: Number, required: true }, // 1-12 for January-December
  year: { type: Number, required: true }, // e.g., 2023
  paidAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);