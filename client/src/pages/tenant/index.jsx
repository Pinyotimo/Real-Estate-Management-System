import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../api";
import DashboardTabs from "../../components/dashboard/DashboardTabs";

import TenantHeader from "./TenantHeader";
import TenantLoading from "./TenantLoading";
import TenantError from "./TenantError";
import TenantPaymentTab from "./TenantPaymentTab";
import TenantComplaintsTab from "./TenantComplaintsTab";
import TenantReceiptsTab from "./TenantReceiptsTab";
import TenantPropertyTab from "./TenantPropertyTab";
import TenantApplicationTab from "./TenantApplicationTab";

const TenantDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchParams] = useSearchParams();
  
  // Initial tab set from search params or fallback
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || null);

  const [payForm, setPayForm] = useState({
    amount: "",
    paymentType: "rent",
    paymentMethod: "mpesa",
  });
  
  const [complaintForm, setComplaintForm] = useState({
    title: "",
    category: "plumbing",
    description: "",
  });

  const clearFeedback = () => {
    setError("");
    setSuccess("");
  };

  const fetchTenantData = async () => {
    setLoading(true);
    clearFeedback();
    try {
      const res = await API.get("/tenant/overview");
      const tenantData = res.data.data;
      setData(tenantData);

      // Smart Tab Auto-Routing: If no tab specified in URL search params,
      // route to "application" if unit is unassigned, otherwise "property"
      if (!searchParams.get("tab")) {
        if (!tenantData?.property) {
          setActiveTab("application");
        } else {
          setActiveTab("property");
        }
      }
    } catch (err) {
      console.error("Error fetching tenant dashboard:", err);
      setError("Could not load your tenant portal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenantData();
  }, []);

  const handleMakePayment = async (e) => {
    e.preventDefault();
    clearFeedback();
    if (!data?.property) {
      setError("No assigned unit found. Contact your property manager.");
      return;
    }
    try {
      await API.post("/tenant/pay", {
        propertyId: data.property._id,
        ...payForm,
      });
      setSuccess(
        `Payment of KES ${Number(payForm.amount).toLocaleString()} submitted successfully.`
      );
      setPayForm({ amount: "", paymentType: "rent", paymentMethod: "mpesa" });
      fetchTenantData();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Payment failed. Please check your balance and try again."
      );
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    clearFeedback();
    if (!data?.property) {
      setError("No assigned unit found. Contact your property manager.");
      return;
    }
    try {
      await API.post("/tenant/complaints", {
        propertyId: data.property._id,
        ...complaintForm,
      });
      setSuccess("Your maintenance ticket has been submitted to the property manager.");
      setComplaintForm({ title: "", category: "plumbing", description: "" });
      fetchTenantData();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Failed to submit ticket. Please retry."
      );
    }
  };

  const handleTabKeyDown = useCallback(
    (e) => {
      const tabs = ["property", "payments", "complaints", "receipts", "application"];
      const idx = tabs.indexOf(activeTab || "application");
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveTab(tabs[(idx + 1) % tabs.length]);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length]);
      }
    },
    [activeTab]
  );

  // Loading & Error states
  if (loading) return <TenantLoading />;
  if (error && !data) return <TenantError error={error} onRetry={fetchTenantData} />;

  const { property, complaints, payments } = data || {};

  const currentTab = activeTab || (property ? "property" : "application");

  const tabs = [
    { key: "property", label: "My Unit", count: property ? 1 : 0 },
    { key: "payments", label: "Pay Rent & Bills", count: 0 },
    { key: "complaints", label: "Report Issues", count: complaints?.length || 0 },
    { key: "receipts", label: "Payment Receipts", count: payments?.length || 0 },
    { key: "application", label: "My Application", count: 0 },
  ];

  return (
    <div className="dashboard-shell animate-fade-in">
      <TenantHeader
        onRefresh={fetchTenantData}
        error={error}
        success={success}
        onClearError={() => setError("")}
        onClearSuccess={() => setSuccess("")}
      />

      <div
        className="agent-nav-wrapper"
        role="tablist"
        aria-label="Tenant dashboard sections"
        onKeyDown={handleTabKeyDown}
      >
        <DashboardTabs
          activeTab={currentTab}
          onChange={(key) => {
            setActiveTab(key);
            clearFeedback();
          }}
          tabs={tabs}
        />
      </div>

      {currentTab === "property" && (
        <div role="tabpanel" id="tabpanel-property" aria-labelledby="tab-property" className="animate-fade-in">
          <TenantPropertyTab property={property} />
        </div>
      )}

      {currentTab === "payments" && (
        <div role="tabpanel" id="tabpanel-payments" aria-labelledby="tab-payments" className="animate-fade-in">
          <TenantPaymentTab
            payForm={payForm}
            onPayFormChange={(field, value) => setPayForm((prev) => ({ ...prev, [field]: value }))}
            onSubmit={handleMakePayment}
          />
        </div>
      )}

      {currentTab === "application" && (
        <div role="tabpanel" id="tabpanel-application" aria-labelledby="tab-application" className="animate-fade-in">
          <TenantApplicationTab />
        </div>
      )}

      {currentTab === "complaints" && (
        <div role="tabpanel" id="tabpanel-complaints" aria-labelledby="tab-complaints" className="animate-fade-in">
          <TenantComplaintsTab
            complaints={complaints || []}
            complaintForm={complaintForm}
            onComplaintFormChange={(field, value) => setComplaintForm((prev) => ({ ...prev, [field]: value }))}
            onSubmit={handleComplaintSubmit}
          />
        </div>
      )}

      {currentTab === "receipts" && (
        <div role="tabpanel" id="tabpanel-receipts" aria-labelledby="tab-receipts" className="animate-fade-in">
          <TenantReceiptsTab payments={payments || []} />
        </div>
      )}
    </div>
  );
};

export default TenantDashboard;