const FormFeedback = ({ error, success, onDismissError }) => (
  <>
    {error && (
      <div
        className="dashboard-panel"
        style={{
          marginBottom: "1rem",
          borderLeft: "4px solid var(--brand-black)",
          background: "var(--danger-soft)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.85rem 1rem",
        }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--brand-black)" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text-primary)", flex: 1 }}>{error}</span>
        {onDismissError && (
          <button
            onClick={onDismissError}
            className="icon-button"
            style={{ width: "28px", height: "28px", border: "none", background: "transparent" }}
            aria-label="Dismiss error"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )}
    {success && (
      <div
        className="dashboard-panel"
        style={{
          marginBottom: "1rem",
          borderLeft: "4px solid var(--brand-blue)",
          background: "var(--success-soft)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.85rem 1rem",
        }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--brand-blue)" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span style={{ fontSize: "0.88rem", fontWeight: 600, flex: 1 }}>{success}</span>
      </div>
    )}
  </>
);

export default FormFeedback;