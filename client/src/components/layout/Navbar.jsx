import React, { useContext, useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, User, Settings, LogOut, ChevronDown } from "lucide-react";
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
  "/profile": "My Profile",
  "/settings": "Settings",
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

const Navbar = ({ breadcrumb = "Workspace" }) => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pageTitle =
    routeTitles[pathname] ||
    (pathname.startsWith("/properties/") ? "Property Details" : "Workspace");

  useEffect(() => {
    if (!isDropdownOpen) return;
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
        return "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/80";
      case "agent":
      case "manager":
        return "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80";
      case "tenant":
        return "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80";
      default:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors duration-200 px-4 sm:px-6 py-3">
      <div className="w-full flex items-center justify-between gap-4">
        {/* Left Section: Breadcrumb & Title */}
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate">
            {breadcrumb}
          </span>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Right Section: Actions & User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Search Bar */}
          <div className="hidden md:flex items-center relative w-48 lg:w-64">
            <Search className="w-4 h-4 absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="search"
              placeholder="Search properties, tenants..."
              aria-label="Search properties and tenants"
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800/60 border border-transparent dark:border-slate-700/60 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
            />
          </div>

          {/* Notifications */}
          <NotificationBell />

          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all cursor-pointer outline-none"
            >
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user?.name || "User Avatar"}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {getInitials(user?.name)}
                </div>
              )}

              <div className="hidden sm:flex flex-col text-left max-w-[120px] lg:max-w-[160px]">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {user?.name || "Guest User"}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {user?.username ? `@${user.username}` : user?.email || "guest"}
                </span>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 hidden sm:block ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name || "Guest User"}
                  </p>
                  {user?.username && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                      @{user.username}
                    </p>
                  )}
                  {user?.email && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {user.email}
                    </p>
                  )}
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getRoleBadgeColor(
                        user?.role
                      )}`}
                    >
                      {user?.role || "guest"}
                    </span>
                  </div>
                </div>

                <div className="p-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => goTo("/profile")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => goTo("/settings")}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <div className="p-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
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
};

export default Navbar;