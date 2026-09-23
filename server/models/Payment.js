const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: "TenantAssignment", required: true },
    amount: { type: Number, required: true },
    paymentType: {
      type: String,
      enum: ["rent", "deposit", "utility"],
      default: "rent",
    },
    paymentMethod: { type: String, default: "mpesa" },
    transactionId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);