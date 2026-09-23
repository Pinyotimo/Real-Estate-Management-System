import PropTypes from "prop-types";

const ErrorState = ({ error, onRetry }) => (
  <div className="dashboard-shell">
    <div className="page-card" style={{ textAlign: "center", maxWidth: "480px", margin: "3rem auto" }}>
      <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}><span aria-hidden="true">⚠️</span></div>
      <h2 className="dashboard-title" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Unable to Load Admin Portal</h2>
      <p className="dashboard-subtitle" style={{ marginBottom: "1.5rem" }}>{error}</p>
      <button className="dashboard-btn dashboard-btn--primary" onClick={onRetry}>
        Try Again
      </button>
    </div>
  </div>
);

ErrorState.propTypes = {
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default ErrorState;