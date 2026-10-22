import React, { useState, useEffect, useMemo } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebarCollapsed") === "true";
    } catch {
      return false;
    }
  });
  const { pathname } = useLocation();

  const breadcrumb = useMemo(() => {
    if (pathname === "/") return "Workspace / Property Portfolio";

    const segments = pathname
      .replace(/^\//, "")
      .split("/")
      .filter(Boolean)
      .map((segment) =>
        segment
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      );

    return `Workspace / ${segments.join(" / ")}`;
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMobileOpen]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    if (!isMobileOpen) return undefined;
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isMobileOpen]);

  // Reset mobile drawer on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileOpen]);

  const closeMobile = () => setIsMobileOpen(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebarCollapsed", String(next));
      } catch (err) {
        console.warn("Unable to save sidebar state to localStorage:", err);
      }
      return next;
    });
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen((prev) => !prev);
    } else {
      toggleCollapse();
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground antialiased transition-colors duration-200 selection:bg-brand-blue/25">
      {/* Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-brand-blue focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-float focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Sidebar Component */}
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onMobileClose={closeMobile}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Content Area - Responsive padding matches sidebar width */}
      <div
        className={`flex min-h-screen min-w-0 flex-1 flex-col transition-[padding] duration-300 ease-in-out ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Navbar */}
        <Navbar onToggleSidebar={toggleSidebar} breadcrumb={breadcrumb} />

        {/* Page Main Content */}
        <main
          id="main-content"
          className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8"
          role="main"
        >
          <Outlet />
        </main>

        {/* Footer */}
        <footer
          className="mt-auto border-t border-border bg-card/60 py-4 backdrop-blur-md transition-colors"
          role="contentinfo"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
            <span className="font-medium text-text-secondary">
              © {new Date().getFullYear()} Davis &amp; Shirtliff Real Estate
              Manager.
            </span>
            <span>All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
