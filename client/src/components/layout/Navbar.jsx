import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import NotificationBell from "../Notifications/NotificationBell";

const routeTitles = {
  "/": "Property Portfolio",
  "/add": "Add Property",
  "/my-properties": "My Properties",
  "/admin": "Admin Dashboard",
  "/agent-dashboard": "Agent Dashboard",
  "/tenant-dashboard": "Tenant Portal",
  "/notifications": "Notifications",
  "/login": "Sign In",
  "/register": "Create Account",
};

const getInitials = (name = "Guest") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const Navbar = ({ onToggleSidebar, breadcrumb }) => {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();

  const pageTitle =
    routeTitles[pathname] ||
    (pathname.startsWith("/properties/") ? "Property Details" : "Workspace");

  return (
    <header className="app-topbar">
      <div className="dashboard-inline-actions">
        <button
          type="button"
          className="icon-button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <div className="topbar-meta">
          <span className="breadcrumb">{breadcrumb}</span>
          <span className="topbar-title">{pageTitle}</span>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="topbar-search">
          <span aria-hidden="true">
            <Search size={16} strokeWidth={1.5} />
          </span>
          <input type="search" placeholder="Search properties, tenants, reports" aria-label="Search" />
        </div>

        <NotificationBell />

        <div className="user-chip">
          <span className="avatar">{getInitials(user?.name)}</span>
          <div className="user-chip-details">
            <strong>{user?.name || "Guest User"}</strong>
            <span className="role-badge">{user?.role || "guest"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;