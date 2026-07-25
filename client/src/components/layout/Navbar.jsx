import { useContext, useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Menu, Bell, User, Settings, LogOut } from "lucide-react";

const routeTitles = {
  "/": "Property Portfolio",
  "/add": "Add Property",
  "/my-properties": "My Properties",
  "/admin": "Admin Dashboard",
  "/agent-dashboard": "Agent Dashboard",
  "/tenant-dashboard": "Tenant Portal",
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
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pageTitle =
    routeTitles[pathname] ||
    (pathname.startsWith("/properties/") ? "Property Details" : "Workspace");

  const handleProfileAction = (path) => {
    setIsProfileOpen(false);
    navigate(path);
  };

  return (
    <header className="app-topbar">
      <div className="dashboard-inline-actions">
        <button
          type="button"
          className="mobile-menu-button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={24} />
        </button>
        <div className="topbar-meta">
          <span className="breadcrumb">{breadcrumb}</span>
          <span className="topbar-title">{pageTitle}</span>
        </div>
      </div>

      <div className="topbar-actions">
        <div className="topbar-search">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            placeholder="Search properties, tenants, reports"
            aria-label="Search"
          />
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="icon-button optional-mobile"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        {/* Profile Dropdown */}
        <div className="user-chip" ref={dropdownRef}>
          <button
            className="avatar"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-label="Toggle profile menu"
          >
            {getInitials(user?.name)}
          </button>
          <div className="user-chip-details">
            <strong>{user?.name || "Guest User"}</strong>
            <span className="role-badge">{user?.role || "guest"}</span>
          </div>
          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p className="dropdown-name">{user?.name || "Guest"}</p>
                <p className="dropdown-email">{user?.email || "guest@example.com"}</p>
              </div>
              <div className="dropdown-divider" />
              <button onClick={() => handleProfileAction("/profile")} className="dropdown-item">
                <User size={16} /> Profile
              </button>
              <button onClick={() => handleProfileAction("/settings")} className="dropdown-item">
                <Settings size={16} /> Settings
              </button>
              <div className="dropdown-divider" />
              <button onClick={() => { setIsProfileOpen(false); logout(); }} className="dropdown-item text-danger">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;