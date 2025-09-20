// models/MaintenanceRequest.js
const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
  resident: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['electrician', 'plumber', 'carpenter', 'cleaner'], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['pending', 'ongoing', 'done'], default: 'pending' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Maintenance staff updating status
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);