const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    estate: { type: String },
    county: { type: String },
    listingType: { type: String, default: "For Rent" },
    propertyCategory: { type: String, default: "Residential" },
    houseType: { type: String },
    amenities: [{ type: String }],
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    squareMeters: { type: Number, default: 0 },
    condition: { type: String, default: "Excellent" },
    mapLocation: { type: String },
    images: [{ type: String }], // MUST BE DEFINED HERE
    video: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);