import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const routeTitles = {
  "/": "Property Portfolio",
  "/add": "Add Property",
  "/admin": "Admin Dashboard",
  "/agent-dashboard": "Agent Dashboard",
  "/tenant-dashboard": "Tenant Portal",
  "/login": "Sign In",
  "/register": "Create Account",
};

const Layout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // desktop collapse
  const { pathname } = useLocation();

  // Page title and breadcrumb
  const pageTitle =
    routeTitles[pathname] ||
    (pathname.startsWith("/properties/") ? "Property Details" : "Workspace");

  const breadcrumb = pathname === "/"
    ? "Workspace / Property Portfolio"
    : `Workspace / ${pathname.replace(/^\//, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`;

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Toggle function: on desktop -> collapse, on mobile -> open drawer
  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(true);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        onMobileClose={closeMobile}
      />
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Navbar
          onToggleSidebar={toggleSidebar}
          onOpenMobile={() => setIsMobileOpen(true)}
          sidebarCollapsed={isCollapsed}
          pageTitle={pageTitle}
          breadcrumb={breadcrumb}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
          <footer className="border-t border-border bg-muted/30 py-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Davis &amp; Shirtliff Real Estate Manager. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;