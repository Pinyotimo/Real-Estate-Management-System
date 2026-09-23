// Real Kenyan administrative structure: 47 counties grouped under the
// 8 traditional regions (formally replaced by counties in 2010, but still
// commonly used for browsing/organizing UX like this).
export const KENYA_REGIONS = [
  {
    name: "Nairobi",
    counties: ["Nairobi"],
  },
  {
    name: "Central",
    counties: ["Kiambu", "Murang'a", "Nyeri", "Kirinyaga", "Nyandarua"],
  },
  {
    name: "Coast",
    counties: ["Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta"],
  },
  {
    name: "Eastern",
    counties: ["Machakos", "Kitui", "Makueni", "Embu", "Tharaka-Nithi", "Meru", "Isiolo", "Marsabit"],
  },
  {
    name: "North Eastern",
    counties: ["Garissa", "Wajir", "Mandera"],
  },
  {
    name: "Nyanza",
    counties: ["Kisumu", "Siaya", "Homa Bay", "Migori", "Kisii", "Nyamira"],
  },
  {
    name: "Rift Valley",
    counties: [
      "Nakuru", "Uasin Gishu", "Trans Nzoia", "Kericho", "Bomet", "Nandi",
      "Kajiado", "Narok", "Turkana", "West Pokot", "Samburu", "Baringo",
      "Laikipia", "Elgeyo-Marakwet",
    ],
  },
  {
    name: "Western",
    counties: ["Kakamega", "Bungoma", "Busia", "Vihiga"],
  },
];

// Estates/towns curated only for major counties — hand-authoring an
// accurate list for all 47 counties isn't practical. Every other county
// falls back to a free-text "Other" input in the UI.
export const COUNTY_ESTATES = {
  Nairobi: [
    "Kilimani", "Westlands", "Karen", "Lavington", "Kileleshwa", "Runda",
    "Langata", "South B", "South C", "Embakasi", "Dagoretti", "Kasarani",
    "Ngong Road", "Upper Hill", "CBD", "Parklands", "Ridgeways",
  ],
  Mombasa: ["Nyali", "Bamburi", "Kizingo", "Mtwapa", "Likoni", "Diani", "Old Town"],
  Kiambu: ["Thika", "Ruiru", "Kikuyu", "Limuru", "Kiambu Town", "Juja", "Githunguri"],
  Kisumu: ["Milimani", "Kondele", "Mamboleo", "Nyalenda", "Kisumu CBD"],
  Nakuru: ["Milimani (Nakuru)", "Section 58", "Free Area", "Lanet", "Naivasha"],
  "Uasin Gishu": ["Eldoret Town", "Kapsoya", "Langas", "Kimumu"],
};

export const getCountiesForRegion = (regionName) => {
  const region = KENYA_REGIONS.find((r) => r.name === regionName);
  return region ? region.counties : [];
};

export const getEstatesForCounty = (countyName) => {
  return COUNTY_ESTATES[countyName] || [];
};

export const getRegionForCounty = (countyName) => {
  const region = KENYA_REGIONS.find((r) => r.counties.includes(countyName));
  return region ? region.name : "";
};