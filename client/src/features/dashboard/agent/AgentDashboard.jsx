import { useEffect, useState, useCallback } from "react";
import API from "../../../api";
import DashboardTabs from "../../../components/dashboard/DashboardTabs";
import StatCards from "../../../components/dashboard/StatCards";
import OccupancyTab from "../../../components/dashboard/OccupancyTab";
import RentRollTab from "../../../components/dashboard/RentRollTab";
import ExpensesTab from "../../../components/dashboard/ExpensesTab";
import OperationsTab from "../../../components/dashboard/OperationsTab";
import InquiriesTab from "../../../components/dashboard/InquiriesTab";

// ─── Inline Confirmation Modal ──────────────────────
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
  <div style={{
    position: "fixed",
    inset: 0,
    zIndex: 50,
    display: "grid",
    placeItems: "center",
    background: "rgba(15, 23, 42, 0.45)",
    backdropFilter: "blur(4px)",
    padding: "1rem"
  }}>
    <div className="dashboard-card animate-fade-in" style={{
      maxWidth: "420px",
      width: "100%",
      padding: "1.5rem",
      border: "1px solid var(--border)",
      boxShadow: "var(--shadow-lg)"
    }}>
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        background: "var(--warning-soft)",
        display: "grid",
        placeItems: "center",
        marginBottom: "1rem",
        color: "var(--brand-black)"
      }}>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
        Confirm Action
      </h3>
      <p style={{ fontSize: "0.9rem", color: "var(--text-subtle)", margin: "0 0 1.25rem", lineHeight: 1.5 }}>
        {message}
      </p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
        <button onClick={onCancel} className="dashboard-btn dashboard-btn--ghost" style={{ minHeight: "38px" }}>
          Cancel
        </button>
        <button onClick={onConfirm} className="dashboard-btn dashboard-btn--danger" style={{ minHeight: "38px" }}>
          Confirm
        </button>
      </div>
    </div>
  </div>
);

const AgentDashboard = () => {
  const [data, setData] = useState(null);
  const [registeredTenants, setRegisteredTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("occupancy");
  const [selectedTenantMap, setSelectedTenantMap] = useState({});
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "repairs",
    amount: "",
    isLiability: false,
  });
  const [confirm, setConfirm] = useState(null);

  const clearFeedback = () => {
    setError("");
    setSuccess("");
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    clearFeedback();
    try {
      const [overviewRes, tenantsRes] = await Promise.all([
        API.get("/agent/overview"),
        API.get("/agent/tenants"),
      ]);
      setData(overviewRes.data.data);
      setRegisteredTenants(tenantsRes.data.data || []);
    } catch (err) {
      console.error("Failed to load agent dashboard data:", err);
      setError("Could not load your dashboard. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAssignTenant = async (propertyId) => {
    clearFeedback();
    const tenantUserId = selectedTenantMap[propertyId];
    if (!tenantUserId) {
      setError("Please select a registered tenant from the dropdown before assigning.");
      return;
    }
    try {
      await API.put(`/agent/properties/${propertyId}/assign`, { tenantUserId });
      setSuccess("Property unit assigned to tenant successfully.");
      fetchDashboardData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to assign unit to tenant.");
    }
  };

  const handleUnassignTenant = async (propertyId) => {
    clearFeedback();
    setConfirm({
      message: "Are you sure you want to unassign the tenant and mark this unit as vacant?",
      onConfirm: async () => {
        setConfirm(null);
        try {
          await API.put(`/agent/properties/${propertyId}/unassign`);
          setSuccess("Unit has been marked as vacant.");
          fetchDashboardData();
        } catch (err) {
          setError("Failed to unassign tenant. Please retry.");
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
    clearFeedback();
    const formData = new FormData(e.target);
    try {
      await API.put(`/agent/properties/${propertyId}/occupancy`, {
        tenantName: formData.get("tenantName"),
        tenantPhone: formData.get("tenantPhone"),
        rentPaid: formData.get("rentPaid"),
        rentArrears: formData.get("rentArrears"),
      });
      setSuccess("Tenant rent roll updated successfully.");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setError("Failed to update tenant information.");
    }
  };

  const handleUpdateOperations = async (e, propertyId) => {
    e.preventDefault();
    clearFeedback();
    const formData = new FormData(e.target);
    try {
      await API.put(`/agent/properties/${propertyId}/operations`, {
        electricityMeter: formData.get("electricityMeter"),
        wifiStatus: formData.get("wifiStatus"),
        repairStatus: formData.get("repairStatus"),
        repairNotes: formData.get("repairNotes"),
      });
      setSuccess("Utilities and repair status updated.");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setError("Failed to update operations.");
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    clearFeedback();
    try {
      await API.post("/agent/expenses", expenseForm);
      setExpenseForm({
        title: "",
        category: "repairs",
        amount: "",
        isLiability: false,
      });
      setSuccess("Financial record added successfully.");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      setError("Failed to record expense. Please check all fields.");
    }
  };

  const handleExpenseFormChange = (field, value) => {
    setExpenseForm((current) => ({ ...current, [field]: value }));
  };

  const handleTabKeyDown = useCallback((e) => {
    const tabKeys = ["occupancy", "rentroll", "financials", "operations", "inquiries"];
    const idx = tabKeys.indexOf(activeTab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveTab(tabKeys[(idx + 1) % tabKeys.length]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveTab(tabKeys[(idx - 1 + tabKeys.length) % tabKeys.length]);
    }
  }, [activeTab]);

  const { financials, properties, expenses, inquiries } = data || {
    financials: {},
    properties: [],
    expenses: [],
    inquiries: [],
  };

  const totalUnits = properties.length;
  const occupiedUnits = properties.filter((p) => p.status === "occupied").length;
  const vacantUnits = totalUnits - occupiedUnits;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const pendingRepairs = properties.filter(
    (p) => p.repairStatus === "pending" || p.repairStatus === "in_progress"
  ).length;

  const tabs = [
    { key: "occupancy", label: "Assign Units", count: properties.length },
    { key: "rentroll", label: "Rent Roll", count: 0 },
    { key: "financials", label: "Expenses", count: expenses.length },
    { key: "operations", label: "Operations", count: 0 },
    { key: "inquiries", label: "Inquiries", count: inquiries.length },
  ];

  // ─── Loading Skeleton ─────────────────────────────
  if (loading) {
    return (
      <div className="dashboard-shell">
        <div className="agent-dashboard-header" style={{ marginBottom: "1rem" }}>
          <div className="animate-shimmer" style={{ width: "300px", height: "28px", borderRadius: "var(--radius-sm)" }} />
          <div className="animate-shimmer" style={{ width: "100px", height: "38px", borderRadius: "var(--radius-sm)" }} />
        </div>
        <div className="analytics-strip" style={{ marginBottom: "1.25rem" }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-shimmer" style={{ height: "90px", borderRadius: "var(--radius)" }} />
          ))}
        </div>
        <div className="animate-shimmer" style={{ height: "120px", borderRadius: "var(--radius)", marginBottom: "1.25rem" }} />
        <div className="animate-shimmer" style={{ height: "44px", borderRadius: "var(--radius)", marginBottom: "1.25rem" }} />
        <div className="animate-shimmer" style={{ height: "320px", borderRadius: "var(--radius)" }} />
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────
  if (error && !data) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-panel agent-error-panel animate-fade-in">
          <div style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "var(--danger-soft)",
            display: "grid",
            placeItems: "center",
            margin: "0 auto 1rem",
            color: "var(--brand-black)"
          }}>
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
            Dashboard Unavailable
          </p>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.25rem", maxWidth: "360px" }}>
            {error}
          </p>
          <button className="dashboard-btn" onClick={fetchDashboardData}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell animate-fade-in">
      {/* Confirmation Modal */}
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Header */}
      <div className="agent-dashboard-header">
        <div>
          <h2 className="dashboard-title" style={{ margin: 0 }}>Agent & Landlord Dashboard</h2>
          <p className="dashboard-subtitle" style={{ margin: "0.25rem 0 0" }}>
            Manage units, rent roll, expenses, and tenant communications.
          </p>
        </div>
        <button
          className="dashboard-btn dashboard-btn--outline"
          onClick={fetchDashboardData}
          style={{ minHeight: "38px", fontSize: "0.82rem" }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.35rem" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Feedback Banners */}
      {error && (
        <div className="dashboard-panel" style={{
          marginTop: "1rem",
          borderLeft: "4px solid var(--brand-black)",
          background: "var(--danger-soft)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.85rem 1rem"
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--brand-black)" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style={{ fontSize: "0.88rem", fontWeight: 600, flex: 1 }}>{error}</span>
          <button onClick={() => setError("")} className="icon-button" style={{ width: "28px", height: "28px", border: "none", background: "transparent" }} aria-label="Dismiss">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}
      {success && (
        <div className="dashboard-panel" style={{
          marginTop: "1rem",
          borderLeft: "4px solid var(--brand-blue)",
          background: "var(--success-soft)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.85rem 1rem"
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--brand-blue)" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span style={{ fontSize: "0.88rem", fontWeight: 600, flex: 1 }}>{success}</span>
          <button onClick={() => setSuccess("")} className="icon-button" style={{ width: "28px", height: "28px", border: "none", background: "transparent" }} aria-label="Dismiss">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Analytics Strip */}
      <div className="analytics-strip">
        <div className="analytics-cell">
          <span className="analytics-cell-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Occupancy Rate
          </span>
          <span className="analytics-cell-value">{occupancyRate}%</span>
          <div className="occupancy-bar-track">
            <div className="occupancy-bar-fill" style={{ width: `${occupancyRate}%` }} />
          </div>
        </div>
        <div className="analytics-cell">
          <span className="analytics-cell-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Occupied Units
          </span>
          <span className="analytics-cell-value">{occupiedUnits}</span>
        </div>
        <div className="analytics-cell">
          <span className="analytics-cell-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Vacant Units
          </span>
          <span className="analytics-cell-value">{vacantUnits}</span>
        </div>
        <div className="analytics-cell">
          <span className="analytics-cell-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Repairs Pending
          </span>
          <span className="analytics-cell-value">{pendingRepairs}</span>
        </div>
      </div>

      {/* Financial Stat Cards */}
      <StatCards financials={financials} />

      {/* Tab Navigation */}
      <div className="agent-nav-wrapper" role="tablist" aria-label="Agent dashboard sections" onKeyDown={handleTabKeyDown}>
        <DashboardTabs activeTab={activeTab} onChange={(key) => { setActiveTab(key); clearFeedback(); }} tabs={tabs} />
      </div>

      {/* Tab Panels */}
      {activeTab === "occupancy" && (
        <div role="tabpanel" id="tabpanel-occupancy" aria-labelledby="tab-occupancy" className="animate-fade-in">
          <OccupancyTab
            properties={properties}
            registeredTenants={registeredTenants}
            selectedTenantMap={selectedTenantMap}
            onAssignTenant={handleAssignTenant}
            onUnassignTenant={handleUnassignTenant}
            onSelectTenant={handleSelectTenant}
          />
        </div>
      )}

      {activeTab === "rentroll" && (
        <div role="tabpanel" id="tabpanel-rentroll" aria-labelledby="tab-rentroll" className="animate-fade-in">
          <RentRollTab properties={properties} onUpdateTenant={handleUpdateTenant} />
        </div>
      )}

      {activeTab === "financials" && (
        <div role="tabpanel" id="tabpanel-financials" aria-labelledby="tab-financials" className="animate-fade-in">
          <ExpensesTab
            expenses={expenses}
            expenseForm={expenseForm}
            onExpenseFormChange={handleExpenseFormChange}
            onSubmitExpense={handleAddExpense}
          />
        </div>
      )}

      {activeTab === "operations" && (
        <div role="tabpanel" id="tabpanel-operations" aria-labelledby="tab-operations" className="animate-fade-in">
          <OperationsTab properties={properties} onUpdateOperations={handleUpdateOperations} />
        </div>
      )}

      {activeTab === "inquiries" && (
        <div role="tabpanel" id="tabpanel-inquiries" aria-labelledby="tab-inquiries" className="animate-fade-in">
          <InquiriesTab inquiries={inquiries} />
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;