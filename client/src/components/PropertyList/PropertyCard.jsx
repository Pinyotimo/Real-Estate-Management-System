import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const PropertyCard = ({ property }) => {
  const {
    _id,
    title,
    price,
    images,
    estate,
    county,
    location,
    houseType,
    bedrooms,
    bathrooms,
    description,
  } = property;

  const imageUrl = images && images.length > 0 ? images[0] : null;
  const locationText =
    estate && county ? `${estate}, ${county}` : location || "Location N/A";

  return (
    <Link to={`/properties/${_id}`} className="property-card-link">
      <article className="dashboard-card property-card">
        <div className="property-card-media">
          {imageUrl ? <img src={imageUrl} alt={title} /> : <span>No image available</span>}
        </div>

        <div className="dashboard-stack">
          <div className="dashboard-space-between">
            <h3 className="dashboard-section-title">{title}</h3>
            <span className="dashboard-pill dashboard-pill--success">
              {property.status || "available"}
            </span>
          </div>
          <p className="dashboard-card-value">KES {Number(price).toLocaleString()}</p>
          <p className="dashboard-subtitle">
            {locationText}
          </p>

          <div className="dashboard-inline-actions">
            {houseType && (
              <span className="dashboard-pill dashboard-pill--info">{houseType}</span>
            )}
            {bedrooms > 0 && (
              <span className="dashboard-pill">{bedrooms} Bed</span>
            )}
            {bathrooms > 0 && (
              <span className="dashboard-pill">{bathrooms} Bath</span>
            )}
          </div>

          
          <div className="dashboard-inline-actions">
            <span className="dashboard-btn dashboard-btn--outline">View Details</span>
            <span className="dashboard-btn dashboard-btn--ghost">Save</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
};

export default PropertyCard;
