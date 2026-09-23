const TenantComplaintsTab = ({ complaints, complaintForm, onComplaintFormChange, onSubmit }) => {
  return (
    <div className="dashboard-card-grid">
      {/* Existing Complaints List */}
      {complaints.length > 0 && (
        <div className="dashboard-card" style={{ gridColumn: "span 2" }}>
          <h4 className="dashboard-section-title">Your Recent Tickets</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {complaints.slice(0, 5).map((c) => (
              <div key={c._id} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem 0",
                borderBottom: "1px solid var(--border-light)",
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: "600" }}>{c.title}</p>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    {c.category} • {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`dashboard-pill ${c.status === "resolved" ? "dashboard-pill--success" : "dashboard-pill--warning"}`} style={{ fontSize: "0.7rem" }}>
                  {c.status || "Open"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complaint Form */}
      <div className="dashboard-card" style={{ gridColumn: "span 2" }}>
        <h4 className="dashboard-section-title">Submit New Ticket</h4>
        <form onSubmit={onSubmit} className="dashboard-form-stack">
          <div>
            <label className="dashboard-label">Issue Title</label>
            <input
              type="text"
              value={complaintForm.title}
              onChange={(e) => onComplaintFormChange("title", e.target.value)}
              required
              className="dashboard-input"
              placeholder="Brief title of the issue"
            />
          </div>
          <div>
            <label className="dashboard-label">Category</label>
            <select
              value={complaintForm.category}
              onChange={(e) => onComplaintFormChange("category", e.target.value)}
              className="dashboard-select"
              required
            >
              <option value="plumbing">Plumbing</option>
              <option value="electricity">Electricity</option>
              <option value="wifi">WiFi / Internet</option>
              <option value="structural">Structural</option>
              <option value="security">Security</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="dashboard-label">Description</label>
            <textarea
              value={complaintForm.description}
              onChange={(e) => onComplaintFormChange("description", e.target.value)}
              required
              className="dashboard-input"
              rows="4"
              style={{ resize: "vertical", minHeight: "90px" }}
              placeholder="Describe the issue in detail"
            />
          </div>
          <button type="submit" className="dashboard-btn">
            Submit Maintenance Ticket
          </button>
        </form>
      </div>
    </div>
  );
};

export default TenantComplaintsTab;