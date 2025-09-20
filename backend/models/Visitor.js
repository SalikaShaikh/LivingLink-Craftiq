// models/Visitor.js
const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  flatNumber: { type: String, required: true }, // For both resident and security added visitors
  dateOfVisit: { type: Date, required: true },
  time: { type: String }, // Mainly for security-added visitors
  approved: { type: Boolean, default: false },
  addedBy: { type: String, enum: ['resident', 'security'], required: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);