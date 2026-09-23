const TenantHeader = ({ onRefresh, error, success, onClearError, onClearSuccess }) => {
  return (
    <>
      <div className="agent-dashboard-header">
        <div>
          <h2 className="dashboard-title" style={{ margin: 0 }}>Resident Portal</h2>
          <p className="dashboard-subtitle" style={{ margin: "0.25rem 0 0" }}>
            Manage your unit, payments, and maintenance requests.
          </p>
        </div>
        <button
          className="dashboard-btn dashboard-btn--outline"
          onClick={onRefresh}
          style={{ minHeight: "38px", fontSize: "0.82rem" }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.35rem" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="dashboard-panel" style={{
          marginTop: "1rem",
          borderLeft: "4px solid var(--brand-black)",
          background: "var(--danger-soft)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.85rem 1rem"
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--brand-black)" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style={{ fontSize: "0.88rem", fontWeight: 600, flex: 1 }}>{error}</span>
          <button onClick={onClearError} className="icon-button" style={{ width: "28px", height: "28px", border: "none", background: "transparent" }} aria-label="Dismiss">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
      {success && (
        <div className="dashboard-panel" style={{
          marginTop: "1rem",
          borderLeft: "4px solid var(--brand-blue)",
          background: "var(--success-soft)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.85rem 1rem"
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--brand-blue)" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span style={{ fontSize: "0.88rem", fontWeight: 600, flex: 1 }}>{success}</span>
          <button onClick={onClearSuccess} className="icon-button" style={{ width: "28px", height: "28px", border: "none", background: "transparent" }} aria-label="Dismiss">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
    </>
  );
};

export default TenantHeader;