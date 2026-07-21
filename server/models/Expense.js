const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Landlord
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', default: null },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ['repairs', 'utilities', 'taxes', 'maintenance'],
      required: true,
    },
    amount: { type: Number, required: true },
    isLiability: { type: Boolean, default: false }, // true = Unpaid Liability, false = Paid Expense
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);