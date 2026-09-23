const TenantAssignment = require("../models/Assignment");
const Property = require("../models/Property");
const User = require("../models/User");
const createAuditLog = require("../utils/auditLogger");

// @desc    Get all tenant assignment contracts
// @route   GET /api/assignments
// @access  Private (Agent/Admin)
const getAssignments = async (req, res) => {
  try {
    const query = {};

    // Filter by agent if non-admin agent requests their own list
    if (req.user && req.user.role === "agent") {
      query.assignedBy = req.user._id;
    }

    const assignments = await TenantAssignment.find(query)
      .populate("property")
      .populate("tenant", "name email phone role profilePicture")
      .populate("assignedBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all property units available for tenant assignment
// @route   GET /api/assignments/available-units
// @access  Private (Agent/Admin)
const getAvailableUnits = async (req, res) => {
  try {
    const availableUnits = await Property.find({
      status: { $ne: "occupied" },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: availableUnits.length,
      data: availableUnits,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign a unit to a tenant (Smart lookup or auto-invite)
// @route   POST /api/assignments
// @access  Private (Agent/Admin)
const createAssignment = async (req, res) => {
  try {
    const { propertyId, email, name, phone, agreedRent, securityDepositPaid } =
      req.body;
    const agentId = req.user._id;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property unit not found." });
    }

    if (property.status === "occupied") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Property unit is already occupied.",
        });
    }

    const normalizedEmail = email ? email.trim().toLowerCase() : "";

    // 1. Smart User Lookup (Prevents duplicate tenant accounts)
    let tenant = await User.findOne({ email: normalizedEmail });

    if (!tenant) {
      // Create lightweight invite account
      tenant = await User.create({
        name,
        email: normalizedEmail,
        phone,
        password: "TempPassword123!", // Forced password reset on first login
        role: "tenant",
        isInvitePending: true,
      });
    }

    // 2. Create the Lease Assignment Contract
    const assignment = await TenantAssignment.create({
      property: propertyId,
      tenant: tenant._id,
      assignedBy: agentId,
      agreedRent: Number(agreedRent || property.price),
      securityDepositPaid: Number(securityDepositPaid || 0),
      status: tenant.isInvitePending ? "pending_invite" : "pending_documents",
    });

    await createAuditLog(req, {
      action: `Assigned unit [${property.title || propertyId}] to tenant [${normalizedEmail}]`,
      module: "ASSIGNMENTS",
      status: "success",
      details: { assignmentId: assignment._id, propertyId },
    });

    return res.status(201).json({
      success: true,
      message: "Unit assigned successfully",
      data: assignment,
    });
  } catch (error) {
    await createAuditLog(req, {
      action: `Failed unit assignment: ${error.message}`,
      module: "ASSIGNMENTS",
      status: "failed",
    });

    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve documents and activate lease contract
// @route   PUT /api/assignments/:id/activate
// @access  Private (Agent/Admin)
const activateLease = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await TenantAssignment.findById(id);
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment contract not found." });
    }

    // Update lease contract state
    assignment.status = "active";
    assignment.startDate = new Date();
    await assignment.save();

    // Mark physical property unit as occupied
    await Property.findByIdAndUpdate(assignment.property, {
      status: "occupied",
    });

    await createAuditLog(req, {
      action: `Activated lease assignment [${id}]`,
      module: "ASSIGNMENTS",
      status: "success",
      details: { assignmentId: id },
    });

    return res.status(200).json({
      success: true,
      message: "Lease activated and property updated to occupied.",
      data: assignment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Terminate lease & vacate unit
// @route   PUT /api/assignments/:id/terminate
// @access  Private (Agent/Admin)
const terminateLease = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await TenantAssignment.findById(id);
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment contract not found." });
    }

    assignment.status = "terminated";
    assignment.moveOutDate = new Date();
    await assignment.save();

    // Release physical property back to available pool
    await Property.findByIdAndUpdate(assignment.property, {
      status: "available",
    });

    await createAuditLog(req, {
      action: `Terminated lease assignment [${id}]`,
      module: "ASSIGNMENTS",
      status: "success",
      details: { assignmentId: id },
    });

    return res.status(200).json({
      success: true,
      message: "Lease terminated and unit released.",
      data: assignment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAssignments,
  getAvailableUnits,
  createAssignment,
  activateLease,
  terminateLease,
};