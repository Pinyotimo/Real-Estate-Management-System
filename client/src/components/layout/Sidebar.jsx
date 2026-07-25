import { useContext, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  PlusSquare,
  BarChart3,
  Key,
  Shield,
  LogOut,
  Home,
  Users,
  Bell,
  ChevronLeft,
  X,
} from "lucide-react";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { to: "/", label: "Properties", icon: LayoutDashboard, roles: ["guest", "tenant", "agent", "admin"] },
      { to: "/add", label: "Add Property", icon: PlusSquare, roles: ["agent", "admin"] },
      { to: "/my-properties", label: "My Properties", icon: Home, roles: ["agent", "admin"] },
      { to: "/agent-dashboard", label: "Agent Dashboard", icon: BarChart3, roles: ["agent", "admin"] },
      { to: "/tenant-dashboard", label: "Tenant Portal", icon: Key, roles: ["tenant"] },
      { to: "/admin", label: "Admin Dashboard", icon: Shield, roles: ["admin"] },
    ],
  },
  {
    label: "Activity",
    items: [
      { to: "/notifications", label: "Notifications", icon: Bell, roles: ["guest", "tenant", "agent", "admin"] },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/login", label: "Sign In", icon: Users, roles: ["guest"] },
      { to: "/register", label: "Create Account", icon: Users, roles: ["guest"] },
    ],
  },
];

const Sidebar = ({ isCollapsed, isMobileOpen, onMobileClose, onToggleCollapse }) => {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role || "guest";

  const visibleGroups = useMemo(
    () =>
      navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.roles.includes(role)),
        }))
        .filter((group) => group.items.length > 0),
    [role]
  );

  const handleLogout = () => {
    logout();
    onMobileClose();
  };

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={onMobileClose}
        />
      )}

      <aside className="sidebar" aria-label="Primary navigation">
        {/* Sidebar Header with Logo & Collapse Toggle */}
        <div className="sidebar-header">
          <Link to="/" className="brand-mark" onClick={onMobileClose} title="Home">
            DS
          </Link>
          
          {!isCollapsed && (
            <div className="brand-title">
              <strong>Real Estate Manager</strong>
              <span>Davis &amp; Shirtliff</span>
            </div>
          )}

          {/* Desktop Collapse/Expand Toggle Button */}
          <button
            type="button"
            className="sidebar-toggle"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronLeft size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* Mobile Close Button (X) */}
          <button
            type="button"
            className="sidebar-close-mobile"
            onClick={onMobileClose}
            aria-label="Close navigation"
            title="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          {visibleGroups.map((group) => (
            <div key={group.label}>
              {!isCollapsed && <div className="nav-group-label">{group.label}</div>}
              <div className="nav-group">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
                      onClick={onMobileClose}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon size={20} className="nav-icon" strokeWidth={1.5} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sign Out Button */}
        {user && (
          <div className="sidebar-footer">
            <button
              type="button"
              className="dashboard-btn dashboard-btn--outline full-width"
              onClick={handleLogout}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <LogOut size={20} strokeWidth={1.5} />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
