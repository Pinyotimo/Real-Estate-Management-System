// server/models/AuditLog.js
const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    actorName: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, default: "guest" },
    action: { type: String, required: true },
    module: { type: String, default: "SYSTEM" }, // e.g., "AUTH", "PROPERTIES", "PAYMENTS"
    ipAddress: { type: String, default: "0.0.0.0" },
    userAgent: { type: String, default: "Unknown Device" },
    status: { type: String, enum: ["success", "failed", "warning"], default: "success" },
    details: { type: mongoose.Schema.Types.Mixed }, // Extra payload data
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);