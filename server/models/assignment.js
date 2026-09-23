const mongoose = require("mongoose");

const tenantAssignmentSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    agreedRent: { type: Number, required: true },
    securityDepositPaid: { type: Number, default: 0 },
    rentArrears: { type: Number, default: 0 },
    rentPaid: { type: Number, default: 0 },
    billingCycleDay: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["pending_invite", "pending_documents", "active", "notice_given", "terminated"],
      default: "pending_invite",
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    moveOutDate: { type: Date },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.TenantAssignment ||
  mongoose.model("TenantAssignment", tenantAssignmentSchema);