const TenantError = ({ error, onRetry }) => (
  <div className="dashboard-shell">
    <div className="dashboard-panel agent-error-panel animate-fade-in">
      <div style={{
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "var(--danger-soft)",
        display: "grid",
        placeItems: "center",
        margin: "0 auto 1rem",
        color: "var(--brand-black)"
      }}>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
        Portal Unavailable
      </p>
      <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.25rem", maxWidth: "360px" }}>
        {error}
      </p>
      <button className="dashboard-btn" onClick={onRetry}>
        Retry Connection
      </button>
    </div>
  </div>
);

export default TenantError;