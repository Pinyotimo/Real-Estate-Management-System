import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );
  const { pathname } = useLocation();

  const breadcrumb =
    pathname === "/"
      ? "Workspace / Property Portfolio"
      : `Workspace / ${pathname
          .replace(/^\//, "")
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())}`;

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Handle Escape key to close mobile sidebar
  useEffect(() => {
    if (!isMobileOpen) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen]);

  const closeMobile = () => setIsMobileOpen(false);

  const toggleSidebar = () => {
    const isMobile = window.innerWidth < 1024;

    if (isMobile) {
      // On mobile: toggle overlay visibility
      setIsMobileOpen((prev) => !prev);
    } else {
      // On desktop: collapse/expand sidebar
      toggleCollapse();
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebarCollapsed", String(next));
      return next;
    });
  };

  return (
    <div
      className={`app-frame${isMobileOpen ? " sidebar-open" : ""}${
        isCollapsed ? " sidebar-collapsed" : ""
      }`}
    >
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onMobileClose={closeMobile}
        onToggleCollapse={toggleCollapse}
      />

      <Navbar onToggleSidebar={toggleSidebar} breadcrumb={breadcrumb} />

      <div className="app-content">
        <main className="app-main">
          <Outlet />
        </main>
        <footer className="app-footer">
          © {new Date().getFullYear()} Davis &amp; Shirtliff Real Estate Manager. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Layout;
