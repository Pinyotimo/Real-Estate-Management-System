import { useEffect, useState } from "react";
import API from "../../../api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, usersRes, propsRes, suspendedRes, auditRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/admin/users"),
        API.get("/properties"),
        API.get("/admin/users/suspended"),
        API.get("/admin/audit-logs"),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setProperties(propsRes.data.data);
      setSuspendedUsers(suspendedRes.data.data || []);
      setAuditLogs(auditRes.data.data || []);
    } catch (err) {
      console.error("Error loading admin dashboard:", err);
      setError("Could not load the admin portal. Please try again.");
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
      setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
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

  const handleSuspendUser = async (userId) => {
    if (!window.confirm("Suspend this user? They will be logged out and blocked from logging in.")) return;
    try {
      await API.put(`/admin/users/${userId}/suspend`);
      const target = users.find((u) => u._id === userId);
      setUsers(users.filter((u) => u._id !== userId));
      if (target) setSuspendedUsers([...suspendedUsers, { ...target, suspended: true }]);
    } catch (err) {
      alert("Failed to suspend user");
    }
  };

  const handleUnsuspendUser = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/unsuspend`);
      const target = suspendedUsers.find((u) => u._id === userId);
      setSuspendedUsers(suspendedUsers.filter((u) => u._id !== userId));
      if (target) setUsers([...users, { ...target, suspended: false }]);
    } catch (err) {
      alert("Failed to unsuspend user");
    }
  };

  const handleForceLogoutAll = async () => {
    if (!window.confirm("This will log out every currently signed-in user. Continue?")) return;
    try {
      await API.post("/admin/force-logout-all");
      alert("All active sessions have been invalidated.");
    } catch (err) {
      alert("Failed to force logout all users.");
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to remove this property listing?")) {
      try {
        await API.delete(`/properties/${propertyId}`);
        setProperties(properties.filter((p) => p._id !== propertyId));
      } catch (err) {
        alert("Failed to delete property listing");
      }
    }
  };

  // ----- Client-side computed metrics (no backend change needed for these) -----
  const totalListings = properties.length;
  const totalListingValue = properties.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="dashboard-shell">
        <p className="dashboard-subtitle" style={{ textAlign: "center", marginTop: "3rem" }}>
          Loading Admin Portal...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-panel" style={{ textAlign: "center", maxWidth: "480px", margin: "3rem auto" }}>
          <p className="auth-error" style={{ display: "inline-block" }}>{error}</p>
          <div style={{ marginTop: "1rem" }}>
            <button className="dashboard-btn" onClick={fetchDashboardData}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .admin-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .admin-danger-action {
          background: var(--danger);
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .admin-danger-action:hover {
          background: #dc2626;
        }
        .audit-log-row {
          display: flex;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border-light);
          font-size: 0.9rem;
        }
        .audit-log-time {
          color: var(--text-muted);
          min-width: 170px;
          font-size: 0.8rem;
        }
        .audit-log-actor {
          font-weight: 600;
          min-width: 140px;
        }
        .audit-log-action {
          color: var(--text-subtle);
        }
        .empty-state {
          text-align: center;
          padding: 2rem 1rem;
          color: var(--text-muted);
          background: var(--surface-soft);
          border: 1px dashed var(--border);
          border-radius: var(--radius);
        }
      `}</style>

      <div className="dashboard-shell">
        <div className="admin-header-row">
          <h1 style={{ margin: 0 }}>👑 System Admin Dashboard</h1>
          <button className="admin-danger-action" onClick={handleForceLogoutAll}>
            🔒 Force Logout All Users
          </button>
        </div>

        <div className="dashboard-card-grid">
          <div className="dashboard-card">
            <span className="dashboard-card-title">Total Users</span>
            <span className="dashboard-card-value">{stats?.totalUsers || 0}</span>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card-title">Active Agents</span>
            <span className="dashboard-card-value">{stats?.totalAgents || 0}</span>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card-title">Tenants</span>
            <span className="dashboard-card-value">{stats?.totalBuyers || 0}</span>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card-title">Listed Properties</span>
            <span className="dashboard-card-value">{totalListings}</span>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card-title">Total Listed Value</span>
            <span className="dashboard-card-value" style={{ color: "var(--success)" }}>
              ${totalListingValue.toLocaleString()}
            </span>
          </div>
          <div className="dashboard-card">
            <span className="dashboard-card-title">Suspended Users</span>
            <span className="dashboard-card-value" style={{ color: "var(--danger)" }}>
              {suspendedUsers.length}
            </span>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button onClick={() => setActiveTab("users")} className={`dashboard-tab ${activeTab === "users" ? "active" : ""}`}>
            User Accounts ({users.length})
          </button>
          <button onClick={() => setActiveTab("suspended")} className={`dashboard-tab ${activeTab === "suspended" ? "active" : ""}`}>
            Suspended ({suspendedUsers.length})
          </button>
          <button onClick={() => setActiveTab("properties")} className={`dashboard-tab ${activeTab === "properties" ? "active" : ""}`}>
            All Listings ({properties.length})
          </button>
          <button onClick={() => setActiveTab("audit")} className={`dashboard-tab ${activeTab === "audit" ? "active" : ""}`}>
            Audit Logs ({auditLogs.length})
          </button>
        </div>

        {/* ACTIVE USERS */}
        {activeTab === "users" && (
          <div className="dashboard-table-wrapper">
            {users.length === 0 ? (
              <div className="empty-state">No active user accounts.</div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Last Active</th>
                    <th>Change Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className="dashboard-pill dashboard-pill--info">{u.role}</span>
                      </td>
                      <td>{formatDateTime(u.createdAt)}</td>
                      <td>{formatDateTime(u.lastActiveAt)}</td>
                      <td>
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="dashboard-select"
                        >
                          <option value="tenant">tenant</option>
                          <option value="agent">agent</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td>
                        <div className="dashboard-inline-actions">
                          <button onClick={() => handleSuspendUser(u._id)} className="dashboard-btn" style={{ background: "var(--warning)" }}>
                            Suspend
                          </button>
                          <button onClick={() => handleDeleteUser(u._id)} className="dashboard-btn dashboard-btn--danger">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* SUSPENDED USERS */}
        {activeTab === "suspended" && (
          <div className="dashboard-table-wrapper">
            {suspendedUsers.length === 0 ? (
              <div className="empty-state">No suspended users.</div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Suspended On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {suspendedUsers.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className="dashboard-pill dashboard-pill--warning">{u.role}</span>
                      </td>
                      <td>{formatDateTime(u.suspendedAt)}</td>
                      <td>
                        <button onClick={() => handleUnsuspendUser(u._id)} className="dashboard-btn dashboard-btn--success">
                          Unsuspend
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* PROPERTIES */}
        {activeTab === "properties" && (
          <div className="dashboard-table-wrapper">
            {properties.length === 0 ? (
              <div className="empty-state">No listings yet.</div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Type</th>
                    <th>Listed On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr key={p._id}>
                      <td>{p.title}</td>
                      <td>{p.estate}, {p.county}</td>
                      <td>${Number(p.price).toLocaleString()}</td>
                      <td>{p.houseType}</td>
                      <td>{formatDateTime(p.createdAt)}</td>
                      <td>
                        <button onClick={() => handleDeleteProperty(p._id)} className="dashboard-btn dashboard-btn--danger">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* AUDIT LOGS */}
        {activeTab === "audit" && (
          <div className="dashboard-panel">
            {auditLogs.length === 0 ? (
              <div className="empty-state">No audit log entries yet.</div>
            ) : (
              auditLogs.map((log) => (
                <div key={log._id} className="audit-log-row">
                  <span className="audit-log-time">{formatDateTime(log.createdAt)}</span>
                  <span className="audit-log-actor">{log.actorName || "System"}</span>
                  <span className="audit-log-action">{log.action}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;