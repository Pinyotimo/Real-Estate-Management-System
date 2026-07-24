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
      <section className="dashboard-panel">
        <div className="dashboard-space-between">
          <div>
            <h1 className="dashboard-title">{title}</h1>
            <p className="dashboard-subtitle">{estate}, {county} County</p>
          </div>
          <span className="dashboard-card-value">${Number(price).toLocaleString()}</span>
        </div>
      </section>

      <section className="dashboard-panel">
        <h2 className="dashboard-section-title">Overview</h2>
        <div className="info-grid">
          <div className="info-cell">
            <strong>Type</strong>
            <span>{houseType}</span>
          </div>
          <div className="info-cell">
            <strong>Bedrooms</strong>
            <span>{bedrooms || 0}</span>
          </div>
          <div className="info-cell">
            <strong>Bathrooms</strong>
            <span>{bathrooms || 0}</span>
          </div>
          {condition && (
            <div className="info-cell">
              <strong>Condition</strong>
              <span>{condition}</span>
            </div>
          )}
          {squareMeters && (
            <div className="info-cell">
              <strong>Size</strong>
              <span>{squareMeters} m²</span>
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-panel">
        <h2 className="dashboard-section-title">Description</h2>
        <p className="dashboard-subtitle">{description}</p>
      </section>

      <section className="dashboard-panel">
        <h2 className="dashboard-section-title">Amenities</h2>
        <div className="dashboard-inline-actions">
          <span className="dashboard-pill">Managed listing</span>
          <span className="dashboard-pill">Tenant ready</span>
          <span className="dashboard-pill">Viewing available</span>
        </div>
      </section>

      <section className="dashboard-panel">
        <h2 className="dashboard-section-title">Map & Nearby Locations</h2>
        <div className="empty-state">
          <p>Map preview placeholder</p>
          {mapLocation && (
            <a href={mapLocation} target="_blank" rel="noreferrer" className="dashboard-link">
              Open Google Maps
            </a>
          )}
        </div>
      </section>

      <section className="dashboard-panel">
        <h2 className="dashboard-section-title">Documents</h2>
        <div className="empty-state">No property documents uploaded yet.</div>
      </section>
    </div>
  );
};

PropertyInfo.propTypes = {
  property: PropTypes.object.isRequired,
};

export default PropertyInfo;
