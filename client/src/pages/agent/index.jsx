import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import API from "../../api";
import DashboardTabs from "../../components/dashboard/DashboardTabs";
import StatCards from "../../components/dashboard/StatCards";
import OccupancyTab from "../../components/dashboard/OccupancyTab";
import RentRollTab from "../../components/dashboard/RentRollTab";
import ExpensesTab from "../../components/dashboard/ExpensesTab";
import OperationsTab from "../../components/dashboard/OperationsTab";
import InquiriesTab from "../../components/dashboard/InquiriesTab";
import AssignmentsTab from "../../components/dashboard/AssignmentsTab";

import AgentDashboardHeader from "./AgentDashboardHeader";
import AgentAnalyticsStrip from "./AgentAnalyticsStrip";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import ConfirmModal from "../../components/ui/ConfirmModal";

const AgentDashboard = () => {
  const [data, setData] = useState(null);
  const [registeredTenants, setRegisteredTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "occupancy"
  );

  const [selectedTenantMap, setSelectedTenantMap] = useState({});
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "repairs",
    amount: "",
    isLiability: false,
  });
  const [confirm, setConfirm] = useState(null);

  // ----- Data Fetching -----
  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const [overviewRes, tenantsRes] = await Promise.all([
        API.get("/agent/overview"),
        API.get("/agent/tenants"),
      ]);
      setData(overviewRes.data.data);
      setRegisteredTenants(tenantsRes.data.data || []);
    } catch (err) {
      console.error("Failed to load agent dashboard data:", err);
      setError("Could not load your dashboard. Please check your connection.");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ----- Actions with Sonner Notifications -----
  const handleAssignTenant = async (propertyId) => {
    const tenantUserId = selectedTenantMap[propertyId];
    if (!tenantUserId) {
      toast.error("Please select a registered tenant from the dropdown first.");
      return;
    }
    try {
      await API.put(`/agent/properties/${propertyId}/assign`, { tenantUserId });
      toast.success("Property unit assigned to tenant successfully.");
      fetchDashboardData();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to assign unit to tenant.");
    }
  };

  const handleUnassignTenant = async (propertyId) => {
    setConfirm({
      message:
        "Are you sure you want to unassign the tenant and mark this unit as vacant?",
      onConfirm: async () => {
        setConfirm(null);
        try {
          await API.put(`/agent/properties/${propertyId}/unassign`);
          toast.success("Unit has been marked as vacant.");
          fetchDashboardData();
        } catch (err) {
          toast.error("Failed to unassign tenant. Please retry.");
        }
      },
    });
  };

  const handleSelectTenant = (propertyId, tenantUserId) => {
    setSelectedTenantMap((current) => ({
      ...current,
      [propertyId]: tenantUserId,
    }));
  };

  const handleUpdateTenant = async (e, propertyId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await API.put(`/agent/properties/${propertyId}/occupancy`, {
        tenantName: formData.get("tenantName"),
        tenantPhone: formData.get("tenantPhone"),
        rentPaid: formData.get("rentPaid"),
        rentArrears: formData.get("rentArrears"),
      });
      toast.success("Tenant rent roll updated successfully.");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update tenant information.");
    }
  };

  const handleUpdateOperations = async (e, propertyId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await API.put(`/agent/properties/${propertyId}/operations`, {
        electricityMeter: formData.get("electricityMeter"),
        wifiStatus: formData.get("wifiStatus"),
        repairStatus: formData.get("repairStatus"),
        repairNotes: formData.get("repairNotes"),
      });
      toast.success("Utilities and repair status updated.");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update operations.");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await API.post("/agent/expenses", expenseForm);
      setExpenseForm({
        title: "",
        category: "repairs",
        amount: "",
        isLiability: false,
      });
      toast.success("Financial record added successfully.");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to record expense. Please check all fields.");
    }
  };

  const handleExpenseFormChange = (field, value) => {
    setExpenseForm((current) => ({ ...current, [field]: value }));
  };

  // Keyboard navigation between tabs
  const handleTabKeyDown = useCallback(
    (e) => {
      const tabKeys = [
        "occupancy",
        "rentroll",
        "financials",
        "operations",
        "inquiries",
        "assignments",
      ];
      const idx = tabKeys.indexOf(activeTab);
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveTab(tabKeys[(idx + 1) % tabKeys.length]);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveTab(tabKeys[(idx - 1 + tabKeys.length) % tabKeys.length]);
      }
    },
    [activeTab]
  );

  const { financials, properties, expenses, inquiries } = data || {
    financials: {},
    properties: [],
    expenses: [],
    inquiries: [],
  };

  const totalUnits = properties.length;
  const occupiedUnits = properties.filter((p) => p.status === "occupied").length;
  const vacantUnits = totalUnits - occupiedUnits;
  const occupancyRate =
    totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const pendingRepairs = properties.filter(
    (p) => p.repairStatus === "pending" || p.repairStatus === "in_progress"
  ).length;

  const tabs = [
    { key: "occupancy", label: "Assign Units", count: properties.length },
    { key: "rentroll", label: "Rent Roll", count: 0 },
    { key: "financials", label: "Expenses", count: expenses.length },
    { key: "operations", label: "Operations", count: 0 },
    { key: "inquiries", label: "Inquiries", count: inquiries.length },
    { key: "assignments", label: "Tenant Assignments", count: 0 },
  ];

  if (loading) return <LoadingState />;
  if (error && !data)
    return <ErrorState error={error} onRetry={fetchDashboardData} />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6"
    >
      {/* Confirmation Modal */}
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Header */}
      <AgentDashboardHeader onRefresh={fetchDashboardData} />

      {/* Analytics Strip */}
      <AgentAnalyticsStrip
        occupancyRate={occupancyRate}
        occupiedUnits={occupiedUnits}
        vacantUnits={vacantUnits}
        pendingRepairs={pendingRepairs}
      />

      {/* Financial Stat Cards */}
      <StatCards financials={financials} />

      {/* Tab Navigation Bar */}
      <div
        className="w-full overflow-x-auto pb-1"
        role="tablist"
        aria-label="Agent dashboard sections"
        onKeyDown={handleTabKeyDown}
      >
        <DashboardTabs
          activeTab={activeTab}
          onChange={(key) => setActiveTab(key)}
          tabs={tabs}
        />
      </div>

      {/* Animated Tab Panels */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "occupancy" && (
            <OccupancyTab
              properties={properties}
              registeredTenants={registeredTenants}
              selectedTenantMap={selectedTenantMap}
              onAssignTenant={handleAssignTenant}
              onUnassignTenant={handleUnassignTenant}
              onSelectTenant={handleSelectTenant}
            />
          )}

          {activeTab === "rentroll" && (
            <RentRollTab
              properties={properties}
              onUpdateTenant={handleUpdateTenant}
            />
          )}

          {activeTab === "financials" && (
            <ExpensesTab
              expenses={expenses}
              expenseForm={expenseForm}
              onExpenseFormChange={handleExpenseFormChange}
              onSubmitExpense={handleAddExpense}
            />
          )}

          {activeTab === "operations" && (
            <OperationsTab
              properties={properties}
              onUpdateOperations={handleUpdateOperations}
            />
          )}

          {activeTab === "assignments" && (
            <AssignmentsTab
              registeredTenants={registeredTenants}
              onUnitsChanged={fetchDashboardData}
            />
          )}

          {activeTab === "inquiries" && (
            <InquiriesTab inquiries={inquiries} />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AgentDashboard;