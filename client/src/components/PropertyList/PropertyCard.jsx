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
    <Link to={`/properties/${_id}`} className="dashboard-link" style={{ textDecoration: "none" }}>
      <div className="dashboard-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
              borderRadius: "var(--radius) var(--radius) 0 0",
            }}
          />
        ) : (
          <div
            style={{
              height: "200px",
              background: "var(--surface-muted)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-muted)",
              borderRadius: "var(--radius) var(--radius) 0 0",
            }}
          >
            No Image Available
          </div>
        )}

        <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 className="dashboard-title" style={{ fontSize: "1.1rem", margin: "0 0 0.5rem" }}>
            {title}
          </h3>
          <p className="dashboard-card-value" style={{ fontSize: "1.2rem", color: "var(--success)" }}>
            ${Number(price).toLocaleString()}
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: "0 0 0.5rem" }}>
            📍 {locationText}
          </p>

          <div className="dashboard-inline-actions" style={{ flexWrap: "wrap", marginBottom: "0.75rem" }}>
            {houseType && (
              <span className="dashboard-pill dashboard-pill--info">{houseType}</span>
            )}
            {bedrooms > 0 && (
              <span className="dashboard-pill" style={{ background: "var(--surface-muted)", color: "var(--text-subtle)" }}>
                🛏️ {bedrooms} Bed
              </span>
            )}
            {bathrooms > 0 && (
              <span className="dashboard-pill" style={{ background: "var(--surface-muted)", color: "var(--text-subtle)" }}>
                🚿 {bathrooms} Bath
              </span>
            )}
          </div>

          <p
            style={{
              color: "var(--text-subtle)",
              fontSize: "0.9rem",
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
};

export default PropertyCard;