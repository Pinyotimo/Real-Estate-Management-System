import { useContext, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// (Icons remain unchanged – omitted for brevity, but keep them as before)
const Icons = { /* ... same as provided ... */ };

const navGroups = [
  {
    label: "Workspace",
    items: [
      { to: "/", label: "Properties", icon: Icons.properties, roles: ["guest", "tenant", "agent", "admin"] },
      { to: "/add", label: "Add Property", icon: Icons.add, roles: ["agent", "admin"] },
      { to: "/agent-dashboard", label: "Agent Dashboard", icon: Icons.agent, roles: ["agent", "admin"] },
      { to: "/tenant-dashboard", label: "Tenant Portal", icon: Icons.tenant, roles: ["tenant"] },
      { to: "/admin", label: "Admin Dashboard", icon: Icons.admin, roles: ["admin"] },
    ],
  },
  {
    label: "Account",
    items: [
      { to: "/login", label: "Sign In", icon: Icons.login, roles: ["guest"] },
      { to: "/register", label: "Create Account", icon: Icons.register, roles: ["guest"] },
    ],
  },
];

const Sidebar = ({ isCollapsed, isMobileOpen, onMobileClose }) => {
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
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-surface border-r border-border
          transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'w-16' : 'w-64'}
        `}
        aria-label="Primary navigation"
      >
        {/* Brand header */}
        <div className="h-16 flex items-center justify-center border-b border-border">
          <Link to="/" className="flex items-center space-x-2" onClick={onMobileClose}>
            <span className="text-xl font-bold text-brand-blue">DS</span>
            {!isCollapsed && (
              <span className="text-sm font-medium text-foreground leading-tight">
                Real Estate Manager
                <span className="block text-xs font-normal text-muted-foreground">Davis &amp; Shirtliff</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="py-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {visibleGroups.map((group, groupIdx) => (
            <div className="mb-6" key={group.label}>
              {groupIdx > 0 && <div className="h-px bg-border my-4" />}
              {!isCollapsed && (
                <h3 className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.label}
                </h3>
              )}
              <ul className="mt-2">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      className={({ isActive }) => `
                        flex items-center px-4 py-2 text-sm font-medium rounded-md
                        transition-colors duration-150
                        ${isCollapsed ? 'justify-center' : ''}
                        ${isActive
                          ? 'bg-accent text-brand-blue'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        }
                      `}
                      onClick={onMobileClose}
                      aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                    >
                      <span className="text-base" aria-hidden="true">{item.icon}</span>
                      {!isCollapsed && <span className="ml-3">{item.label}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer: Logout */}
        {user && (
          <div className={`px-4 py-4 border-t border-border ${isCollapsed ? 'flex justify-center' : ''}`}>
            <button
              type="button"
              className={`
                inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium
                text-muted-foreground hover:text-foreground hover:bg-muted transition-colors
                ${isCollapsed ? 'w-auto' : 'w-full'}
              `}
              onClick={handleLogout}
            >
              {Icons.logout}
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;