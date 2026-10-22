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
        hasBadge: true,
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
          className="fixed inset-0 z-40 cursor-pointer border-none bg-black/60 backdrop-blur-sm outline-none transition-opacity lg:hidden"
          aria-label="Close navigation"
          onClick={onMobileClose}
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside
        aria-label="Primary navigation"
        className={`fixed bottom-0 left-0 top-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out ${
          isMobileOpen
            ? "translate-x-0 w-64 shadow-float"
            : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Header Section: Brand & Controls */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <Link
            to="/landing"
            className="group flex min-w-0 items-center gap-3 focus:outline-none"
            onClick={onMobileClose}
            title="Marketing site"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-blue text-white shadow-soft transition-colors group-hover:bg-brand-blue-dark">
              <Building2 className="h-5 w-5" />
            </div>

            {!isCollapsed && (
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-base font-extrabold leading-tight tracking-tight text-foreground">
                  D&amp;S Realtor
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Real Estate
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-soft hover:text-text-primary lg:flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onMobileClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-surface-soft hover:text-text-primary lg:hidden"
            aria-label="Close menu"
            title="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Group Items */}
        <nav className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {visibleGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!isCollapsed && (
                <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
                        `relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? "border-brand-blue/20 bg-brand-very-light-blue text-brand-blue shadow-xs"
                            : "border-transparent text-text-secondary hover:bg-surface-soft hover:text-foreground"
                        } ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`
                      }
                    >
                      <div className="relative flex items-center justify-center">
                        <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                        {/* Collapsed view badge indicator */}
                        {isCollapsed && isFavouritesItem && favouritesCount > 0 && (
                          <span className="absolute -right-1.5 -top-1 flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-500" />
                          </span>
                        )}
                      </div>

                      {!isCollapsed && (
                        <div className="flex min-w-0 flex-1 items-center justify-between">
                          <span className="truncate">{item.label}</span>
                          {/* Expanded view numeric count badge */}
                          {isFavouritesItem && favouritesCount > 0 && (
                            <span className="ml-auto inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold leading-none text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/80 dark:text-rose-400">
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
          <div className="shrink-0 border-t border-border p-3">
            <button
              type="button"
              onClick={handleLogout}
              title={isCollapsed ? "Sign Out" : undefined}
              className={`flex w-full items-center gap-3 rounded-xl border border-rose-200/70 bg-rose-50/50 px-3 py-2.5 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/50 ${
                isCollapsed ? "lg:justify-center lg:px-0" : ""
              }`}
            >
              <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.75} />
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
