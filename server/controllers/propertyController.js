const mongoose = require("mongoose");
const Property = require("../models/Property");
const User = require("../models/User");
const createAuditLog = require("../utils/auditLogger");

// Helper to safely escape special characters in search keywords
const escapeRegex = (text) => {
  return text ? text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") : "";
};

const normalizeHouseType = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  const aliases = {
    apartment: "Apartment",
    residential: "Residential House",
    house: "Residential House",
    residentialhouse: "Residential House",
    villa: "Villa",
    mansion: "Villa",
    bungalow: "Bungalow",
    penthouse: "Penthouse",
    maisonette: "Maisonette",
    studio: "Studio",
    bedsitter: "Bedsitter",
    single: "Bedsitter",
    townhouse: "Townhouse",
    warehouse: "Warehouse",
    businessspace: "Business Space / Office",
    office: "Business Space / Office",
    business: "Business Space / Office",
    commercial: "Shop / Commercial",
    shop: "Shop / Commercial",
    shopcommercial: "Shop / Commercial",
    retail: "Retail Space",
    retailspace: "Retail Space",
    land: "Land / Plot",
    plot: "Land / Plot",
    landplot: "Land / Plot",
    other: "Other",
  };

  return aliases[normalized] || value;
};

const parseAmenities = (value) => {
  if (Array.isArray(value)) return value.map((a) => String(a).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split(",").map((a) => a.trim()).filter(Boolean);
  }
  return [];
};

// @desc    Get all property listings with search & filters
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const {
      keyword,
      houseType,
      propertyCategory,
      listingType,
      county,
      estate,
      minPrice,
      maxPrice,
      bedrooms,
    } = req.query;

    let query = {};

    if (keyword) {
      const safeKeyword = escapeRegex(keyword);
      query.$or = [
        { title: { $regex: safeKeyword, $options: "i" } },
        { description: { $regex: safeKeyword, $options: "i" } },
        { estate: { $regex: safeKeyword, $options: "i" } },
        { county: { $regex: safeKeyword, $options: "i" } },
      ];
    }

    if (houseType && houseType !== "all") {
      query.houseType = normalizeHouseType(houseType);
    }

    if (propertyCategory && propertyCategory !== "all") {
      query.propertyCategory = propertyCategory;
    }

    if (listingType && listingType !== "all") {
      query.listingType = listingType;
    }

    if (county) {
      query.county = { $regex: escapeRegex(county), $options: "i" };
    }

    if (estate) {
      query.estate = { $regex: escapeRegex(estate), $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (bedrooms && bedrooms !== "all") {
      query.bedrooms = { $gte: Number(bedrooms) };
    }

    const properties = await Property.find(query)
      .populate("user", "name username email phone profilePicture role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const property = await Property.findById(id).populate(
      "user",
      "name username email phone profilePicture role"
    );

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    console.error("❌ Error fetching property by ID:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a property listing
// @route   POST /api/properties
// @access  Private (Agent/Admin only)
const createProperty = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const {
      title,
      description,
      price,
      estate,
      county,
      listingType,
      propertyCategory,
      houseType,
      amenities,
      bedrooms,
      bathrooms,
      squareMeters,
      condition,
      mapLocation,
    } = req.body;

    const normalizedHouseType = normalizeHouseType(houseType);

    // Inside createProperty controller function:

const property = new Property({
  title,
  description,
  price: Number(price) || 0,
  estate,
  county,
  listingType: listingType || "For Rent",
  propertyCategory: propertyCategory || "Residential",
  houseType: normalizedHouseType,
  amenities: parseAmenities(amenities),
  bedrooms: Number(bedrooms) || 0,
  bathrooms: Number(bathrooms) || 0,
  squareMeters: Number(squareMeters) || 0,
  condition: condition || "Excellent",
  mapLocation: mapLocation || "",
  user: req.user._id,
  images: [],
});

// Ensure images array is initialized before pushing
if (!Array.isArray(property.images)) {
  property.images = [];
}

if (req.files && req.files.length > 0) {
  req.files.forEach((file) => {
    if (file.mimetype && file.mimetype.startsWith("video/")) {
      property.video = file.path;
    } else {
      property.images.push(file.path); // Now safely pushes to array
    }
  });
}

    const savedProperty = await property.save();

    await createAuditLog(req, {
      action: `Created new property: ${savedProperty.title || savedProperty._id}`,
      module: "PROPERTIES",
      status: "success",
      details: { propertyId: savedProperty._id, price: savedProperty.price },
    });

    res.status(201).json({ success: true, data: savedProperty });
  } catch (error) {
    console.error("❌ Error creating property:", error);

    await createAuditLog(req, {
      action: `Failed to create property: ${error.message}`,
      module: "PROPERTIES",
      status: "failed",
    });

    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a property listing
// @route   PUT /api/properties/:id
// @access  Private (Owner Agent / Admin only)
const updateProperty = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    if (
      property.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      await createAuditLog(req, {
        action: `Unauthorized property update attempt on [${id}]`,
        module: "PROPERTIES",
        status: "warning",
      });

      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this property listing",
      });
    }

    const {
      title,
      description,
      price,
      estate,
      county,
      listingType,
      propertyCategory,
      houseType,
      amenities,
      bedrooms,
      bathrooms,
      squareMeters,
      condition,
      mapLocation,
      status,
      existingMedia,
    } = req.body;

    if (title !== undefined) property.title = title;
    if (description !== undefined) property.description = description;
    if (price !== undefined) property.price = Number(price) || 0;
    if (estate !== undefined) property.estate = estate;
    if (county !== undefined) property.county = county;
    if (listingType !== undefined) property.listingType = listingType;
    if (propertyCategory !== undefined) property.propertyCategory = propertyCategory;
    if (houseType !== undefined) property.houseType = normalizeHouseType(houseType);
    if (amenities !== undefined) property.amenities = parseAmenities(amenities);
    if (bedrooms !== undefined) property.bedrooms = Number(bedrooms) || 0;
    if (bathrooms !== undefined) property.bathrooms = Number(bathrooms) || 0;
    if (squareMeters !== undefined) property.squareMeters = Number(squareMeters) || 0;
    if (condition !== undefined) property.condition = condition;
    if (mapLocation !== undefined) property.mapLocation = mapLocation;
    if (status !== undefined) property.status = status;

    if (existingMedia !== undefined) {
      try {
        const parsedMedia = typeof existingMedia === "string" ? JSON.parse(existingMedia) : existingMedia;
        if (Array.isArray(parsedMedia)) {
          property.images = parsedMedia;
        }
      } catch (err) {
        console.error("Failed to parse existingMedia JSON:", err);
      }
    }

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.mimetype.startsWith("video/")) {
          property.video = file.path;
        } else {
          property.images.push(file.path);
        }
      });
    }

    const updatedProperty = await property.save();

    await createAuditLog(req, {
      action: `Updated property listing: ${updatedProperty.title || id}`,
      module: "PROPERTIES",
      status: "success",
      details: { propertyId: id },
    });

    res.status(200).json({ success: true, data: updatedProperty });
  } catch (error) {
    console.error("❌ Error updating property:", error);

    await createAuditLog(req, {
      action: `Failed to update property: ${error.message}`,
      module: "PROPERTIES",
      status: "failed",
    });

    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner Agent / Admin only)
const deleteProperty = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    const property = await Property.findById(id);

    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    if (
      property.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      await createAuditLog(req, {
        action: `Unauthorized property deletion attempt on [${id}]`,
        module: "PROPERTIES",
        status: "warning",
      });

      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this property listing",
      });
    }

    const title = property.title;
    await property.deleteOne();

    await createAuditLog(req, {
      action: `Deleted property listing: ${title || id}`,
      module: "PROPERTIES",
      status: "success",
      details: { propertyId: id },
    });

    res
      .status(200)
      .json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting property:", error);

    await createAuditLog(req, {
      action: `Failed to delete property: ${error.message}`,
      module: "PROPERTIES",
      status: "failed",
    });

    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};