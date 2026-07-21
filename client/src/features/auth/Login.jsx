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
    <div className="auth-card">
      <h2 style={{ marginTop: 0 }}>Sign In</h2>

      {error && <div className="auth-error">{error}</div>}

      <div className="auth-demo-panel">
        <p
          style={{
            margin: "0 0 0.5rem 0",
            fontSize: "0.85rem",
            fontWeight: "bold",
            color: "#475569",
          }}
        >
          ⚡ Quick Demo Login:
        </p>
        <div className="dashboard-inline-actions">
          <button
            type="button"
            onClick={() => handleDemoLogin("admin@demo.com", "password123")}
            className="dashboard-btn dashboard-btn--purple"
            style={{ flex: 1 }}
          >
            👑 Admin
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin("agent@demo.com", "password123")}
            className="dashboard-btn"
            style={{ flex: 1 }}
          >
            🏢 Agent
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin("buyer@demo.com", "password123")}
            className="dashboard-btn dashboard-btn--success"
            style={{ flex: 1 }}
          >
            👤 Buyer
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="dashboard-form-stack">
        <div>
          <label className="dashboard-label">Email Address</label>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="dashboard-input"
          />
        </div>
        <div>
          <label className="dashboard-label">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="dashboard-input"
          />
        </div>
        <button type="submit" className="dashboard-btn dashboard-btn--dark">
          Login
        </button>
      </form>

      <p style={{ marginTop: "1rem", fontSize: "0.9rem", textAlign: "center" }}>
        Don't have an account?{" "}
        <Link to="/register" className="dashboard-link">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
