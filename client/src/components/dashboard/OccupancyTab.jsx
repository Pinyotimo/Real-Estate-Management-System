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
      buyers/tenants.
    </p>

    <div className="dashboard-card-grid dashboard-card-grid--property">
      {properties.map((property) => (
        <div
          key={property._id}
          className="dashboard-card"
          style={{ justifyContent: "space-between" }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.5rem",
              }}
            >
              <h4 style={{ margin: 0 }}>{property.title}</h4>
              <span className="dashboard-pill dashboard-pill--info">
                {property.houseType || "Property"}
              </span>
            </div>

            <p className="dashboard-subtitle" style={{ margin: "0.2rem 0" }}>
              📍 {property.estate}, {property.county}
            </p>
            <p style={{ fontWeight: "bold", color: "#0284c7" }}>
              Rent: ${property.price}/mo
            </p>

            <div
              className={`dashboard-pill ${property.status === "occupied" ? "dashboard-pill--success" : "dashboard-pill--danger"}`}
              style={{ margin: "0.8rem 0" }}
            >
              <span>
                Status:{" "}
                <strong
                  style={{
                    color:
                      property.status === "occupied" ? "#16a34a" : "#dc2626",
                    textTransform: "uppercase",
                  }}
                >
                  {property.status}
                </strong>
              </span>
            </div>
          </div>

          <hr
            style={{
              border: "none",
              borderTop: "1px solid #e2e8f0",
              margin: "0.8rem 0",
            }}
          />

          {property.status === "occupied" ? (
            <div>
              <p
                style={{
                  margin: "0.2rem 0",
                  color: "#15803d",
                  fontWeight: "bold",
                }}
              >
                👤 Tenant: {property.tenantName || "Assigned Resident"}
              </p>
              {property.tenantPhone && (
                <p
                  style={{
                    margin: "0.2rem 0",
                    fontSize: "0.85rem",
                    color: "#475569",
                  }}
                >
                  📞 {property.tenantPhone}
                </p>
              )}
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}
              >
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
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <select
                  value={selectedTenantMap[property._id] || ""}
                  onChange={(event) =>
                    onSelectTenant(property._id, event.target.value)
                  }
                  className="dashboard-input"
                  style={{ flex: 1 }}
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
