const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Inquiry", inquirySchema);
