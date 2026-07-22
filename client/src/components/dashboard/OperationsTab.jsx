const OperationsTab = ({ properties, onUpdateOperations }) => (
  <div>
    <h3 className="dashboard-section-title">
      Manage Electricity, WiFi & Repairs
    </h3>
    {properties.map((property) => (
      <form
        key={property._id}
        onSubmit={(event) => onUpdateOperations(event, property._id)}
        className="dashboard-panel dashboard-form-grid"
        style={{ marginBottom: "1rem" }}
      >
        <div>
          <strong>{property.title}</strong>
        </div>
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
        <button type="submit" className="dashboard-btn dashboard-btn--primary">
          Update Operations
        </button>
      </form>
    ))}
  </div>
);

export default OperationsTab;
