import { useEffect, useState } from "react";
import API from "../../../api";

const TenantDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const fetchTenantData = async () => {
    setLoading(true);
    setError("");
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
    if (!data.property) return alert("No assigned unit found!");
    try {
      await API.post("/tenant/pay", {
        propertyId: data.property._id,
        ...payForm,
      });
      alert("✅ Payment completed!");
      setPayForm({ amount: "", paymentType: "rent", paymentMethod: "mpesa" });
      fetchTenantData();
    } catch (err) {
      alert("Payment failed.");
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!data.property) return alert("No assigned unit found!");
    try {
      await API.post("/tenant/complaints", {
        propertyId: data.property._id,
        ...complaintForm,
      });
      alert("📢 Complaint sent to agent.");
      setComplaintForm({ title: "", category: "plumbing", description: "" });
      fetchTenantData();
    } catch (err) {
      alert("Failed to submit ticket.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-shell">
        <p
          style={{
            textAlign: "center",
            marginTop: "3rem",
            color: "var(--text-muted)",
          }}
        >
          Loading Resident Portal...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-panel" style={{ textAlign: "center" }}>
          <p className="auth-error" style={{ display: "inline-block" }}>
            {error || "Something went wrong loading your portal."}
          </p>
          <div style={{ marginTop: "1rem" }}>
            <button className="dashboard-btn" onClick={fetchTenantData}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { property, complaints, payments } = data;

  return (
    <div className="dashboard-shell">
      <h2 className="dashboard-title">🔑 Resident & Business Tenant Portal</h2>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          onClick={() => setActiveTab("property")}
          className={`dashboard-tab ${activeTab === "property" ? "active" : ""}`}
        >
          🏢 My Unit
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`dashboard-tab ${activeTab === "payments" ? "active" : ""}`}
        >
          💳 Pay Rent & Bills
        </button>
        <button
          onClick={() => setActiveTab("complaints")}
          className={`dashboard-tab ${activeTab === "complaints" ? "active" : ""}`}
        >
          🛠️ Report Issues ({complaints.length})
        </button>
        <button
          onClick={() => setActiveTab("receipts")}
          className={`dashboard-tab ${activeTab === "receipts" ? "active" : ""}`}
        >
          🧾 Payment Receipts ({payments.length})
        </button>
      </div>

      {/* TAB 1: MY UNIT */}
      {activeTab === "property" && (
        <div>
          {!property ? (
            <div className="dashboard-panel" style={{ textAlign: "center" }}>
              <p style={{ color: "var(--text-muted)" }}>
                You do not have an assigned unit yet. Ask your agent to assign
                your house, warehouse, or business unit to your registered
                account.
              </p>
            </div>
          ) : (
            <div className="dashboard-card-grid">
              <div className="dashboard-panel">
                <span className="dashboard-pill dashboard-pill--info">
                  Category: {property.houseType}
                </span>
                <h3 style={{ marginTop: "0.5rem" }}>{property.title}</h3>
                <p style={{ color: "var(--text-muted)" }}>
                  📍 {property.estate}, {property.county}
                </p>
                <p>
                  <strong>Monthly Rent:</strong> Ksh {property.price}
                </p>
                <p>
                  <strong>Rent Paid Total:</strong> Ksh {property.rentPaid || 0}
                </p>
                <p>
                  <strong>Current Balance / Arrears:</strong>{" "}
                  <span
                    className={`dashboard-pill ${
                      property.rentArrears > 0
                        ? "dashboard-pill--danger"
                        : "dashboard-pill--success"
                    }`}
                  >
                    Ksh {property.rentArrears || 0}
                  </span>
                </p>
              </div>

              <div className="dashboard-panel">
                <h3>⚡ Utilities & Meter Info</h3>
                <p>
                  <strong>Electricity Meter Number:</strong>{" "}
                  {property.electricityMeter || "N/A"}
                </p>
                <p>
                  <strong>WiFi Connection Status:</strong>{" "}
                  <span
                    className={`dashboard-pill ${
                      property.wifiStatus === "active"
                        ? "dashboard-pill--success"
                        : "dashboard-pill--danger"
                    }`}
                  >
                    {property.wifiStatus || "active"}
                  </span>
                </p>
                <p>
                  <strong>Active Repairs:</strong>{" "}
                  <span className="dashboard-pill dashboard-pill--warning">
                    {property.repairStatus || "none"}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PAYMENTS */}
      {activeTab === "payments" && (
        <div
          className="dashboard-panel"
          style={{ maxWidth: "500px", margin: "0 auto" }}
        >
          <h3>Pay Rent or Bills</h3>
          <form onSubmit={handleMakePayment} className="dashboard-form-stack">
            <div>
              <label className="dashboard-label">Payment Type</label>
              <select
                value={payForm.paymentType}
                onChange={(e) =>
                  setPayForm({ ...payForm, paymentType: e.target.value })
                }
                className="dashboard-select"
              >
                <option value="rent">Monthly Rent</option>
                <option value="service_charge">Service Charge</option>
                <option value="water">Water Bill</option>
                <option value="electricity">Electricity</option>
              </select>
            </div>
            <div>
              <label className="dashboard-label">Amount (Ksh)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={payForm.amount}
                onChange={(e) =>
                  setPayForm({ ...payForm, amount: e.target.value })
                }
                required
                className="dashboard-input"
              />
            </div>
            <div>
              <label className="dashboard-label">Method</label>
              <select
                value={payForm.paymentMethod}
                onChange={(e) =>
                  setPayForm({ ...payForm, paymentMethod: e.target.value })
                }
                className="dashboard-select"
              >
                <option value="mpesa">M-Pesa / Mobile Money</option>
                <option value="card">Credit / Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <button
              type="submit"
              className="dashboard-btn dashboard-btn--success"
            >
              Process Payment
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: REPORT COMPLAINTS */}
      {activeTab === "complaints" && (
        <div>
          <h3>Submit Complaint / Ticket</h3>
          <form
            onSubmit={handleComplaintSubmit}
            className="dashboard-form-stack dashboard-panel"
          >
            <div className="dashboard-form-grid" style={{ marginBottom: 0 }}>
              <input
                type="text"
                placeholder="Title (e.g. Electrical Fault)"
                value={complaintForm.title}
                onChange={(e) =>
                  setComplaintForm({ ...complaintForm, title: e.target.value })
                }
                required
                className="dashboard-input"
              />
              <select
                value={complaintForm.category}
                onChange={(e) =>
                  setComplaintForm({
                    ...complaintForm,
                    category: e.target.value,
                  })
                }
                className="dashboard-select"
              >
                <option value="plumbing">Plumbing</option>
                <option value="electricity">Electricity</option>
                <option value="wifi">WiFi</option>
                <option value="structural">Structural</option>
                <option value="other">Other</option>
              </select>
            </div>
            <textarea
              placeholder="Describe issue..."
              value={complaintForm.description}
              onChange={(e) =>
                setComplaintForm({
                  ...complaintForm,
                  description: e.target.value,
                })
              }
              required
              className="dashboard-input"
              style={{ height: "80px" }}
            />
            <button type="submit" className="dashboard-btn">
              Submit Ticket
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: RECEIPTS */}
      {activeTab === "receipts" && (
        <div className="dashboard-table-wrapper">
          <h3>Payment Receipts</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Txn Reference</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.transactionId}</td>
                  <td style={{ textTransform: "capitalize" }}>
                    {p.paymentType}
                  </td>
                  <td>
                    <span className="dashboard-pill dashboard-pill--success">
                      Ksh {p.amount}
                    </span>
                  </td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenantDashboard;
