import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLoginSubmit = async (loginEmail, loginPassword) => {
    setError("");
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    handleLoginSubmit(email, password);
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    handleLoginSubmit(demoEmail, demoPassword);
  };

  return (
    <div className="auth-page animate-fade-in">
      {/* Hero Section */}
      <section className="auth-hero">
        <div>
          <span className="role-badge" style={{ marginBottom: "1rem", display: "inline-flex" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: "0.35rem" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Secure property operations
          </span>
          <h1>Manage listings, tenants, payments, and service requests.</h1>
          <p>
            A focused workspace for administrators, agents, landlords, and
            residents with Davis &amp; Shirtliff inspired visual standards.
          </p>
        </div>
        <div className="auth-metric-grid" aria-label="Platform highlights">
          <div className="auth-metric">
            <div style={{ marginBottom: "0.5rem", color: "var(--brand-light-blue)" }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <strong>24/7</strong>
            <p>Portal access</p>
          </div>
          <div className="auth-metric">
            <div style={{ marginBottom: "0.5rem", color: "var(--brand-light-blue)" }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <strong>3</strong>
            <p>Role workspaces</p>
          </div>
          <div className="auth-metric">
            <div style={{ marginBottom: "0.5rem", color: "var(--brand-light-blue)" }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <strong>100%</strong>
            <p>Responsive UI</p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="auth-card">
        <h2 className="dashboard-title" style={{ margin: "0 0 1.25rem", fontSize: "1.5rem" }}>
          Sign In
        </h2>

        {/* Error Banner */}
        {error && (
          <div className="auth-error" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{ flex: 1, fontSize: "0.85rem" }}>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: "0.15rem" }}
              aria-label="Dismiss error"
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Demo Login Panel */}
        <div className="auth-demo-panel">
          <p className="dashboard-card-title" style={{ marginBottom: "0.6rem" }}>Quick Demo Login</p>
          <div className="dashboard-inline-actions" style={{ gap: "0.5rem" }}>
            <button
              type="button"
              onClick={() => handleDemoLogin("admin@demo.com", "password123")}
              disabled={loading}
              className="dashboard-btn"
              style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem", minHeight: "36px" }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: "0.3rem" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("agent@demo.com", "password123")}
              disabled={loading}
              className="dashboard-btn dashboard-btn--outline"
              style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem", minHeight: "36px" }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: "0.3rem" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Agent
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("tenant@demo.com", "password123")}
              disabled={loading}
              className="dashboard-btn dashboard-btn--secondary"
              style={{ fontSize: "0.8rem", padding: "0.4rem 0.75rem", minHeight: "36px" }}
            >
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: "0.3rem" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Tenant
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="dashboard-form-stack">
          <div>
            <label className="dashboard-label required" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="dashboard-input"
              disabled={loading}
            />
          </div>

          <div style={{ position: "relative" }}>
            <label className="dashboard-label required" htmlFor="password">Password</label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="dashboard-input"
              disabled={loading}
              style={{ paddingRight: "2.75rem" }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="icon-button"
              style={{
                position: "absolute",
                right: "0.4rem",
                bottom: "0.35rem",
                width: "34px",
                height: "34px",
                minHeight: "34px",
                border: "none",
                background: "transparent",
                color: "var(--text-muted)"
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="dashboard-space-between" style={{ alignItems: "center" }}>
            <label className="dashboard-checkbox-label" style={{ cursor: "pointer" }}>
              <input
                type="checkbox"
                disabled={loading}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "var(--brand-blue)",
                  cursor: "pointer"
                }}
              />
              <span style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>Remember me</span>
            </label>
            <Link to="/login" className="dashboard-link" style={{ fontSize: "0.85rem" }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="dashboard-btn dashboard-btn--secondary"
            style={{ marginTop: "0.25rem" }}
          >
            {loading ? (
              <>
                <svg className="animate-pulse" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in…</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>

          <button
            type="button"
            disabled={loading}
            className="dashboard-btn dashboard-btn--outline"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="dashboard-subtitle" style={{ textAlign: "center", marginTop: "1.25rem", marginBottom: 0 }}>
          Don't have an account?{" "}
          <Link to="/register" className="dashboard-link">Create one</Link>
        </p>
      </section>
    </div>
  );
};

export default Login;