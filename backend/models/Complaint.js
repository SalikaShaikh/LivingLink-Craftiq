// models/Complaint.js
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  content: { type: String, required: true },
  status: { type: String, enum: ['pending', 'ongoing', 'done'], default: 'pending' },
  anonymous: { type: Boolean, default: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Resident's id, not exposed publicly
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Secretary or Security updating status
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);