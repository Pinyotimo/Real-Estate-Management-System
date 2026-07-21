const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['plumbing', 'electricity', 'wifi', 'structural', 'other'],
      default: 'plumbing',
    },
    description: { type: String, required: true },
    status: { type: String, enum: ['pending', 'in_progress', 'resolved'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);