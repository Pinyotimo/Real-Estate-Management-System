import { useContext, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { to: "/", label: "Properties", icon: "P", roles: ["guest", "tenant", "agent", "admin"] },
      { to: "/add", label: "Add Property", icon: "+", roles: ["agent", "admin"] },
      { to: "/agent-dashboard", label: "Agent Dashboard", icon: "A", roles: ["agent", "admin"] },
      { to: "/tenant-dashboard", label: "Tenant Portal", icon: "T", roles: ["tenant"] },
      { to: "/admin", label: "Admin Dashboard", icon: "D", roles: ["admin"] },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/login", label: "Login", icon: "L", roles: ["guest"] },
      { to: "/register", label: "Register", icon: "R", roles: ["guest"] },
    ],
  },
];

const getInitials = (name = "Guest") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const routeTitles = {
  "/": "Property Portfolio",
  "/add": "Add Property",
  "/admin": "Admin Dashboard",
  "/agent-dashboard": "Agent Dashboard",
  "/tenant-dashboard": "Tenant Portal",
  "/login": "Sign In",
  "/register": "Create Account",
};

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = user?.role || "guest";

  const visibleGroups = useMemo(
    () =>
      navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.roles.includes(role)),
        }))
        .filter((group) => group.items.length > 0),
    [role],
  );

  const pageTitle =
    routeTitles[pathname] ||
    (pathname.startsWith("/properties/") ? "Property Details" : "Workspace");

  return (
    <div className={`app-frame ${sidebarOpen ? "sidebar-open" : ""}`}>
      <button
        type="button"
        className="sidebar-backdrop"
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
      />

      <aside className="sidebar" aria-label="Primary navigation">
        <Link to="/" className="sidebar-header" onClick={() => setSidebarOpen(false)}>
          <span className="brand-mark">DS</span>
          <span className="brand-title">
            <strong>Real Estate Manager</strong>
            <span>Davis & Shirtliff style system</span>
          </span>
        </Link>

        <nav className="sidebar-nav">
          {visibleGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <span className="nav-group-label">{group.label}</span>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {user && (
          <div className="sidebar-footer">
            <button type="button" className="dashboard-btn dashboard-btn--secondary full-width" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </aside>

      <header className="app-topbar">
        <div className="dashboard-inline-actions">
          <button
            type="button"
            className="icon-button mobile-menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>
          <div className="topbar-meta">
            <span className="breadcrumb">Workspace / {pageTitle}</span>
            <span className="topbar-title">{pageTitle}</span>
          </div>
        </div>

        <div className="topbar-actions">
          <label className="topbar-search">
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Search properties, tenants, reports" aria-label="Search" />
          </label>
          <button type="button" className="icon-button optional-mobile" aria-label="Notifications">
            !
          </button>
          <div className="user-chip">
            <span className="avatar">{getInitials(user?.name)}</span>
            <span className="user-chip-details">
              <strong>{user?.name || "Guest User"}</strong>
              <span className="role-badge">{role}</span>
            </span>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
