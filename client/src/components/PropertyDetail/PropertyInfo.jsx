import PropTypes from "prop-types";

const PropertyInfo = ({ property }) => {
  const {
    title,
    price,
    estate,
    county,
    houseType,
    bedrooms,
    bathrooms,
    condition,
    squareMeters,
    description,
    mapLocation,
  } = property;

  return (
    <div className="dashboard-stack">
      <h1 className="dashboard-title">{title}</h1>
      <p className="dashboard-card-value" style={{ color: "var(--success)", fontSize: "1.5rem" }}>
        ${Number(price).toLocaleString()}
      </p>
      <p className="dashboard-subtitle">📍 {estate}, {county} County</p>

      {/* Features grid */}
      <div className="dashboard-form-grid" style={{ background: "var(--surface-soft)", padding: "1rem", borderRadius: "var(--radius)" }}>
        <div>
          <strong>Type</strong><br />
          {houseType}
        </div>
        <div>
          <strong>Bedrooms</strong><br />
          {bedrooms}
        </div>
        <div>
          <strong>Bathrooms</strong><br />
          {bathrooms}
        </div>
        {condition && (
          <div>
            <strong>Condition</strong><br />
            {condition}
          </div>
        )}
        {squareMeters && (
          <div>
            <strong>Size</strong><br />
            {squareMeters} m²
          </div>
        )}
      </div>

      <div>
        <h3>Description</h3>
        <p style={{ lineHeight: 1.6, color: "var(--text-subtle)" }}>{description}</p>
      </div>

      {mapLocation && (
        <div>
          <a href={mapLocation} target="_blank" rel="noreferrer" className="dashboard-link">
            🗺️ View on Google Maps ↗
          </a>
        </div>
      )}
    </div>
  );
};

PropertyInfo.propTypes = {
  property: PropTypes.object.isRequired,
};

export default PropertyInfo;