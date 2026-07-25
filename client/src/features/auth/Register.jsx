import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tenant",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await register(formData);
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div>
          <span className="role-badge">New workspace access</span>
          <h1>Create a property management account with the right role.</h1>
          <p>
            Register as a tenant or agent and enter the same secure operational
            system used across listings, occupancy, and payment workflows.
          </p>
        </div>
        <div className="auth-metric-grid">
          <div className="auth-metric">
            <strong>Agent</strong>
            <p>List and manage units</p>
          </div>
          <div className="auth-metric">
            <strong>Tenant</strong>
            <p>Pay and report issues</p>
          </div>
          <div className="auth-metric">
            <strong>Admin</strong>
            <p>Govern the system</p>
          </div>
        </div>
      </section>

      <section className="auth-card">
        <h2 className="dashboard-title">Create Account</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit} className="dashboard-form-stack">
          <div>
            <label className="dashboard-label required" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Full name"
              onChange={handleChange}
              required
              className="dashboard-input"
              disabled={loading}
            />
          </div>
          <div>
            <label className="dashboard-label required" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              onChange={handleChange}
              required
              className="dashboard-input"
              disabled={loading}
            />
          </div>
          <div>
            <label className="dashboard-label required" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Create a secure password"
              onChange={handleChange}
              required
              className="dashboard-input"
              disabled={loading}
            />
            <span className="dashboard-subtitle">
              Use at least 8 characters.
            </span>
          </div>
          <div>
            <label className="dashboard-label required" htmlFor="role">
              Account Role
            </label>
            <select
              id="role"
              name="role"
              onChange={handleChange}
              value={formData.role}
              className="dashboard-input"
              disabled={loading}
            >
              <option value="tenant">I am a Tenant</option>
              <option value="agent">I am an Agent</option>
            </select>
          </div>
          <button
            type="submit"
            className="dashboard-btn dashboard-btn--secondary"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>
        <p className="dashboard-subtitle">
          Already registered?{" "}
          <Link to="/login" className="dashboard-link">
            Login here
          </Link>
        </p>
      </section>
    </div>
  );
};

export default Register;