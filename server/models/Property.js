const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Monthly Rent
    estate: { type: String, required: true },
    county: { type: String, required: true },
    houseType: {
      type: String,
      required: true,
      enum: ['Residential House', 'Warehouse', 'Business Space / Office', 'Apartment', 'Shop / Commercial'],
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    images: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Landlord / Agent

    // Occupancy & Tenant Linkage
    status: { type: String, enum: ['vacant', 'occupied'], default: 'vacant' },
    tenantUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    tenantName: { type: String, default: '' },
    tenantPhone: { type: String, default: '' },

    // Financial Balances
    rentPaid: { type: Number, default: 0 },
    rentArrears: { type: Number, default: 0 },

    // Utility & Operations Tracking
    electricityMeter: { type: String, default: 'N/A' },
    wifiStatus: { type: String, enum: ['active', 'disconnected', 'pending'], default: 'active' },
    repairStatus: { type: String, enum: ['none', 'pending', 'in_progress', 'completed'], default: 'none' },
    repairNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);