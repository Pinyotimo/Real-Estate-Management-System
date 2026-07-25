const InquiriesTab = ({ inquiries }) => (
  <div>
    <h3 className="dashboard-section-title">Tenant Inquiries</h3>
    {inquiries.length === 0 ? (
      <p className="dashboard-subtitle">No messages received yet.</p>
    ) : (
      <div className="dashboard-stack">
        {inquiries.map((inquiry) => (
          <div key={inquiry._id} className="dashboard-inquiry-card">
            <div className="dashboard-space-between">
              <strong>
                {inquiry.name} ({inquiry.email} | {inquiry.phone})
              </strong>
              <span className="dashboard-subtitle">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="dashboard-subtitle">
              &quot;{inquiry.message}&quot;
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default InquiriesTab;
