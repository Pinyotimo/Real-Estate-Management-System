const TenantReceiptsTab = ({ payments }) => {
  if (payments.length === 0) {
    return (
      <div className="dashboard-table-wrapper">
        <div className="empty-state" style={{ padding: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}>📄</div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 0.5rem" }}>
            No Payment Receipts
          </h3>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>
            Once you make a payment through the Pay Rent tab, your transaction receipts will appear here for download and reference.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-table-wrapper">
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id}>
              <td>{p.transactionId || p._id.slice(-8).toUpperCase()}</td>
              <td>{p.paymentType}</td>
              <td style={{ fontWeight: "700" }}>KES {Number(p.amount).toLocaleString()}</td>
              <td>
                {new Date(p.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td>
                <span className={`dashboard-pill ${p.status === "completed" || p.status === "Completed" ? "dashboard-pill--success" : "dashboard-pill--warning"}`}>
                  {p.status || "Completed"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TenantReceiptsTab;