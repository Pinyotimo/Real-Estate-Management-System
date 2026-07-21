const Inquiry = require('../models/Inquiry');

const createInquiry = async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;
    const inquiry = await Inquiry.create({ propertyId, name, email, phone, message });
    res.status(201).json({ success: true, message: 'Inquiry sent successfully!', data: inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createInquiry };