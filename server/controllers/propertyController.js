const Property = require("../models/Property");

const normalizeHouseType = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  const aliases = {
    apartment: "Apartment",
    residential: "Residential House",
    house: "Residential House",
    residentialhouse: "Residential House",
    villa: "Residential House",
    mansion: "Residential House",
    bungalow: "Residential House",
    bedsitter: "Apartment",
    single: "Apartment",
    maisonette: "Residential House",
    warehouse: "Warehouse",
    businessspace: "Business Space / Office",
    office: "Business Space / Office",
    business: "Business Space / Office",
    commercial: "Shop / Commercial",
    shop: "Shop / Commercial",
    shopcommercial: "Shop / Commercial",
  };

  return aliases[normalized] || value;
};

// @desc    Get all property listings with search & filters
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const { keyword, houseType, county, minPrice, maxPrice, bedrooms } =
      req.query;

    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { estate: { $regex: keyword, $options: "i" } },
        { county: { $regex: keyword, $options: "i" } },
      ];
    }

    if (houseType && houseType !== "all") {
      query.houseType = normalizeHouseType(houseType);
    }

    if (county) {
      query.county = { $regex: county, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bedrooms && bedrooms !== "all") {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }
    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a property listing
// @route   POST /api/properties
// @access  Private (Agent/Admin only)
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      estate,
      county,
      houseType,
      bedrooms,
      bathrooms,
      squareMeters,
      condition,
      mapLocation,
    } = req.body;
    const normalizedHouseType = normalizeHouseType(houseType);

    const property = new Property({
      title,
      description,
      price,
      estate,
      county,
      houseType: normalizedHouseType,
      bedrooms,
      bathrooms,
      squareMeters: Number(squareMeters) || 0,
      condition: condition || "Excellent",
      mapLocation: mapLocation || "",
      user: req.user._id,
    });

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.mimetype.startsWith("video/")) {
          property.video = file.path;
        } else {
          property.images.push(file.path);
        }
      });
    }

    const savedProperty = await property.save();
    res.status(201).json({ success: true, data: savedProperty });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner Agent / Admin only)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    if (
      property.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this property listing",
      });
    }

    await property.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  deleteProperty,
};
