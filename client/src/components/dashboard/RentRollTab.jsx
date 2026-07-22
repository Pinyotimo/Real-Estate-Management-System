const RentRollTab = ({ properties, onUpdateTenant }) => {
  const occupiedProperties = properties.filter(
    (property) => property.status === "occupied",
  );

  return (
    <>
      <style>{`
        .rent-roll-row {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.25rem;
          margin-bottom: 1rem;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s ease;
        }
        .rent-roll-row:hover {
          box-shadow: var(--shadow-md);
        }
        .rent-roll-row::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
          background: var(--rent-status-color);
          border-radius: var(--radius) 0 0 var(--radius);
        }
        .rent-roll-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-light);
        }
        .rent-roll-meta {
          margin: 0;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .rent-roll-fields {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          align-items: end;
        }
        .rent-roll-actions {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }
      `}</style>

      <div>
        <h3 className="dashboard-section-title">
          Tenant Rent Roll & Outstanding Balances
        </h3>
        {occupiedProperties.length === 0 ? (
          <p className="dashboard-subtitle">
            No occupied properties recorded yet.
          </p>
        ) : (
          occupiedProperties.map((property) => {
            const hasArrears = Number(property.rentArrears) > 0;
            return (
              <form
                key={property._id}
                onSubmit={(event) => onUpdateTenant(event, property._id)}
                className="rent-roll-row"
                style={{
                  "--rent-status-color": hasArrears
                    ? "var(--danger)"
                    : "var(--success)",
                }}
              >
                <div className="rent-roll-header">
                  <div>
                    <strong>{property.title}</strong>
                    <p className="rent-roll-meta">
                      Category: {property.houseType} | Required Rent: Ksh
                      {property.price}
                    </p>
                  </div>
                  <span
                    className={`dashboard-pill ${
                      hasArrears
                        ? "dashboard-pill--danger"
                        : "dashboard-pill--success"
                    }`}
                  >
                    {hasArrears ? "Arrears Pending" : "Fully Paid"}
                  </span>
                </div>

                <div className="rent-roll-fields">
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
                    <label className="dashboard-label">Rent Paid (Ksh)</label>
                    <input
                      type="number"
                      name="rentPaid"
                      defaultValue={property.rentPaid}
                      className="dashboard-input"
                    />
                  </div>
                  <div>
                    <label className="dashboard-label">
                      Rent Arrears (Ksh)
                    </label>
                    <input
                      type="number"
                      name="rentArrears"
                      defaultValue={property.rentArrears}
                      className="dashboard-input"
                    />
                  </div>
                </div>

                <div className="rent-roll-actions">
                  <button type="submit" className="dashboard-btn">
                    Save Rent Roll
                  </button>
                </div>
              </form>
            );
          })
        )}
      </div>
    </>
  );
};

export default RentRollTab;
