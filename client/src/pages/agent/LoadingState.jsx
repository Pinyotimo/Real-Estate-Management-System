const LoadingState = () => (
  <div className="dashboard-shell">
    <div className="agent-dashboard-header" style={{ marginBottom: "1rem" }}>
      <div className="animate-shimmer" style={{ width: "300px", height: "28px", borderRadius: "var(--radius-sm)" }} />
      <div className="animate-shimmer" style={{ width: "100px", height: "38px", borderRadius: "var(--radius-sm)" }} />
    </div>
    <div className="analytics-strip" style={{ marginBottom: "1.25rem" }}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-shimmer" style={{ height: "90px", borderRadius: "var(--radius)" }} />
      ))}
    </div>
    <div className="animate-shimmer" style={{ height: "120px", borderRadius: "var(--radius)", marginBottom: "1.25rem" }} />
    <div className="animate-shimmer" style={{ height: "44px", borderRadius: "var(--radius)", marginBottom: "1.25rem" }} />
    <div className="animate-shimmer" style={{ height: "320px", borderRadius: "var(--radius)" }} />
  </div>
);

export default LoadingState;