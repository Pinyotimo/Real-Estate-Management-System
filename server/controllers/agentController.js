const Property = require('../models/Property');
const Expense = require('../models/Expense');
const Inquiry = require('../models/Inquiry');
const User = require('../models/User');

// @desc    Get List of Registered Tenants/Buyers
// @route   GET /api/agent/tenants
// @access  Private (Agent / Admin)
const getTenantsList = async (req, res) => {
  try {
    const tenants = await User.find({ role: 'tenant' }).select('-password');
    res.status(200).json({ success: true, data: tenants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign a Property/Warehouse/Business Space to a Tenant
// @route   PUT /api/agent/properties/:id/assign
// @access  Private (Agent / Admin)
const assignTenant = async (req, res) => {
  try {
    const { tenantUserId, rentArrears } = req.body;
    const property = await Property.findOne({ _id: req.params.id, user: req.user._id });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found or unauthorized' });
    }

    const tenant = await User.findById(tenantUserId);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant user not found' });
    }

    property.tenantUser = tenant._id;
    property.tenantName = tenant.name;
    property.tenantPhone = tenant.phone || tenant.email;
    property.status = 'occupied';
    if (rentArrears !== undefined) property.rentArrears = Number(rentArrears);

    await property.save();
    res.status(200).json({ success: true, message: `Property assigned to ${tenant.name}`, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unassign / Vacate Tenant
// @route   PUT /api/agent/properties/:id/unassign
// @access  Private (Agent / Admin)
const unassignTenant = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, user: req.user._id });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found or unauthorized' });
    }

    property.tenantUser = null;
    property.tenantName = '';
    property.tenantPhone = '';
    property.status = 'vacant';
    property.rentPaid = 0;
    property.rentArrears = 0;

    await property.save();
    res.status(200).json({ success: true, message: 'Property marked as vacant', data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Existing Agent Overview Logic
const getAgentOverview = async (req, res) => {
  try {
    const agentId = req.user._id;
    const properties = await Property.find({ user: agentId }).sort({ createdAt: -1 });
    const expenses = await Expense.find({ user: agentId }).sort({ createdAt: -1 });
    const inquiries = await Inquiry.find({ propertyId: { $in: properties.map((p) => p._id) } }).sort({ createdAt: -1 });

    const totalIncome = properties.reduce((acc, p) => acc + (p.status === 'occupied' ? p.rentPaid : 0), 0);
    const totalArrears = properties.reduce((acc, p) => acc + (p.status === 'occupied' ? p.rentArrears : 0), 0);
    const totalExpenses = expenses.filter((e) => !e.isLiability).reduce((acc, e) => acc + e.amount, 0);
    const totalLiabilities = expenses.filter((e) => e.isLiability).reduce((acc, e) => acc + e.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        financials: { totalIncome, totalArrears, totalExpenses, totalLiabilities, netProfit: totalIncome - totalExpenses },
        properties,
        expenses,
        inquiries,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOperations = async (req, res) => {
  try {
    const { electricityMeter, wifiStatus, repairStatus, repairNotes } = req.body;
    const property = await Property.findOne({ _id: req.params.id, user: req.user._id });

    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    if (electricityMeter !== undefined) property.electricityMeter = electricityMeter;
    if (wifiStatus) property.wifiStatus = wifiStatus;
    if (repairStatus) property.repairStatus = repairStatus;
    if (repairNotes !== undefined) property.repairNotes = repairNotes;

    await property.save();
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addExpense = async (req, res) => {
  try {
    const { title, category, amount, isLiability, propertyId } = req.body;
    const expense = await Expense.create({
      user: req.user._id,
      property: propertyId || null,
      title,
      category,
      amount,
      isLiability: isLiability || false,
    });
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAgentOverview,
  getTenantsList,
  assignTenant,
  unassignTenant,
  updateOperations,
  addExpense,
};