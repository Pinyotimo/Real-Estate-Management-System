import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
 // Adjust path to match your file structure

const PropertyCard = ({ property, onSave }) => {
  const {
    _id,
    title = "Untitled Property",
    price = 0,
    images = [],
    estate,
    county,
    location,
    houseType,
    bedrooms,
    bathrooms,
    status = "available",
  } = property || {};

  const imageUrl = images && images.length > 0 ? images[0] : null;
  const locationText =
    estate && county ? `${estate}, ${county}` : location || "Location N/A";

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      onSave(property);
    }
  };

  return (
    <Link to={`/properties/${_id}`} className="property-card-link">
      <article className="dashboard-card property-card">
        <div className="property-card-media">
          {imageUrl ? (
            <img src={imageUrl} alt={title} loading="lazy" />
          ) : (
            <span>No image available</span>
          )}
        </div>

        <div className="dashboard-stack">
          <div className="dashboard-space-between">
            <h3 className="dashboard-section-title">{title}</h3>
            <span
              className={`dashboard-pill ${
                status.toLowerCase() === "available"
                  ? "dashboard-pill--success"
                  : ""
              }`}
            >
              {status}
            </span>
          </div>

          <p className="dashboard-card-value">
            KES {Number(price || 0).toLocaleString()}
          </p>

          <p className="dashboard-subtitle">{locationText}</p>

          <div className="dashboard-inline-actions">
            {houseType && (
              <span className="dashboard-pill dashboard-pill--info">
                {houseType}
              </span>
            )}
            {bedrooms > 0 && (
              <span className="dashboard-pill">{bedrooms} Bed</span>
            )}
            {bathrooms > 0 && (
              <span className="dashboard-pill">{bathrooms} Bath</span>
            )}
          </div>

          <div className="dashboard-inline-actions">
            <span className="dashboard-btn dashboard-btn--outline">
              View Details
            </span>
            <button
              type="button"
              className="dashboard-btn dashboard-btn--ghost"
              onClick={handleSaveClick}
            >
              Save
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    images: PropTypes.arrayOf(PropTypes.string),
    estate: PropTypes.string,
    county: PropTypes.string,
    location: PropTypes.string,
    houseType: PropTypes.string,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    status: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func,
};

export default PropertyCard;