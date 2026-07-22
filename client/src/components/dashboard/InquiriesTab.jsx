const InquiriesTab = ({ inquiries }) => (
  <div>
    <h3 className="dashboard-section-title">Buyer & Tenant Inquiries</h3>
    {inquiries.length === 0 ? (
      <p className="dashboard-subtitle">No messages received yet.</p>
    ) : (
      <div className="dashboard-stack">
        {inquiries.map((inquiry) => (
          <div key={inquiry._id} className="dashboard-inquiry-card">
            <div
              className="dashboard-space-between"
              style={{ marginBottom: "0.5rem" }}
            >
              <strong>
                {inquiry.name} ({inquiry.email} | {inquiry.phone})
              </strong>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p style={{ margin: 0, color: "#334155" }}>
              &quot;{inquiry.message}&quot;
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default InquiriesTab;
