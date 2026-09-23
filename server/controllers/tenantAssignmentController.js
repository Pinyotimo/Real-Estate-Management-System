const crypto = require("crypto");
const User = require("../models/User");
const TenantAssignment = require("../models/TenantAssignment");
const Property = require("../models/Property");

// @desc    Get all vacant/vacating-soon properties (for assignment dropdown)
// @route   GET /api/assignments/available-units
// @access  Private (Agent/Admin)
const getAvailableUnits = async (req, res) => {
  try {
    const properties = await Property.find({
      status: { $in: ["vacant", "vacating_soon"] },
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new tenant assignment (creates the tenant account if new)
// @route   POST /api/assignments
// @access  Private (Agent/Admin)
const createAssignment = async (req, res) => {
  try {
    const {
      propertyId,
      tenantId,
      tenantName,
      tenantEmail,
      tenantPhone,
      leaseStartDate,
      leaseEndDate,
      monthlyRent,
      securityDeposit,
      billingDay,
      paymentFrequency,
      notes,
    } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    if (!["vacant", "vacating_soon"].includes(property.status)) {
      return res.status(400).json({
        success: false,
        message: "This unit is not available for assignment",
      });
    }

    let tenant;
    let temporaryPassword = null;

    if (tenantId) {
      tenant = await User.findById(tenantId);
      if (!tenant) {
        return res.status(404).json({ success: false, message: "Tenant not found" });
      }
    } else {
      if (!tenantName || !tenantEmail) {
        return res.status(400).json({
          success: false,
          message: "Tenant name and email are required to create a new tenant account",
        });
      }

      const existing = await User.findOne({ email: tenantEmail });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "A user with this email already exists. Select them from the tenant list instead.",
        });
      }

      temporaryPassword = crypto.randomBytes(4).toString("hex");

      tenant = await User.create({
        name: tenantName,
        email: tenantEmail,
        phone: tenantPhone || "",
        password: temporaryPassword,
        role: "tenant",
      });
    }

    const assignment = await TenantAssignment.create({
      property: propertyId,
      tenant: tenant._id,
      agent: req.user._id,
      leaseStartDate,
      leaseEndDate,
      monthlyRent,
      securityDeposit,
      billingDay,
      paymentFrequency,
      notes,
    });

    property.status = "occupied";
    property.tenantUser = tenant._id;
    await property.save();

    res.status(201).json({
      success: true,
      data: assignment,
      newTenantCredentials: temporaryPassword
        ? { email: tenant.email, temporaryPassword }
        : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get assignments (scoped by role)
// @route   GET /api/assignments
// @access  Private
const getAssignments = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "tenant") {
      query.tenant = req.user._id;
    } else if (req.user.role === "agent") {
      query.agent = req.user._id;
    }

    const assignments = await TenantAssignment.find(query)
      .populate("property", "title estate county houseType price")
      .populate("tenant", "name email phone")
      .populate("agent", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: assignments.length, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await TenantAssignment.findById(req.params.id)
      .populate("property")
      .populate("tenant", "name email phone")
      .populate("agent", "name email phone");

    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    const isOwner =
      assignment.tenant._id.toString() === req.user._id.toString() ||
      assignment.agent._id.toString() === req.user._id.toString();

    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to view this assignment" });
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve a verified assignment — activates the lease and assigns the unit
// @route   PUT /api/assignments/:id/approve
// @access  Private (Agent/Admin)
const approveAssignment = async (req, res) => {
  try {
    const assignment = await TenantAssignment.findById(req.params.id).populate("tenant", "name phone");
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    if (assignment.status !== "documents_verified") {
      return res.status(400).json({
        success: false,
        message: "All documents must be verified before approval",
      });
    }

    assignment.status = "lease_active";
    assignment.assignedAt = new Date();
    await assignment.save();

    const property = await Property.findById(assignment.property);
    if (property) {
      property.status = "occupied";
      property.tenantUser = assignment.tenant._id;
      property.tenantName = assignment.tenant.name;
      property.tenantPhone = assignment.tenant.phone;
      property.rentPaid = 0;
      property.rentArrears = 0;
      await property.save();
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload one or more required documents to an assignment
// @route   POST /api/assignments/:id/documents
// @access  Private (Tenant/Agent/Admin)
const uploadDocuments = async (req, res) => {
  try {
    const assignment = await TenantAssignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    Object.entries(req.files).forEach(([fieldName, files]) => {
      files.forEach((file) => {
        assignment.documents.push({
          type: fieldName,
          url: file.path,
          fileName: file.originalname,
        });
      });
    });

    await assignment.save();
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark a specific document as verified
// @route   PUT /api/assignments/:id/documents/:docId/verify
// @access  Private (Agent/Admin)
const verifyDocument = async (req, res) => {
  try {
    const assignment = await TenantAssignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    const doc = assignment.documents.id(req.params.docId);
    if (!doc) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    doc.verified = true;

    const allVerified = assignment.documents.every((d) => d.verified);
    if (allVerified && assignment.status === "pending_documents") {
      assignment.status = "documents_verified";
    }

    await assignment.save();
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sign the lease (tenant or agent side)
// @route   PUT /api/assignments/:id/sign
// @access  Private (Tenant/Agent)
const signLease = async (req, res) => {
  try {
    const assignment = await TenantAssignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    const isTenant = assignment.tenant.toString() === req.user._id.toString();
    const isAgent = assignment.agent.toString() === req.user._id.toString();

    if (!isTenant && !isAgent && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to sign this lease" });
    }

    if (isTenant) assignment.tenantSignedAt = new Date();
    if (isAgent || req.user.role === "admin") assignment.agentSignedAt = new Date();

    if (assignment.status === "pending_documents" || assignment.status === "documents_verified") {
      assignment.status = "awaiting_signatures";
    }

    if (assignment.tenantSignedAt && assignment.agentSignedAt) {
      assignment.status = "lease_active";
    }

    await assignment.save();
    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload the final signed agreement file
// @route   POST /api/assignments/:id/signed-agreement
// @access  Private (Tenant/Agent/Admin)
const uploadSignedAgreement = async (req, res) => {
  try {
    const assignment = await TenantAssignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    assignment.signedAgreementUrl = req.file.path;
    await assignment.save();

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Terminate a lease
// @route   PUT /api/assignments/:id/terminate
// @access  Private (Agent/Admin)
const terminateAssignment = async (req, res) => {
  try {
    const { reason } = req.body;
    const assignment = await TenantAssignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    assignment.status = "terminated";
    assignment.terminatedAt = new Date();
    assignment.terminationReason = reason || "";
    await assignment.save();

    const property = await Property.findById(assignment.property);
    if (property) {
      property.status = "vacant";
      property.tenantUser = null;
      property.tenantName = "";
      property.tenantPhone = "";
      await property.save();
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Renew a lease — creates a new assignment linked to the old one
// @route   POST /api/assignments/:id/renew
// @access  Private (Agent/Admin)
const renewAssignment = async (req, res) => {
  try {
    const {
      leaseStartDate,
      leaseEndDate,
      monthlyRent,
      securityDeposit,
      billingDay,
      paymentFrequency,
      notes,
    } = req.body;

    const oldAssignment = await TenantAssignment.findById(req.params.id);
    if (!oldAssignment) {
      return res.status(404).json({ success: false, message: "Assignment not found" });
    }

    oldAssignment.status = "renewed";
    await oldAssignment.save();

    const newAssignment = await TenantAssignment.create({
      property: oldAssignment.property,
      tenant: oldAssignment.tenant,
      agent: req.user._id,
      leaseStartDate,
      leaseEndDate,
      monthlyRent: monthlyRent ?? oldAssignment.monthlyRent,
      securityDeposit: securityDeposit ?? oldAssignment.securityDeposit,
      billingDay: billingDay ?? oldAssignment.billingDay,
      paymentFrequency: paymentFrequency || oldAssignment.paymentFrequency,
      notes: notes || "",
      status: "lease_active",
      renewedFrom: oldAssignment._id,
    });

    res.status(201).json({ success: true, data: newAssignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAvailableUnits,
  createAssignment,
  getAssignments,
  getAssignmentById,
  approveAssignment,
  uploadDocuments,
  verifyDocument,
  signLease,
  uploadSignedAgreement,
  terminateAssignment,
  renewAssignment,
};