import { useEffect, useState } from "react";
import API from "../../../api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, propsRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/users"),
        API.get("/properties"),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setProperties(propsRes.data.data);
    } catch (err) {
      console.error("Error loading admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );
    } catch (err) {
      alert("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user account?")) {
      try {
        await API.delete(`/admin/users/${userId}`);
        setUsers(users.filter((u) => u._id !== userId));
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (
      window.confirm("Are you sure you want to remove this property listing?")
    ) {
      try {
        await API.delete(`/properties/${propertyId}`);
        setProperties(properties.filter((p) => p._id !== propertyId));
      } catch (err) {
        alert("Failed to delete property listing");
      }
    }
  };

  if (loading)
    return (
      <p
        className="dashboard-subtitle"
        style={{ textAlign: "center", marginTop: "3rem" }}
      >
        Loading Admin Portal...
      </p>
    );

  return (
    <div className="dashboard-shell">
      <h1>👑 System Admin Dashboard</h1>

      <div className="dashboard-card-grid">
        <div className="dashboard-card">
          <span className="dashboard-card-title">Total Users</span>
          <span className="dashboard-card-value">{stats?.totalUsers || 0}</span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-title">Active Agents</span>
          <span className="dashboard-card-value">
            {stats?.totalAgents || 0}
          </span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-title">Buyers / Tenants</span>
          <span className="dashboard-card-value">
            {stats?.totalBuyers || 0}
          </span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-title">Listed Properties</span>
          <span className="dashboard-card-value">
            {stats?.totalProperties || 0}
          </span>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          onClick={() => setActiveTab("users")}
          className={`dashboard-tab ${activeTab === "users" ? "active" : ""}`}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("properties")}
          className={`dashboard-tab ${activeTab === "properties" ? "active" : ""}`}
        >
          All Listings ({properties.length})
        </button>
      </div>

      {activeTab === "users" && (
        <div style={{ overflowX: "auto" }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Change Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="dashboard-pill dashboard-pill--info">
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="dashboard-input"
                    >
                      <option value="buyer">buyer</option>
                      <option value="agent">agent</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="dashboard-btn dashboard-btn--danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "properties" && (
        <div style={{ overflowX: "auto" }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Location</th>
                <th>Price</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td>
                    {p.estate}, {p.county}
                  </td>
                  <td>${Number(p.price).toLocaleString()}</td>
                  <td>{p.houseType}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteProperty(p._id)}
                      className="dashboard-btn dashboard-btn--danger"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
