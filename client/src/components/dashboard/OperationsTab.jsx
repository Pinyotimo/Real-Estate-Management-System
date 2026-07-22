const OperationsTab = ({ properties, onUpdateOperations }) => {
  const getStatusColor = (property) => {
    if (property.repairStatus === "pending") return "var(--danger)";
    if (property.repairStatus === "in_progress") return "var(--warning)";
    if (property.wifiStatus === "disconnected") return "var(--danger)";
    return "var(--success)";
  };

  return (
    <>
      <style>{`
        .ops-row {
          position: relative;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1.25rem;
          margin-bottom: 1rem;
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s ease;
        }
        .ops-row:hover {
          box-shadow: var(--shadow-md);
        }
        .ops-row::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 4px;
          background: var(--ops-status-color);
          border-radius: var(--radius) 0 0 var(--radius);
        }
        .ops-header {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-light);
        }
        .ops-fields {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          align-items: end;
        }
        .ops-actions {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }
        .ops-empty-state {
          text-align: center;
          padding: 2rem 1rem;
          color: var(--text-muted);
          background: var(--surface-soft);
          border: 1px dashed var(--border);
          border-radius: var(--radius);
        }
      `}</style>

      <div>
        <h3 className="dashboard-section-title">
          Manage Electricity, WiFi & Repairs
        </h3>

        {properties.length === 0 ? (
          <div className="ops-empty-state">No properties to manage yet.</div>
        ) : (
          properties.map((property) => (
            <form
              key={property._id}
              onSubmit={(event) => onUpdateOperations(event, property._id)}
              className="ops-row"
              style={{ "--ops-status-color": getStatusColor(property) }}
            >
              <div className="ops-header">
                <strong>{property.title}</strong>
              </div>

              <div className="ops-fields">
                <div>
                  <label className="dashboard-label">⚡ Electricity Meter No</label>
                  <input
                    type="text"
                    name="electricityMeter"
                    defaultValue={property.electricityMeter}
                    className="dashboard-input"
                  />
                </div>
                <div>
                  <label className="dashboard-label">📶 WiFi Status</label>
                  <select
                    name="wifiStatus"
                    defaultValue={property.wifiStatus}
                    className="dashboard-input"
                  >
                    <option value="active">Active</option>
                    <option value="disconnected">Disconnected</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="dashboard-label">🛠️ Repair Status</label>
                  <select
                    name="repairStatus"
                    defaultValue={property.repairStatus}
                    className="dashboard-input"
                  >
                    <option value="none">None</option>
                    <option value="pending">Pending Request</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="dashboard-label">Repair Notes</label>
                  <input
                    type="text"
                    name="repairNotes"
                    defaultValue={property.repairNotes}
                    placeholder="e.g. Fix kitchen tap"
                    className="dashboard-input"
                  />
                </div>
              </div>

              <div className="ops-actions">
                <button type="submit" className="dashboard-btn">
                  Update Operations
                </button>
              </div>
            </form>
          ))
        )}
      </div>
    </>
  );
};

export default OperationsTab;