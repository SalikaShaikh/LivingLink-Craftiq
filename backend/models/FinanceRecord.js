// models/FinanceRecord.js
const mongoose = require('mongoose');

const financeRecordSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Treasurer id
}, { timestamps: true });

module.exports = mongoose.model('FinanceRecord', financeRecordSchema);