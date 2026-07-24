import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (loginEmail, loginPassword) => {
    try {
      setError("");
      const { data } = await API.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });
      login(data.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLoginSubmit(email, password);
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    handleLoginSubmit(demoEmail, demoPassword);
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div>
          <span className="role-badge">Secure property operations</span>
          <h1>Manage listings, tenants, payments, and service requests.</h1>
          <p>
            A focused workspace for administrators, agents, landlords, and
            residents with Davis & Shirtliff inspired visual standards.
          </p>
        </div>
        <div className="auth-metric-grid" aria-label="Platform highlights">
          <div className="auth-metric">
            <strong>24/7</strong>
            <p>Portal access</p>
          </div>
          <div className="auth-metric">
            <strong>3</strong>
            <p>Role workspaces</p>
          </div>
          <div className="auth-metric">
            <strong>100%</strong>
            <p>Responsive UI</p>
          </div>
        </div>
      </section>

      <section className="auth-card">
        <h2 className="dashboard-title">Sign In</h2>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-demo-panel">
          <p className="dashboard-card-title">Quick Demo Login</p>
          <div className="dashboard-inline-actions">
            <button type="button" onClick={() => handleDemoLogin("admin@demo.com", "password123")} className="dashboard-btn">
              Admin
            </button>
            <button type="button" onClick={() => handleDemoLogin("agent@demo.com", "password123")} className="dashboard-btn dashboard-btn--outline">
              Agent
            </button>
            <button type="button" onClick={() => handleDemoLogin("tenant@demo.com", "password123")} className="dashboard-btn dashboard-btn--secondary">
              Tenant
            </button>
          </div>
        </div>

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
              className="dashboard-input"
            />
          </div>
          <div>
            <label className="dashboard-label required" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="dashboard-input"
            />
          </div>
          <div className="dashboard-space-between">
            <label className="dashboard-checkbox-label">
              <input type="checkbox" />
              Remember me
            </label>
            <Link to="/login" className="dashboard-link">Forgot password?</Link>
          </div>
          <button type="submit" className="dashboard-btn dashboard-btn--secondary">
            Login
          </button>
          <button type="button" className="dashboard-btn dashboard-btn--outline">
            Continue with Google
          </button>
        </form>

        <p className="dashboard-subtitle">
          Don't have an account?{" "}
          <Link to="/register" className="dashboard-link">Register here</Link>
        </p>
      </section>
    </div>
  );
};

export default Login;
