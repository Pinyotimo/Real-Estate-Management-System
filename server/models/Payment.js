const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    amount: { type: Number, required: true },
    paymentType: {
      type: String,
      enum: ['rent', 'water', 'electricity', 'service_charge'],
      default: 'rent',
    },
    paymentMethod: {
      type: String,
      enum: ['mpesa', 'card', 'bank_transfer'],
      default: 'mpesa',
    },
    transactionId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);