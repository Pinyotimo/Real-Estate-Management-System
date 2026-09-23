export const LISTING_TYPES = ["For Rent", "For Sale"];

export const PROPERTY_CATEGORIES = {
  Residential: [
    "Residential House",
    "Bungalow",
    "Apartment",
    "Penthouse",
    "Maisonette",
    "Villa",
    "Studio",
    "Bedsitter",
    "Townhouse",
  ],
  Commercial: [
    "Business Space / Office",
    "Shop / Commercial",
    "Warehouse",
    "Retail Space",
  ],
  Land: ["Land / Plot"],
  Other: ["Other"],
};

export const getHouseTypesForCategory = (category) =>
  PROPERTY_CATEGORIES[category] || [];

export const ALL_HOUSE_TYPES = Object.values(PROPERTY_CATEGORIES).flat();

export const getCategoryForHouseType = (houseType) => {
  for (const [category, types] of Object.entries(PROPERTY_CATEGORIES)) {
    if (types.includes(houseType)) return category;
  }
  return "Residential";
};