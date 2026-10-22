import React, { useContext, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, User, Settings, LogOut, ChevronDown, Menu } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import NotificationBell from "../Notifications/NotificationBell";
import ThemeToggle from "../ThemeToggle";

const routeTitles = {
  "/": "Property Portfolio",
  "/add": "Add Property",
  "/my-properties": "My Properties",
  "/admin": "Admin Dashboard",
  "/agent-dashboard": "Agent Dashboard",
  "/tenant-dashboard": "Tenant Portal",
  "/notifications": "Notifications",
  "/profile": "My Profile",
  "/settings": "Settings",
  "/login": "Sign In",
  "/register": "Create Account",
  "/landing": "Welcome",
};

const getInitials = (name = "Guest") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const Navbar = ({ breadcrumb = "Workspace", onToggleSidebar }) => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pageTitle =
    routeTitles[pathname] ||
    (pathname.startsWith("/properties/") ? "Property Details" : "Workspace");

  useEffect(() => {
    if (!isDropdownOpen) return undefined;

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isDropdownOpen]);

  const goTo = (path) => {
    setIsDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    if (logout) logout();
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/80";
      case "agent":
      case "manager":
        return "bg-brand-very-light-blue text-brand-blue border-brand-blue/25";
      case "tenant":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80";
      default:
        return "bg-surface-soft text-text-secondary border-border";
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md transition-colors duration-200 sm:px-6">
      <div className="flex w-full items-center justify-between gap-4">
        {/* Mobile sidebar trigger */}
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation sidebar"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Left Section: Breadcrumb & Title */}
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {breadcrumb}
          </span>
          <h1 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
            {pageTitle}
          </h1>
        </div>

        {/* Right Section: Actions & User Dropdown */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Search Bar */}
          <div className="relative hidden w-48 items-center md:flex lg:w-64">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search properties, tenants..."
              aria-label="Search properties and tenants"
              className="w-full rounded-xl border border-transparent bg-surface-soft py-1.5 pl-9 pr-3 text-xs text-foreground transition-all placeholder:text-muted-foreground focus:border-brand-blue focus:bg-card focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
            />
          </div>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <NotificationBell />

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className="flex items-center gap-2.5 rounded-xl border border-transparent p-1 transition-all hover:border-border hover:bg-surface-soft sm:p-1.5"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user?.name || "User Avatar"}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-brand-blue/25 sm:h-9 sm:w-9"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-brand-blue to-brand-blue-dark text-xs font-bold text-white shadow-soft sm:h-9 sm:w-9">
                  {getInitials(user?.name)}
                </div>
              )}

              <div className="hidden min-w-0 max-w-[120px] flex-col text-left sm:flex lg:max-w-[160px]">
                <span className="truncate text-xs font-bold text-foreground">
                  {user?.name || "Guest User"}
                </span>
                <span className="truncate text-[10px] text-muted-foreground">
                  {user?.username ? `@${user.username}` : user?.email || "guest"}
                </span>
              </div>

              <ChevronDown
                className={`hidden h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 sm:block ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 z-50 mt-2 w-60 animate-in fade-in slide-in-from-top-2 rounded-2xl border border-border bg-popover py-2 shadow-float">
                <div className="border-b border-border px-4 py-2">
                  <p className="truncate text-xs font-bold text-foreground">
                    {user?.name || "Guest User"}
                  </p>
                  {user?.username && (
                    <p className="truncate text-[11px] text-muted-foreground">
                      @{user.username}
                    </p>
                  )}
                  {user?.email && (
                    <p className="mt-0.5 truncate text-[11px] text-text-secondary">
                      {user.email}
                    </p>
                  )}
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeColor(
                        user?.role
                      )}`}
                    >
                      {user?.role || "guest"}
                    </span>
                  </div>
                </div>

                <div className="space-y-0.5 p-1">
                  <button
                    type="button"
                    onClick={() => goTo("/profile")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-surface-soft hover:text-foreground"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => goTo("/settings")}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-surface-soft hover:text-foreground"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="my-1 border-t border-border" />

                <div className="p-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-500/10 dark:text-rose-400"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

Navbar.propTypes = {
  breadcrumb: PropTypes.string,
  onToggleSidebar: PropTypes.func,
};

export default Navbar;
