import { useEffect, useState } from "react";
import API from "../../../api";


const IconUsers = () => <span aria-hidden="true">👥</span>;
const IconAlert = () => <span aria-hidden="true">⚠️</span>;
const IconTrash = () => <span aria-hidden="true">🗑️</span>;
const IconUnlock = () => <span aria-hidden="true">🔓</span>;
const IconBan = () => <span aria-hidden="true">🚫</span>;
const IconDanger = () => <span aria-hidden="true">⛔</span>;
const IconLog = () => <span aria-hidden="true">📋</span>;
const IconHome = () => <span aria-hidden="true">🏠</span>;

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
    if (window.confirm("Are you sure you want to delete this user account? This action cannot be undone.")) {
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
    });
  };

  // Loading state
  if (loading) {
    return (
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
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-shell">
        <div className="page-card" style={{ textAlign: "center", maxWidth: "480px", margin: "3rem auto" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}><IconAlert /></div>
          <h2 className="dashboard-title" style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>Unable to Load Admin Portal</h2>
          <p className="dashboard-subtitle" style={{ marginBottom: "1.5rem" }}>{error}</p>
          <button className="dashboard-btn dashboard-btn--primary" onClick={fetchDashboardData}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      {/* PAGE HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "2rem", marginBottom: "2rem" }}>
        <div>
          <h1 className="dashboard-title">System Administration</h1>
          <p className="dashboard-subtitle">Manage users, roles, properties, and platform activity</p>
        </div>
        <button 
          className="dashboard-btn dashboard-btn--danger"
          onClick={handleForceLogoutAll}
          aria-label="Force logout all active users"
          style={{ whiteSpace: "nowrap", flexShrink: 0 }}
        >
          <IconDanger />
          Force Logout All Users
        </button>
      </div>

      {/* STAT CARDS GRID */}
      <div className="dashboard-card-grid" style={{ marginBottom: "2rem" }}>
        <div className="dashboard-card">
          <span className="dashboard-card-title">Total Users</span>
          <span className="dashboard-card-value">{stats?.totalUsers || 0}</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-title">Active Agents</span>
          <span className="dashboard-card-value">{stats?.totalAgents || 0}</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-title">Total Tenants</span>
          <span className="dashboard-card-value">{stats?.totalTenants || 0}</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-title">Listed Properties</span>
          <span className="dashboard-card-value">{totalListings}</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-title">Total Listed Value</span>
          <span className="dashboard-card-value">${(totalListingValue / 1000000).toFixed(1)}M</span>
        </div>

        <div className="dashboard-card">
          <span className="dashboard-card-title">Suspended Users</span>
          <span className="dashboard-card-value">{suspendedUsers.length}</span>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="dashboard-tabs">
        <button 
          className={`dashboard-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
          aria-selected={activeTab === "users"}
          role="tab"
        >
          <IconUsers /> Active Users ({users.length})
        </button>

        <button 
          className={`dashboard-tab ${activeTab === "suspended" ? "active" : ""}`}
          onClick={() => setActiveTab("suspended")}
          aria-selected={activeTab === "suspended"}
          role="tab"
        >
          <IconBan /> Suspended ({suspendedUsers.length})
        </button>

        <button 
          className={`dashboard-tab ${activeTab === "properties" ? "active" : ""}`}
          onClick={() => setActiveTab("properties")}
          aria-selected={activeTab === "properties"}
          role="tab"
        >
          <IconHome /> Properties ({properties.length})
        </button>

        <button 
          className={`dashboard-tab ${activeTab === "audit" ? "active" : ""}`}
          onClick={() => setActiveTab("audit")}
          aria-selected={activeTab === "audit"}
          role="tab"
        >
          <IconLog /> Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* ACTIVE USERS TAB */}
      {activeTab === "users" && (
        <div className="dashboard-table-wrapper">
          {users.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}><IconUsers /></div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 0.5rem" }}>No Active Users</h3>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>There are currently no active user accounts on the platform.</p>
            </div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>User</th>
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
                    <td style={{ fontWeight: "600" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "var(--primary)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          flexShrink: 0
                        }}>
                          {u.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`dashboard-pill dashboard-pill--${u.role === "admin" ? "danger" : u.role === "agent" ? "success" : "info"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{formatDateTime(u.createdAt)}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{formatDateTime(u.lastActiveAt)}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="dashboard-select"
                        aria-label={`Change role for ${u.name}`}
                        style={{ fontSize: "0.9rem", minHeight: "36px" }}
                      >
                        <option value="tenant">Tenant</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button 
                          onClick={() => handleSuspendUser(u._id)}
                          className="dashboard-btn dashboard-btn--outline"
                          title="Suspend user"
                          aria-label={`Suspend ${u.name}`}
                          style={{ padding: "0.5rem 0.75rem", fontSize: "0.9rem" }}
                        >
                          <IconBan />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          className="dashboard-btn dashboard-btn--danger"
                          title="Delete user"
                          aria-label={`Delete ${u.name}`}
                          style={{ padding: "0.5rem 0.75rem", fontSize: "0.9rem" }}
                        >
                          <IconTrash />
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

      {/* SUSPENDED USERS TAB */}
      {activeTab === "suspended" && (
        <div className="dashboard-table-wrapper">
          {suspendedUsers.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}><IconAlert /></div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 0.5rem" }}>No Suspended Users</h3>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>All users are in good standing.</p>
            </div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Suspended On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {suspendedUsers.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: "600" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "var(--surface-muted)",
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "0.85rem",
                          flexShrink: 0,
                          opacity: 0.65
                        }}>
                          {u.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className="dashboard-pill dashboard-pill--warning">
                        {u.role}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{formatDateTime(u.suspendedAt)}</td>
                    <td>
                      <button 
                        onClick={() => handleUnsuspendUser(u._id)}
                        className="dashboard-btn dashboard-btn--outline"
                        aria-label={`Unsuspend ${u.name}`}
                        style={{ fontSize: "0.9rem", padding: "0.5rem 0.9rem" }}
                      >
                        <IconUnlock />
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

      {/* PROPERTIES TAB */}
      {activeTab === "properties" && (
        <div className="dashboard-table-wrapper">
          {properties.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}><IconHome /></div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 0.5rem" }}>No Listed Properties</h3>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>There are currently no property listings on the platform.</p>
            </div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Property</th>
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
                    <td style={{ fontWeight: "600" }}>{p.title}</td>
                    <td>
                      <div>
                        <span>{p.estate}</span>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{p.county}</div>
                      </div>
                    </td>
                    <td style={{ fontWeight: "700", color: "var(--primary)" }}>${Number(p.price).toLocaleString()}</td>
                    <td>
                      <span style={{
                        display: "inline-block",
                        padding: "0.4rem 0.7rem",
                        background: "var(--surface-soft)",
                        color: "var(--text-subtle)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        border: "1px solid var(--border)"
                      }}>
                        {p.houseType}
                      </span>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{formatDateTime(p.createdAt)}</td>
                    <td>
                      <button 
                        onClick={() => handleDeleteProperty(p._id)}
                        className="dashboard-btn dashboard-btn--danger"
                        title="Remove listing"
                        aria-label={`Remove ${p.title}`}
                        style={{ padding: "0.5rem 0.75rem", fontSize: "0.9rem" }}
                      >
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* AUDIT LOGS TAB */}
      {activeTab === "audit" && (
        <div className="dashboard-panel">
          {auditLogs.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}><IconLog /></div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "var(--text-primary)", margin: "0 0 0.5rem" }}>No Audit Log Entries</h3>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>No system activity has been recorded yet.</p>
            </div>
          ) : (
            auditLogs.map((log, idx) => (
              <div key={log._id}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "180px 140px 1fr",
                  gap: "1.5rem",
                  alignItems: "center",
                  padding: "1rem 0"
                }}>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "500" }}>
                    {formatDateTime(log.createdAt)}
                  </div>
                  <div style={{ fontWeight: "700", color: "var(--text-primary)", fontSize: "0.95rem" }}>
                    {log.actorName || "System"}
                  </div>
                  <div style={{ color: "var(--text-subtle)", fontSize: "0.95rem", lineHeight: "1.5" }}>
                    {log.action}
                  </div>
                </div>
                {idx < auditLogs.length - 1 && (
                  <div style={{ gridColumn: "1 / -1", height: "1px", background: "var(--border-light)", margin: "0.5rem 0" }} />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
