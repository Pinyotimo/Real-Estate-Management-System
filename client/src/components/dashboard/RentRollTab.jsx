const RentRollTab = ({ properties, onUpdateTenant }) => {
  const occupiedProperties = properties.filter(
    (property) => property.status === "occupied",
  );

  return (
    <div>
      <h3 className="dashboard-section-title">
        Tenant Rent Roll & Outstanding Balances
      </h3>
      {occupiedProperties.length === 0 ? (
        <p className="dashboard-subtitle">
          No occupied properties recorded yet.
        </p>
      ) : (
        occupiedProperties.map((property) => (
          <form
            key={property._id}
            onSubmit={(event) => onUpdateTenant(event, property._id)}
            className="dashboard-panel dashboard-form-grid"
            style={{ marginBottom: "1rem" }}
          >
            <div>
              <strong>{property.title}</strong>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>
                Category: {property.houseType} | Required Rent: $
                {property.price}
              </p>
            </div>
            <div>
              <label className="dashboard-label">Tenant Name</label>
              <input
                type="text"
                name="tenantName"
                defaultValue={property.tenantName}
                className="dashboard-input"
              />
            </div>
            <div>
              <label className="dashboard-label">Tenant Phone</label>
              <input
                type="text"
                name="tenantPhone"
                defaultValue={property.tenantPhone}
                className="dashboard-input"
              />
            </div>
            <div>
              <label className="dashboard-label">Rent Paid ($)</label>
              <input
                type="number"
                name="rentPaid"
                defaultValue={property.rentPaid}
                className="dashboard-input"
              />
            </div>
            <div>
              <label className="dashboard-label">Rent Arrears ($)</label>
              <input
                type="number"
                name="rentArrears"
                defaultValue={property.rentArrears}
                className="dashboard-input"
              />
            </div>
            <button
              type="submit"
              className="dashboard-btn dashboard-btn--primary"
            >
              Save Rent Roll
            </button>
          </form>
        ))
      )}
    </div>
  );
};

export default RentRollTab;
