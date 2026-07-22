import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api";
import { AuthContext } from "../../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "tenant",
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/register", formData);
      login(data.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-card">
      <h2>Create Account</h2>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit} className="dashboard-form-stack">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="dashboard-input"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
          className="dashboard-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="dashboard-input"
        />
        <select
          name="role"
          onChange={handleChange}
          value={formData.role}
          className="dashboard-input"
        >
          <option value="tenant">I am a Tenant</option>
          <option value="agent">I am an Agent/Landlord</option>
        </select>
        <button type="submit" className="dashboard-btn dashboard-btn--success">
          Register
        </button>
      </form>
      <p style={{ marginTop: "1rem", fontSize: "0.9rem" }}>
        Already registered?{" "}
        <Link to="/login" className="dashboard-link">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;