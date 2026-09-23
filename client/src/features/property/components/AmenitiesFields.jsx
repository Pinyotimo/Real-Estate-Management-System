import React from "react";
import PropTypes from "prop-types";
import { CheckSquare, X } from "lucide-react";
import SectionIcon from "./SectionIcon";

const COMMON_AMENITIES = [
  "Pool",
  "Gym",
  "Parking",
  "Security",
  "Backup Generator",
  "Garden",
  "Balcony",
  "Air Conditioning",
  "Water Tank",
  "Solar Panels",
  "CCTV",
  "Intercom",
  "Elevator",
  "Laundry",
  "Kitchen Appliances",
  "WiFi",
];

const AmenitiesFields = ({ formData = {}, onChange, idPrefix = "amenity" }) => {
  const rawAmenities = formData?.amenities;
  const selectedAmenities = Array.isArray(rawAmenities)
    ? rawAmenities.map((a) => String(a).trim()).filter(Boolean)
    : typeof rawAmenities === "string"
    ? rawAmenities.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  const updateAmenities = (updatedList) => {
    onChange?.({
      target: {
        name: "amenities",
        value: updatedList.join(", "),
      },
    });
  };

  const handleAmenityToggle = (amenity) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];

    updateAmenities(updated);
  };

  const handleRemoveAmenity = (amenity) => {
    const updated = selectedAmenities.filter((a) => a !== amenity);
    updateAmenities(updated);
  };

  return (
    <fieldset className="add-property-section add-property-section--cyan border-0 p-0 m-0">
      <legend
        className="add-property-section-heading"
        style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
      >
        <SectionIcon>
          <CheckSquare className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
        </SectionIcon>
        Amenities
      </legend>

      <div>
        <span
          className="dashboard-label"
          style={{ display: "block", marginBottom: "0.5rem" }}
        >
          Select Available Amenities
        </span>

        {/* Amenities Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {COMMON_AMENITIES.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            const inputId = `${idPrefix}-${amenity.toLowerCase().replace(/\s+/g, "-")}`;

            return (
              <label
                key={amenity}
                htmlFor={inputId}
                className="hover:bg-[var(--bg-muted)]"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  padding: "0.5rem",
                  borderRadius: "var(--radius-sm)",
                  transition: "background-color 0.2s",
                }}
              >
                <input
                  id={inputId}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleAmenityToggle(amenity)}
                  style={{
                    width: "16px",
                    height: "16px",
                    cursor: "pointer",
                    accentColor: "var(--primary)",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-primary)",
                    userSelect: "none",
                  }}
                >
                  {amenity}
                </span>
              </label>
            );
          })}
        </div>

        {/* Selected Amenities Pills Badge Bar */}
        {selectedAmenities.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <span
              className="dashboard-subtitle"
              style={{ marginBottom: "0.5rem", display: "block" }}
            >
              Selected ({selectedAmenities.length})
            </span>
            <div
              className="dashboard-inline-actions"
              style={{ gap: "0.4rem", flexWrap: "wrap" }}
            >
              {selectedAmenities.map((amenity) => (
                <span
                  key={amenity}
                  className="dashboard-pill"
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    paddingRight: "0.4rem",
                  }}
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => handleRemoveAmenity(amenity)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      color: "inherit",
                      opacity: 0.7,
                    }}
                    aria-label={`Remove ${amenity}`}
                    title={`Remove ${amenity}`}
                  >
                    <X className="w-3 h-3 transition-opacity hover:opacity-100" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </fieldset>
  );
};

AmenitiesFields.propTypes = {
  formData: PropTypes.shape({
    amenities: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  }),
  onChange: PropTypes.func.isRequired,
  idPrefix: PropTypes.string,
};

export default AmenitiesFields;