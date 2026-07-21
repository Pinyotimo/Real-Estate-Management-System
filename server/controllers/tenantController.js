const Property = require('../models/Property');
const Complaint = require('../models/Complaint');
const Payment = require('../models/Payment');

// @desc    Get assigned house/warehouse/business unit, complaints, and receipts
// @route   GET /api/tenant/overview
// @access  Private (Tenant/Buyer)
const getTenantOverview = async (req, res) => {
  try {
    const tenantId = req.user._id;

    // Search for property assigned specifically to this tenant's User ID
    const property = await Property.findOne({ tenantUser: tenantId });
    const complaints = await Complaint.find({ tenant: tenantId }).sort({ createdAt: -1 });
    const payments = await Payment.find({ tenant: tenantId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        property: property || null,
        complaints,
        payments,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process Rent or Utility Payment
// @route   POST /api/tenant/pay
// @access  Private (Tenant/Buyer)
const makePayment = async (req, res) => {
  try {
    const { propertyId, amount, paymentType, paymentMethod } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const transactionId = 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const payment = await Payment.create({
      tenant: req.user._id,
      property: propertyId,
      amount: Number(amount),
      paymentType,
      paymentMethod,
      transactionId,
    });

    // Deduct rent payment from arrears and credit rentPaid
    if (paymentType === 'rent') {
      property.rentPaid = (property.rentPaid || 0) + Number(amount);
      property.rentArrears = Math.max(0, (property.rentArrears || 0) - Number(amount));
      await property.save();
    }

    res.status(201).json({ success: true, message: 'Payment recorded successfully', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const submitComplaint = async (req, res) => {
  try {
    const { propertyId, title, category, description } = req.body;
    const complaint = await Complaint.create({
      tenant: req.user._id,
      property: propertyId,
      title,
      category,
      description,
    });

    res.status(201).json({ success: true, message: 'Complaint submitted', data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTenantOverview,
  makePayment,
  submitComplaint,
};