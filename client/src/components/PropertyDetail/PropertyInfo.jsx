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

  const features = [
    { icon: "🏠", label: "Type", value: houseType },
    { icon: "🛏️", label: "Bedrooms", value: bedrooms },
    { icon: "🛁", label: "Bathrooms", value: bathrooms },
    condition && { icon: "✨", label: "Condition", value: condition },
    squareMeters && { icon: "📐", label: "Size", value: `${squareMeters} m²` },
  ].filter(Boolean);

  return (
    <>
      <style>{`
        .property-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          background: var(--surface-soft);
          padding: 1rem;
          border-radius: var(--radius);
          border: 1px solid var(--border);
        }
        .property-feature {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .property-feature-label {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .property-feature-value {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }
        .property-map-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          background: var(--primary-soft);
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .property-map-link:hover {
          background: var(--border-light);
          text-decoration: none;
        }
        .property-description {
          line-height: 1.6;
          color: var(--text-subtle);
        }
      `}</style>

      <div className="dashboard-stack">
        <h1 className="dashboard-title">{title}</h1>
        <p
          className="dashboard-card-value"
          style={{ color: "var(--success)", fontSize: "1.5rem" }}
        >
          Ksh {Number(price).toLocaleString()}
        </p>
        <p className="dashboard-subtitle">
          📍 {estate}, {county} County
        </p>

        <div className="property-features-grid">
          {features.map((feature) => (
            <div key={feature.label} className="property-feature">
              <span className="property-feature-label">
                {feature.icon} {feature.label}
              </span>
              <span className="property-feature-value">{feature.value}</span>
            </div>
          ))}
        </div>

        <div>
          <h3>Description</h3>
          <p className="property-description">{description}</p>
        </div>

        {mapLocation && (
          <div>
            <a
              href={mapLocation}
              target="_blank"
              rel="noreferrer"
              className="property-map-link"
            >
              🗺️ View on Google Maps ↗
            </a>
          </div>
        )}
      </div>
    </>
  );
};

PropertyInfo.propTypes = {
  property: PropTypes.shape({
    title: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    estate: PropTypes.string,
    county: PropTypes.string,
    houseType: PropTypes.string,
    bedrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    bathrooms: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    condition: PropTypes.string,
    squareMeters: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.string,
    mapLocation: PropTypes.string,
  }).isRequired,
};

export default PropertyInfo;
