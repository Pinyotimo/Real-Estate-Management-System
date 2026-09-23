const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div style={{
    position: "fixed",
    inset: 0,
    zIndex: 50,
    display: "grid",
    placeItems: "center",
    background: "rgba(15, 23, 42, 0.45)",
    backdropFilter: "blur(4px)",
    padding: "1rem"
  }}>
    <div className="dashboard-card animate-fade-in" style={{
      maxWidth: "420px",
      width: "100%",
      padding: "1.5rem",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-lg)"
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "var(--warning-soft)",
        display: "grid",
        placeItems: "center",
        marginBottom: "1rem",
        color: "var(--brand-black)"
      }}>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
        Confirm Action
      </h3>
      <p style={{ fontSize: "0.9rem", color: "var(--text-subtle)", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
        {message}
      </p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button onClick={onCancel} className="dashboard-btn dashboard-btn--ghost" style={{ minHeight: "38px" }}>
          Cancel
        </button>
        <button onClick={onConfirm} className="dashboard-btn dashboard-btn--danger" style={{ minHeight: "38px" }}>
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;