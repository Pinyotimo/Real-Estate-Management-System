const LoadingState = () => (
  <div className="dashboard-shell">
    <div style={{ marginBottom: "2rem" }}>
      <div className="animate-shimmer" style={{ width: "280px", height: "36px", marginBottom: "8px", borderRadius: "10px" }} />
      <div className="animate-shimmer" style={{ width: "420px", height: "18px", borderRadius: "6px" }} />
    </div>

    <div className="dashboard-card-grid" style={{ marginBottom: "2rem" }}>
      {[...Array(6)].map((_, i) => (
        <div key={i} className="dashboard-card animate-shimmer" style={{ height: "120px" }} />
      ))}
    </div>

    <div className="animate-shimmer" style={{ height: "300px", borderRadius: "10px" }} />
  </div>
);

export default LoadingState;