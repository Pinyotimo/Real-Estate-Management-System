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
    if (!isMobileOpen) return;
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
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col transition-colors duration-200">
      {/* Skip to Content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-indigo-600 focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
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

      {/* Main Content Area - Responsive padding perfectly matches sidebar width */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-[padding] duration-300 ease-in-out ${
          isCollapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        {/* Navbar */}
        <Navbar onToggleSidebar={toggleSidebar} breadcrumb={breadcrumb} />

        {/* Page Main Content */}
        <main
          id="main-content"
          className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"
          role="main"
        >
          <Outlet />
        </main>

        {/* Footer */}
        <footer
          className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md py-4 transition-colors"
          role="contentinfo"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              © {new Date().getFullYear()} Davis &amp; Shirtliff Real Estate Manager.
            </span>
            <span className="text-slate-500 dark:text-slate-500">
              All rights reserved.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;