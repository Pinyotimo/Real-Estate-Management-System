const OccupancyTab = ({
  properties,
  registeredTenants,
  selectedTenantMap,
  onAssignTenant,
  onUnassignTenant,
  onSelectTenant,
}) => (
  <div>
    <h3 className="dashboard-section-title">
      Property Occupancy & Tenant Assignment
    </h3>
    <p className="dashboard-subtitle">
      Assign houses, warehouses, or commercial business spaces to registered
      tenants.
    </p>

    <div className="dashboard-card-grid dashboard-card-grid--property">
      {properties.map((property) => (
        <div
          key={property._id}
          className="dashboard-card"
        >
          <div>
            <div className="dashboard-space-between">
              <h4 className="dashboard-section-title">{property.title}</h4>
              <span className="dashboard-pill dashboard-pill--info">
                {property.houseType || "Property"}
              </span>
            </div>

            <p className="dashboard-subtitle">{property.estate}, {property.county}</p>
            <p className="dashboard-card-value">
              Rent: KES {property.price}/mo
            </p>

            <div
              className={`dashboard-pill ${property.status === "occupied" ? "dashboard-pill--success" : "dashboard-pill--danger"}`}
            >
              <span>Status: {property.status}</span>
            </div>
          </div>

          {property.status === "occupied" ? (
            <div>
              <p className="dashboard-subtitle">
                Tenant: {property.tenantName || "Assigned Resident"}
              </p>
              {property.tenantPhone && (
                <p className="dashboard-subtitle">
                  {property.tenantPhone}
                </p>
              )}
              <div className="dashboard-inline-actions">
                <button
                  onClick={() => onUnassignTenant(property._id)}
                  className="dashboard-btn dashboard-btn--danger"
                >
                  Vacate Unit
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="dashboard-label">
                Assign Registered Tenant:
              </label>
              <div className="dashboard-inline-actions">
                <select
                  value={selectedTenantMap[property._id] || ""}
                  onChange={(event) =>
                    onSelectTenant(property._id, event.target.value)
                  }
                  className="dashboard-input"
                >
                  <option value="">-- Select Registered Tenant --</option>
                  {registeredTenants.map((tenant) => (
                    <option key={tenant._id} value={tenant._id}>
                      {tenant.name} ({tenant.email})
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => onAssignTenant(property._id)}
                  className="dashboard-btn dashboard-btn--success"
                >
                  Assign
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default OccupancyTab;
