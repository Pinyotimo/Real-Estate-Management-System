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
    try {
      const [overviewRes, tenantsRes] = await Promise.all([
        API.get("/agent/overview"),
        API.get("/agent/tenants"),
      ]);
      setData(overviewRes.data.data);
      setRegisteredTenants(tenantsRes.data.data || []);
    } catch (err) {
      console.error("Failed to load agent dashboard data:", err);
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

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "3rem" }}>
        Loading Landlord Portal...
      </p>
    );
  }

  const { financials, properties, expenses, inquiries } = data || {
    financials: {},
    properties: [],
    expenses: [],
    inquiries: [],
  };

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
    <div className="dashboard-shell">
      <h2 className="dashboard-title">🏢 Agent & Landlord ERP Dashboard</h2>

      <StatCards financials={financials} />
      <DashboardTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={tabs}
      />

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

      {activeTab === "inquiries" && <InquiriesTab inquiries={inquiries} />}
    </div>
  );
};

export default AgentDashboard;
