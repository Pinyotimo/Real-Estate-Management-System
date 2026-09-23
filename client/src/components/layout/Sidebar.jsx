import React, { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useFavourites } from "../../context/FavouritesContext";
import {
  LayoutDashboard,
  Heart,
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
  Menu,
  Building2,
} from "lucide-react";

const navGroups = [
  {
    label: "Workspace",
    items: [
      {
        to: "/",
        label: "Properties",
        icon: LayoutDashboard,
        roles: ["guest", "tenant", "agent", "admin"],
      },
      {
        to: "/favourites",
        label: "Favourites",
        icon: Heart,
        roles: ["guest", "tenant", "agent", "admin"],
        hasBadge: true, // Flag to render favourites count badge
      },
      {
        to: "/add",
        label: "Add Property",
        icon: PlusSquare,
        roles: ["agent", "admin"],
      },
      {
        to: "/my-properties",
        label: "My Properties",
        icon: Home,
        roles: ["agent", "admin"],
      },
      {
        to: "/agent-dashboard",
        label: "Agent Dashboard",
        icon: BarChart3,
        roles: ["agent", "admin"],
      },
      {
        to: "/tenant-dashboard",
        label: "Tenant Portal",
        icon: Key,
        roles: ["tenant"],
      },
      {
        to: "/admin",
        label: "Admin Dashboard",
        icon: Shield,
        roles: ["admin"],
      },
    ],
  },
  {
    label: "Activity",
    items: [
      {
        to: "/notifications",
        label: "Notifications",
        icon: Bell,
        roles: ["guest", "tenant", "agent", "admin"],
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        to: "/login",
        label: "Sign In",
        icon: Users,
        roles: ["guest"],
      },
      {
        to: "/register",
        label: "Create Account",
        icon: Users,
        roles: ["guest"],
      },
    ],
  },
];

const Sidebar = ({
  isCollapsed = false,
  isMobileOpen = false,
  onMobileClose,
  onToggleCollapse,
}) => {
  const { user, logout } = useContext(AuthContext);
  const { count: favouritesCount } = useFavourites();
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
    if (logout) logout();
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <button
          type="button"
          tabIndex={-1}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity cursor-pointer border-none outline-none"
          aria-label="Close navigation"
          onClick={onMobileClose}
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside
        aria-label="Primary navigation"
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 ease-in-out ${
          // Mobile Drawer Slide Transforms
          isMobileOpen
            ? "translate-x-0 w-64 shadow-2xl"
            : "-translate-x-full lg:translate-x-0"
        } ${
          // Desktop Width Collapsed vs Expanded
          isCollapsed ? "lg:w-20" : "lg:w-64"
        }`}
      >
        {/* Header Section: Brand & Controls */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={onMobileClose}
            title="Home"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20 group-hover:bg-indigo-700 dark:group-hover:bg-indigo-400 transition-colors shrink-0">
              <Building2 className="w-5 h-5" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight leading-tight truncate">
                  D&amp;S Realtor
                </span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Real Estate
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onMobileClose}
            className="flex lg:hidden items-center justify-center p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close navigation"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Group Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {visibleGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {group.label}
                </div>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isFavouritesItem = item.hasBadge;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      onClick={onMobileClose}
                      title={isCollapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40 shadow-2xs"
                            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent"
                        } ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`
                      }
                    >
                      <div className="relative flex items-center justify-center">
                        <Icon className="w-5 h-5 shrink-0" strokeWidth={1.75} />
                        {/* Collapsed view badge indicator */}
                        {isCollapsed && isFavouritesItem && favouritesCount > 0 && (
                          <span className="absolute -top-1 -right-1.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                          </span>
                        )}
                      </div>

                      {!isCollapsed && (
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="truncate">{item.label}</span>
                          {/* Expanded view numeric count badge */}
                          {isFavouritesItem && favouritesCount > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-bold leading-none text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900/40 rounded-full">
                              {favouritesCount}
                            </span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer: User Logout */}
        {user && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
            <button
              type="button"
              onClick={handleLogout}
              title={isCollapsed ? "Sign Out" : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer ${
                isCollapsed ? "lg:justify-center lg:px-0" : ""
              }`}
            >
              <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.75} />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool,
  isMobileOpen: PropTypes.bool,
  onMobileClose: PropTypes.func,
  onToggleCollapse: PropTypes.func,
};

export default Sidebar;