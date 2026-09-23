const crypto = require("crypto");
const TenantAssignment = require("../models/tenantAssignment");
const Payment = require("../models/Payment");
const Complaint = require("../models/Complaint");

// @desc    Get all assigned properties and status for logged-in tenant
// @route   GET /api/tenant/overview
// @access  Private (Tenant)
const getTenantOverview = async (req, res) => {
  try {
    const tenantId = req.user._id;

    const assignments = await TenantAssignment.find({
      tenant: tenantId,
      status: {
        $in: ["active", "pending_documents", "pending_invite", "notice_given"],
      },
    })
      .populate("property")
      .lean();

    const properties = assignments
      .filter((asm) => asm.property)
      .map((asm) => ({
        ...asm.property,
        agreedRent: asm.agreedRent,
        rentArrears: asm.rentArrears || 0,
        rentPaid: asm.rentPaid || 0,
        assignmentId: asm._id,
        leaseStatus: asm.status,
      }));

    const complaints = await Complaint.find({ tenant: tenantId })
      .sort({ createdAt: -1 })
      .lean();

    const payments = await Payment.find({ tenant: tenantId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        properties,
        assignments,
        complaints,
        payments,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process rent or utility payment
// @route   POST /api/tenant/pay
// @access  Private (Tenant)
const makePayment = async (req, res) => {
  try {
    const { assignmentId, amount, paymentType, paymentMethod } = req.body;
    const tenantId = req.user._id;

    const assignment = await TenantAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Active lease assignment not found.",
      });
    }

    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid amount." });
    }

    const transactionId = `TXN-${Date.now().toString().slice(-6)}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

    const payment = await Payment.create({
      tenant: tenantId,
      property: assignment.property,
      assignment: assignment._id,
      amount: numericAmount,
      paymentType: paymentType || "rent",
      paymentMethod: paymentMethod || "mpesa",
      transactionId,
    });

    if (paymentType === "rent" || !paymentType) {
      assignment.rentPaid = (assignment.rentPaid || 0) + numericAmount;
      assignment.rentArrears = Math.max(
        0,
        (assignment.rentArrears || 0) - numericAmount,
      );
      await assignment.save();
    }

    return res
      .status(201)
      .json({ success: true, message: "Payment recorded", data: payment });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit maintenance complaint
// @route   POST /api/tenant/complaints
// @access  Private (Tenant)
const submitComplaint = async (req, res) => {
  try {
    const { propertyId, title, category, description } = req.body;

    const complaint = await Complaint.create({
      tenant: req.user._id,
      property: propertyId,
      title,
      category: category || "Maintenance",
      description,
    });

    return res
      .status(201)
      .json({ success: true, message: "Complaint submitted", data: complaint });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ⚠️ Explicitly export all three functions for CommonJS
module.exports = {
  getTenantOverview,
  makePayment,
  submitComplaint,
};
