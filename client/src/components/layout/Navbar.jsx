// src/components/layout/Navbar.jsx
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Badge from "../common/Badge";

const routeTitles = {
  "/": "Property Portfolio",
  "/add": "Add Property",
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

const Navbar = ({ 
  onToggleSidebar,   // for desktop collapse
  onOpenMobile,      // for mobile drawer
  sidebarCollapsed   // to know if it's collapsed for search padding etc.
}) => {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();

  const pageTitle =
    routeTitles[pathname] ||
    (pathname.startsWith("/properties/") ? "Property Details" : "Workspace");

  return (
    <header className="h-16 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/75 sticky top-0 z-30">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          {/* Hamburger – toggles sidebar collapse on desktop, opens drawer on mobile */}
          <button
            type="button"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={onToggleSidebar} // on desktop it will toggle collapse; on mobile it will open drawer via media query
            aria-label="Toggle navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden sm:block">
            <span className="text-sm text-muted-foreground">Workspace / </span>
            <span className="text-sm font-medium text-foreground">{pageTitle}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input
              type="search"
              placeholder="Search properties, tenants, reports"
              className="w-64 rounded-md border border-border bg-muted/50 px-3 py-1.5 pl-8 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label="Search"
            />
            <span className="absolute left-2.5 top-2 text-muted-foreground">🔍</span>
          </div>
          <button
            type="button"
            className="relative p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <span className="text-base">🔔</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full" />
          </button>
          <div className="flex items-center space-x-2 pl-2 border-l border-border">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue text-white text-sm font-medium">
              {getInitials(user?.name)}
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground leading-tight">
                {user?.name || "Guest User"}
              </p>
              <Badge variant={user?.role === 'admin' ? 'default' : 'success'} className="text-xs">
                {user?.role || "guest"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;