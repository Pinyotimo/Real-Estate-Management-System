import { useEffect, useState, useCallback } from "react";
import API from "../../../api";

const TenantDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("property");

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
      setData(res.data.data);
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
      setSuccess(`Payment of KES ${Number(payForm.amount).toLocaleString()} submitted successfully.`);
      setPayForm({ amount: "", paymentType: "rent", paymentMethod: "mpesa" });
      fetchTenantData();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Payment failed. Please check your balance and try again.");
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
      setError(err?.response?.data?.message || "Failed to submit ticket. Please retry.");
    }
  };

  const handleTabKeyDown = useCallback((e) => {
    const tabs = ["property", "payments", "complaints", "receipts"];
    const idx = tabs.indexOf(activeTab);
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveTab(tabs[(idx + 1) % tabs.length]);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length]);
    }
  }, [activeTab]);

  // ─── Loading Skeleton ─────────────────────────────
  if (loading) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-space-between" style={{ marginBottom: "1rem" }}>
          <div>
            <div className="animate-shimmer" style={{ width: "320px", height: "28px", borderRadius: "var(--radius-sm)", marginBottom: "0.5rem" }} />
            <div className="animate-shimmer" style={{ width: "240px", height: "16px", borderRadius: "var(--radius-sm)" }} />
          </div>
          <div className="animate-shimmer" style={{ width: "80px", height: "40px", borderRadius: "var(--radius-sm)" }} />
        </div>
        <div className="animate-shimmer" style={{ height: "44px", borderRadius: "var(--radius)", marginBottom: "1.25rem" }} />
        <div className="dashboard-card-grid">
          <div className="animate-shimmer" style={{ height: "180px", borderRadius: "var(--radius)" }} />
          <div className="animate-shimmer" style={{ height: "180px", borderRadius: "var(--radius)" }} />
        </div>
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
            Portal Unavailable
          </p>
          <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginBottom: "1.25rem", maxWidth: "360px" }}>
            {error}
          </p>
          <button className="dashboard-btn" onClick={fetchTenantData}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { property, complaints, payments } = data || {};
  const tabs = [
    { key: "property", label: "My Unit", count: property ? 1 : 0 },
    { key: "payments", label: "Pay Rent & Bills", count: 0 },
    { key: "complaints", label: "Report Issues", count: complaints?.length || 0 },
    { key: "receipts", label: "Payment Receipts", count: payments?.length || 0 },
  ];

  return (
    <div className="dashboard-shell animate-fade-in">
      {/* Header */}
      <div className="dashboard-space-between" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h2 className="dashboard-title" style={{ margin: 0 }}>Resident Portal</h2>
          <p className="dashboard-subtitle" style={{ margin: "0.25rem 0 0" }}>
            Manage your unit, payments, and maintenance requests.
          </p>
        </div>
        <button className="dashboard-btn dashboard-btn--outline" onClick={fetchTenantData} style={{ minHeight: "38px", fontSize: "0.82rem" }}>
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

      {/* Tabs */}
      <div className="dashboard-tabs" role="tablist" aria-label="Tenant portal sections" onKeyDown={handleTabKeyDown}>
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={activeTab === t.key}
            aria-controls={`tabpanel-${t.key}`}
            id={`tab-${t.key}`}
            onClick={() => { setActiveTab(t.key); clearFeedback(); }}
            className={`dashboard-tab ${activeTab === t.key ? "active" : ""}`}
          >
            {t.label}
            {t.count > 0 && (
              <span style={{
                marginLeft: "0.4rem",
                fontSize: "0.7rem",
                background: activeTab === t.key ? "var(--brand-blue)" : "var(--surface-muted)",
                color: activeTab === t.key ? "#fff" : "var(--text-muted)",
                padding: "0.1rem 0.45rem",
                borderRadius: "999px",
                fontWeight: 700
              }}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── MY UNIT ─────────────────────────────────── */}
      {activeTab === "property" && (
        <div role="tabpanel" id="tabpanel-property" aria-labelledby="tab-property">
          {!property ? (
            <div className="dashboard-panel empty-state animate-fade-in" style={{ padding: "2.5rem 1.5rem" }}>
              <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "var(--surface-muted)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 1rem",
                color: "var(--text-muted)"
              }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
                No Unit Assigned
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "400px", margin: "0 auto 1rem" }}>
                You do not have an assigned unit yet. Ask your property manager to assign your house, warehouse, or business unit to your registered account.
              </p>
            </div>
          ) : (
            <div className="dashboard-card-grid">
              {/* Property Card */}
              <div className="dashboard-panel animate-fade-in">
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "var(--radius-sm)",
                    background: property.images?.[0] ? "transparent" : "var(--surface-muted)",
                    overflow: "hidden",
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center"
                  }}>
                    {property.images?.[0] ? (
                      <img src={property.images[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted)" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span className="dashboard-pill dashboard-pill--info" style={{ fontSize: "0.7rem", marginBottom: "0.35rem" }}>
                      {property.houseType}
                    </span>
                    <h3 className="dashboard-section-title" style={{ margin: "0.25rem 0 0", fontSize: "1.05rem" }}>
                      {property.title}
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "0.15rem 0 0" }}>
                      {property.estate}, {property.county} County
                    </p>
                  </div>
                </div>

                <div className="info-grid" style={{ marginTop: "0.75rem" }}>
                  <div className="info-cell">
                    <strong>Monthly Rent</strong>
                    <span style={{ fontWeight: 700, color: "var(--brand-black)" }}>
                      KES {Number(property.price).toLocaleString()}
                    </span>
                  </div>
                  <div className="info-cell">
                    <strong>Total Paid</strong>
                    <span>KES {Number(property.rentPaid || 0).toLocaleString()}</span>
                  </div>
                  <div className="info-cell">
                    <strong>Balance / Arrears</strong>
                    <span className={`dashboard-pill ${property.rentArrears > 0 ? "dashboard-pill--danger" : "dashboard-pill--success"}`} style={{ fontSize: "0.75rem" }}>
                      KES {Number(property.rentArrears || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Utilities Card */}
              <div className="dashboard-panel animate-fade-in">
                <h3 className="dashboard-section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--brand-blue)" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Utilities & Meter Info
                </h3>
                <div className="dashboard-stack" style={{ gap: "0.75rem", marginTop: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.88rem", color: "var(--text-subtle)" }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: "0.35rem" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                      </svg>
                      Electricity Meter
                    </span>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      {property.electricityMeter || "N/A"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.88rem", color: "var(--text-subtle)" }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: "0.35rem" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                      </svg>
                      WiFi Status
                    </span>
                    <span className={`dashboard-pill ${property.wifiStatus === "active" ? "dashboard-pill--success" : "dashboard-pill--danger"}`} style={{ fontSize: "0.72rem" }}>
                      {property.wifiStatus || "active"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.88rem", color: "var(--text-subtle)" }}>
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "middle", marginRight: "0.35rem" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Active Repairs
                    </span>
                    <span className="dashboard-pill dashboard-pill--warning" style={{ fontSize: "0.72rem" }}>
                      {property.repairStatus || "none"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── PAYMENTS ─────────────────────────────────── */}
      {activeTab === "payments" && (
        <div role="tabpanel" id="tabpanel-payments" aria-labelledby="tab-payments" className="animate-fade-in">
          <div className="dashboard-panel" style={{ maxWidth: "560px" }}>
            <h3 className="dashboard-section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--brand-blue)" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Pay Rent or Bills
            </h3>
            <form onSubmit={handleMakePayment} className="dashboard-form-stack" style={{ marginTop: "0.75rem" }}>
              <div className="dashboard-form-grid" style={{ padding: 0, background: "transparent", border: "none", marginBottom: 0 }}>
                <div>
                  <label className="dashboard-label required">Payment Type</label>
                  <select
                    value={payForm.paymentType}
                    onChange={(e) => setPayForm({ ...payForm, paymentType: e.target.value })}
                    className="dashboard-select"
                    required
                  >
                    <option value="rent">Monthly Rent</option>
                    <option value="service_charge">Service Charge</option>
                    <option value="water">Water Bill</option>
                    <option value="electricity">Electricity</option>
                  </select>
                </div>
                <div>
                  <label className="dashboard-label required">Amount (KES)</label>
                  <input
                    type="number"
                    placeholder="e.g. 45000"
                    value={payForm.amount}
                    onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                    required
                    min="1"
                    className="dashboard-input"
                  />
                </div>
              </div>
              <div>
                <label className="dashboard-label required">Payment Method</label>
                <select
                  value={payForm.paymentMethod}
                  onChange={(e) => setPayForm({ ...payForm, paymentMethod: e.target.value })}
                  className="dashboard-select"
                  required
                >
                  <option value="mpesa">M-Pesa / Mobile Money</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <button type="submit" className="dashboard-btn dashboard-btn--success" style={{ marginTop: "0.5rem" }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Process Secure Payment
              </button>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.5rem" }}>
                Payments are processed via encrypted gateway. Receipts will appear in the Receipts tab.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ─── COMPLAINTS ───────────────────────────────── */}
      {activeTab === "complaints" && (
        <div role="tabpanel" id="tabpanel-complaints" aria-labelledby="tab-complaints" className="animate-fade-in">
          {/* Existing Complaints List */}
          {complaints && complaints.length > 0 && (
            <div className="dashboard-panel" style={{ marginBottom: "1rem" }}>
              <h3 className="dashboard-section-title">Your Recent Tickets</h3>
              <div className="dashboard-stack" style={{ gap: "0.6rem", marginTop: "0.5rem" }}>
                {complaints.slice(0, 5).map((c) => (
                  <div key={c._id} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    background: "var(--surface-soft)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-light)"
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: "0.88rem", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {c.title}
                      </p>
                      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0.15rem 0 0" }}>
                        {c.category} • {new Date(c.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="dashboard-pill dashboard-pill--warning" style={{ fontSize: "0.7rem", flexShrink: 0 }}>
                      {c.status || "Open"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complaint Form */}
          <div className="dashboard-panel">
            <h3 className="dashboard-section-title">Submit New Ticket</h3>
            <form onSubmit={handleComplaintSubmit} className="dashboard-form-stack" style={{ marginTop: "0.75rem" }}>
              <div className="dashboard-form-grid" style={{ padding: 0, background: "transparent", border: "none", marginBottom: 0 }}>
                <div>
                  <label className="dashboard-label required">Issue Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Electrical Fault in Kitchen"
                    value={complaintForm.title}
                    onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                    required
                    className="dashboard-input"
                  />
                </div>
                <div>
                  <label className="dashboard-label required">Category</label>
                  <select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                    className="dashboard-select"
                    required
                  >
                    <option value="plumbing">Plumbing</option>
                    <option value="electricity">Electricity</option>
                    <option value="wifi">WiFi / Internet</option>
                    <option value="structural">Structural</option>
                    <option value="security">Security</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="dashboard-label required">Description</label>
                <textarea
                  placeholder="Describe the issue in detail so maintenance can resolve it quickly..."
                  value={complaintForm.description}
                  onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                  required
                  className="dashboard-input"
                  rows="4"
                  style={{ resize: "vertical", minHeight: "90px" }}
                />
              </div>
              <button type="submit" className="dashboard-btn" style={{ marginTop: "0.5rem" }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Maintenance Ticket
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── RECEIPTS ─────────────────────────────────── */}
      {activeTab === "receipts" && (
        <div role="tabpanel" id="tabpanel-receipts" aria-labelledby="tab-receipts" className="animate-fade-in">
          {(!payments || payments.length === 0) ? (
            <div className="dashboard-panel empty-state" style={{ padding: "2.5rem 1.5rem" }}>
              <div style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "var(--surface-muted)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 1rem",
                color: "var(--text-muted)"
              }}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.35rem" }}>
                No Payment Receipts
              </p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "360px", margin: "0 auto" }}>
                Once you make a payment through the Pay Rent tab, your transaction receipts will appear here for download and reference.
              </p>
            </div>
          ) : (
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p._id}>
                      <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
                        {p.transactionId || p._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="text-capitalize">{p.paymentType}</td>
                      <td>
                        <span className="dashboard-pill dashboard-pill--success" style={{ fontSize: "0.75rem" }}>
                          KES {Number(p.amount).toLocaleString()}
                        </span>
                      </td>
                      <td>{new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                      <td>
                        <span className="dashboard-pill dashboard-pill--info" style={{ fontSize: "0.72rem" }}>
                          {p.status || "Completed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TenantDashboard;