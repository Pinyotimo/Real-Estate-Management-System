import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ShieldAlert, BarChart3, Users, Building, AlertOctagon } from "lucide-react";

import AdminStats from "./AdminStats";
import AdminTabs from "./AdminTabs";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import UserTable from "./UserTable";
import SuspendedUsersTable from "./SuspendedUsersTable";
import PropertiesTable from "./PropertiesTable";
import AuditLogList from "./AuditLogList";
import RevenueChart from "@/components/dashboard/RevenueChart";
import API from "../../api";

// ----- MOCK DATA -----
const mockStats = {
  totalUsers: 45,
  totalAgents: 12,
  totalTenants: 33,
};

const mockUsers = [
  {
    _id: "1",
    name: "Alice Smith",
    email: "alice@example.com",
    role: "admin",
    createdAt: "2025-01-01T10:00:00Z",
    lastActiveAt: "2025-01-15T14:30:00Z",
  },
  {
    _id: "2",
    name: "Bob Jones",
    email: "bob@example.com",
    role: "agent",
    createdAt: "2025-01-02T09:00:00Z",
    lastActiveAt: "2025-01-14T16:45:00Z",
  },
  {
    _id: "3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    role: "tenant",
    createdAt: "2025-01-03T08:30:00Z",
    lastActiveAt: "2025-01-13T11:20:00Z",
  },
];

const mockProperties = [
  {
    _id: "101",
    title: "Beachfront Villa",
    estate: "Malindi",
    county: "Kilifi",
    price: 15000000,
    houseType: "Villa",
    createdAt: "2025-01-10T12:00:00Z",
  },
  {
    _id: "102",
    title: "City Apartment",
    estate: "Westlands",
    county: "Nairobi",
    price: 8500000,
    houseType: "Apartment",
    createdAt: "2025-01-12T09:15:00Z",
  },
  {
    _id: "103",
    title: "Riverside Bungalow",
    estate: "Karen",
    county: "Nairobi",
    price: 22000000,
    houseType: "Bungalow",
    createdAt: "2025-01-14T11:45:00Z",
  },
];

const mockSuspendedUsers = [];

const mockAuditLogs = [
  {
    _id: "201",
    actorName: "Alice Smith",
    action: "Logged in",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    _id: "202",
    actorName: "Bob Jones",
    action: "Created property listing 'Beachfront Villa'",
    createdAt: "2025-01-14T15:30:00Z",
  },
  {
    _id: "203",
    actorName: "System",
    action: "User Charlie Brown registered",
    createdAt: "2025-01-13T08:30:00Z",
  },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("analytics");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      try {
        setStats(mockStats);
        setUsers(mockUsers);
        setProperties(mockProperties);
        setSuspendedUsers(mockSuspendedUsers);
        setAuditLogs(mockAuditLogs);
      } catch (err) {
        setError("Failed to load mock data.");
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ---- Interactive Handlers with Toast Feedback ----

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    toast.success(`Role updated to ${newRole}`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Delete user permanently?")) {
      setUsers(users.filter((u) => u._id !== userId));
      toast.success("User account deleted");
    }
  };

  const handleSuspendUser = (userId) => {
    const target = users.find((u) => u._id === userId);
    if (target) {
      setUsers(users.filter((u) => u._id !== userId));
      setSuspendedUsers([...suspendedUsers, { ...target, suspended: true }]);
      toast.warning(`${target.name} has been suspended`);
    }
  };

  const handleUnsuspendUser = (userId) => {
    const target = suspendedUsers.find((u) => u._id === userId);
    if (target) {
      setSuspendedUsers(suspendedUsers.filter((u) => u._id !== userId));
      setUsers([...users, { ...target, suspended: false }]);
      toast.info(`${target.name} account restored`);
    }
  };

  const handleForceLogoutAll = () => {
    if (window.confirm("Are you sure you want to force logout all active users?")) {
      toast.error("All active sessions have been invalidated!");
    }
  };

  const handleDeleteProperty = (propertyId) => {
    if (window.confirm("Delete property listing?")) {
      setProperties(properties.filter((p) => p._id !== propertyId));
      toast.success("Property listing deleted");
    }
  };

  const totalListings = properties.length;
  const totalListingValue = properties.reduce(
    (sum, p) => sum + (Number(p.price) || 0),
    0
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchDashboardData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldAlert className="h-7 w-7 text-primary" />
            System Administration
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage users, role permissions, property listings, and platform revenue
          </p>
        </div>

        <button
          onClick={handleForceLogoutAll}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-destructive hover:bg-destructive/90 rounded-md transition-colors shadow-xs shrink-0"
          aria-label="Force logout all active users"
        >
          <AlertOctagon className="h-4 w-4" />
          Force Logout All Sessions
        </button>
      </div>

      {/* Stats Cards */}
      <AdminStats
        stats={stats}
        totalListings={totalListings}
        totalListingValue={totalListingValue}
        suspendedCount={suspendedUsers.length}
      />

      {/* Tabs Bar */}
      <AdminTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={{
          analytics: "Graphs",
          users: users.length,
          suspended: suspendedUsers.length,
          properties: properties.length,
          audit: auditLogs.length,
        }}
      />

      {/* Animated Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <RevenueChart />
            </div>
          )}

          {activeTab === "users" && (
            <UserTable
              users={users}
              onRoleChange={handleRoleChange}
              onSuspend={handleSuspendUser}
              onDelete={handleDeleteUser}
              formatDateTime={formatDateTime}
            />
          )}

          {activeTab === "suspended" && (
            <SuspendedUsersTable
              suspendedUsers={suspendedUsers}
              onUnsuspend={handleUnsuspendUser}
              formatDateTime={formatDateTime}
            />
          )}

          {activeTab === "properties" && (
            <PropertiesTable
              properties={properties}
              onDelete={handleDeleteProperty}
              formatDateTime={formatDateTime}
            />
          )}

          {activeTab === "audit" && (
            <AuditLogList
              auditLogs={auditLogs}
              formatDateTime={formatDateTime}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// Helper function
const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  const d = new Date(isoString);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default AdminDashboard;