import { useEffect, useState } from "react";
import API from "../../../api";
import DashboardTabs from "../../../components/dashboard/DashboardTabs";
import StatCards from "../../../components/dashboard/StatCards";
import OccupancyTab from "../../../components/dashboard/OccupancyTab";
import RentRollTab from "../../../components/dashboard/RentRollTab";
import ExpensesTab from "../../../components/dashboard/ExpensesTab";
import OperationsTab from "../../../components/dashboard/OperationsTab";
import InquiriesTab from "../../../components/dashboard/InquiriesTab";

const AgentDashboard = () => {
  const [data, setData] = useState(null);
  const [registeredTenants, setRegisteredTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("occupancy");
  const [selectedTenantMap, setSelectedTenantMap] = useState({});
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "repairs",
    amount: "",
    isLiability: false,
  });

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
      setError("Could not load your dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAssignTenant = async (propertyId) => {
    const tenantUserId = selectedTenantMap[propertyId];
    if (!tenantUserId) {
      return alert("Please select a registered tenant or buyer from the list.");
    }

    try {
      await API.put(`/agent/properties/${propertyId}/assign`, { tenantUserId });
      alert("✅ Property/Unit assigned to tenant successfully!");
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign unit to tenant.");
    }
  };

  const handleUnassignTenant = async (propertyId) => {
    if (
      window.confirm(
        "Are you sure you want to unassign the tenant and mark this unit as vacant?",
      )
    ) {
      try {
        await API.put(`/agent/properties/${propertyId}/unassign`);
        alert("Unit is now marked as vacant.");
        fetchDashboardData();
      } catch (err) {
        alert("Failed to unassign tenant.");
      }
    }
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
      alert("Tenant rent roll updated!");
      fetchDashboardData();
    } catch (err) {
      alert("Failed to update tenant info");
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
      alert("Utilities & repair status updated!");
      fetchDashboardData();
    } catch (err) {
      alert("Failed to update operations");
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
      alert("Financial record added!");
      fetchDashboardData();
    } catch (err) {
      alert("Failed to record expense");
    }
  };

  const handleExpenseFormChange = (field, value) => {
    setExpenseForm((current) => ({ ...current, [field]: value }));
  };

  const { financials, properties, expenses, inquiries } = data || {
    financials: {},
    properties: [],
    expenses: [],
    inquiries: [],
  };

  // ----- Occupancy analytics computed from properties -----
  const totalUnits = properties.length;
  const occupiedUnits = properties.filter((p) => p.status === "occupied").length;
  const vacantUnits = totalUnits - occupiedUnits;
  const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
  const pendingRepairs = properties.filter((p) => p.repairStatus === "pending" || p.repairStatus === "in_progress").length;

  const tabs = [
    {
      key: "occupancy",
      label: `🏡 Assign Units & Vacancy (${properties.length})`,
    },
    { key: "rentroll", label: "💰 Rent Roll & Arrears" },
    {
      key: "financials",
      label: `📉 Expenses & Liabilities (${expenses.length})`,
    },
    { key: "operations", label: "⚡ Electricity, WiFi & Repairs" },
    {
      key: "inquiries",
      label: `💬 Messages / Inquiries (${inquiries.length})`,
    },
  ];

  return (
    <>
      <style>{`
        .agent-dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .agent-dashboard-refresh {
          font-size: 0.85rem;
          color: var(--text-muted);
          background: none;
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 0.4rem 0.8rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .agent-dashboard-refresh:hover {
          background: var(--surface-soft);
          color: var(--text-primary);
        }

        /* Analytics strip */
        .analytics-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .analytics-cell {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .analytics-cell-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .analytics-cell-value {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text-primary);
        }
        .occupancy-bar-track {
          height: 6px;
          background: var(--border-light);
          border-radius: 4px;
          overflow: hidden;
          margin-top: 0.15rem;
        }
        .occupancy-bar-fill {
          height: 100%;
          background: var(--success);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        /* Nav wrapper for tabs */
        .agent-nav-wrapper {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 0.5rem 0.5rem 0;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow-sm);
        }

        /* Skeleton loading */
        .agent-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }
        .agent-skeleton-card {
          height: 90px;
          border-radius: var(--radius);
        }
        .agent-skeleton-tabs {
          height: 44px;
          border-radius: var(--radius);
          margin-bottom: 1.5rem;
        }
        .agent-skeleton-body {
          height: 260px;
          border-radius: var(--radius);
        }

        .agent-error-panel {
          text-align: center;
          max-width: 480px;
          margin: 3rem auto;
        }
      `}</style>

      <div className="dashboard-shell">
        <div className="agent-dashboard-header">
          <h2 className="dashboard-title" style={{ margin: 0 }}>
            🏢 Agent & Landlord ERP Dashboard
          </h2>
          {!loading && !error && (
            <button className="agent-dashboard-refresh" onClick={fetchDashboardData}>
              🔄 Refresh Data
            </button>
          )}
        </div>

        {error ? (
          <div className="agent-error-panel">
            <div className="dashboard-panel">
              <p className="auth-error" style={{ display: "inline-block" }}>
                {error}
              </p>
              <div style={{ marginTop: "1rem" }}>
                <button className="dashboard-btn" onClick={fetchDashboardData}>
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : loading ? (
          <>
            <div className="agent-skeleton-grid">
              <div className="agent-skeleton-card animate-shimmer" />
              <div className="agent-skeleton-card animate-shimmer" />
              <div className="agent-skeleton-card animate-shimmer" />
              <div className="agent-skeleton-card animate-shimmer" />
            </div>
            <div className="agent-skeleton-tabs animate-shimmer" />
            <div className="agent-skeleton-body animate-shimmer" />
          </>
        ) : (
          <>
            {/* Quick occupancy analytics */}
            <div className="analytics-strip">
              <div className="analytics-cell">
                <span className="analytics-cell-label">Occupancy Rate</span>
                <span className="analytics-cell-value">{occupancyRate}%</span>
                <div className="occupancy-bar-track">
                  <div className="occupancy-bar-fill" style={{ width: `${occupancyRate}%` }} />
                </div>
              </div>
              <div className="analytics-cell">
                <span className="analytics-cell-label">Occupied Units</span>
                <span className="analytics-cell-value" style={{ color: "var(--success)" }}>
                  {occupiedUnits}
                </span>
              </div>
              <div className="analytics-cell">
                <span className="analytics-cell-label">Vacant Units</span>
                <span className="analytics-cell-value" style={{ color: "var(--danger)" }}>
                  {vacantUnits}
                </span>
              </div>
              <div className="analytics-cell">
                <span className="analytics-cell-label">Repairs Pending</span>
                <span className="analytics-cell-value" style={{ color: "var(--warning)" }}>
                  {pendingRepairs}
                </span>
              </div>
            </div>

            {/* Financial stat cards */}
            <StatCards financials={financials} />

            {/* Tab navigation */}
            <div className="agent-nav-wrapper">
              <DashboardTabs activeTab={activeTab} onChange={setActiveTab} tabs={tabs} />
            </div>

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
              <RentRollTab properties={properties} onUpdateTenant={handleUpdateTenant} />
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
              <OperationsTab properties={properties} onUpdateOperations={handleUpdateOperations} />
            )}

            {activeTab === "inquiries" && <InquiriesTab inquiries={inquiries} />}
          </>
        )}
      </div>
    </>
  );
};

export default AgentDashboard;