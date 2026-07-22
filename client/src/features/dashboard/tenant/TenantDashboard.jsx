import { useEffect, useState } from "react";
import API from "../../../api";

const TenantDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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
    try {
      const res = await API.get("/tenant/overview");
      setData(res.data.data);
    } catch (err) {
      console.error("Error fetching tenant dashboard:", err);
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
      alert("📢 Complaint sent to landlord.");
      setComplaintForm({ title: "", category: "plumbing", description: "" });
      fetchTenantData();
    } catch (err) {
      alert("Failed to submit ticket.");
    }
  };

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "3rem" }}>
        Loading Resident Portal...
      </p>
    );

  const { property, complaints, payments } = data;

  return (
    <div style={{ maxWidth: "1100px", margin: "2rem auto", padding: "0 1rem" }}>
      <h2>🔑 Resident & Business Tenant Portal</h2>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          borderBottom: "2px solid #e2e8f0",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={() => setActiveTab("property")}
          style={tabStyle(activeTab === "property")}
        >
          🏢 My Unit
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          style={tabStyle(activeTab === "payments")}
        >
          💳 Pay Rent & Bills
        </button>
        <button
          onClick={() => setActiveTab("complaints")}
          style={tabStyle(activeTab === "complaints")}
        >
          🛠️ Report Issues ({complaints.length})
        </button>
        <button
          onClick={() => setActiveTab("receipts")}
          style={tabStyle(activeTab === "receipts")}
        >
          🧾 Payment Receipts ({payments.length})
        </button>
      </div>

      {/* TAB 1: MY UNIT */}
      {activeTab === "property" && (
        <div>
          {!property ? (
            <div
              style={{
                padding: "2rem",
                background: "#f8fafc",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#64748b" }}>
                You do not have an assigned unit yet. Ask your landlord to
                assign your house, warehouse, or business unit to your
                registered account.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
              }}
            >
              <div style={cardStyle}>
                <span
                  style={{
                    fontSize: "0.8rem",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    background: "#e0f2fe",
                    color: "#0369a1",
                    fontWeight: "bold",
                  }}
                >
                  Category: {property.houseType}
                </span>
                <h3 style={{ marginTop: "0.5rem" }}>{property.title}</h3>
                <p style={{ color: "#64748b" }}>
                  📍 {property.estate}, {property.county}
                </p>
                <p>
                  <strong>Monthly Rent:</strong> ${property.price}
                </p>
                <p>
                  <strong>Rent Paid Total:</strong> ${property.rentPaid || 0}
                </p>
                <p>
                  <strong>Current Balance / Arrears:</strong>{" "}
                  <span
                    style={{
                      color: property.rentArrears > 0 ? "#dc2626" : "#16a34a",
                      fontWeight: "bold",
                    }}
                  >
                    ${property.rentArrears || 0}
                  </span>
                </p>
              </div>

              <div style={cardStyle}>
                <h3>⚡ Utilities & Meter Info</h3>
                <p>
                  <strong>Electricity Meter Number:</strong>{" "}
                  {property.electricityMeter || "N/A"}
                </p>
                <p>
                  <strong>WiFi Connection Status:</strong>{" "}
                  <span
                    style={{
                      textTransform: "capitalize",
                      fontWeight: "bold",
                      color:
                        property.wifiStatus === "active"
                          ? "#16a34a"
                          : "#dc2626",
                    }}
                  >
                    {property.wifiStatus || "active"}
                  </span>
                </p>
                <p>
                  <strong>Active Repairs:</strong>{" "}
                  <span
                    style={{ textTransform: "capitalize", fontWeight: "bold" }}
                  >
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
          style={{
            maxWidth: "500px",
            margin: "0 auto",
            background: "#f8fafc",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
          }}
        >
          <h3>Pay Rent or Bills</h3>
          <form
            onSubmit={handleMakePayment}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label style={labelStyle}>Payment Type</label>
              <select
                value={payForm.paymentType}
                onChange={(e) =>
                  setPayForm({ ...payForm, paymentType: e.target.value })
                }
                style={inputStyle}
              >
                <option value="rent">Monthly Rent</option>
                <option value="service_charge">Service Charge</option>
                <option value="water">Water Bill</option>
                <option value="electricity">Electricity</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Amount ($)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={payForm.amount}
                onChange={(e) =>
                  setPayForm({ ...payForm, amount: e.target.value })
                }
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Method</label>
              <select
                value={payForm.paymentMethod}
                onChange={(e) =>
                  setPayForm({ ...payForm, paymentMethod: e.target.value })
                }
                style={inputStyle}
              >
                <option value="mpesa">M-Pesa / Mobile Money</option>
                <option value="card">Credit / Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            <button type="submit" style={btnStyle("#16a34a")}>
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
            style={{
              background: "#f8fafc",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <input
                type="text"
                placeholder="Title (e.g. Electrical Fault)"
                value={complaintForm.title}
                onChange={(e) =>
                  setComplaintForm({ ...complaintForm, title: e.target.value })
                }
                required
                style={inputStyle}
              />
              <select
                value={complaintForm.category}
                onChange={(e) =>
                  setComplaintForm({
                    ...complaintForm,
                    category: e.target.value,
                  })
                }
                style={inputStyle}
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
              style={{ ...inputStyle, height: "80px" }}
            />
            <button
              type="submit"
              style={{ ...btnStyle("#0284c7"), marginTop: "1rem" }}
            >
              Submit Ticket
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: RECEIPTS */}
      {activeTab === "receipts" && (
        <div>
          <h3>Payment Receipts</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                <th style={{ padding: "0.75rem" }}>Txn Reference</th>
                <th style={{ padding: "0.75rem" }}>Type</th>
                <th style={{ padding: "0.75rem" }}>Amount</th>
                <th style={{ padding: "0.75rem" }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "0.75rem" }}>{p.transactionId}</td>
                  <td
                    style={{ padding: "0.75rem", textTransform: "capitalize" }}
                  >
                    {p.paymentType}
                  </td>
                  <td
                    style={{
                      padding: "0.75rem",
                      color: "#16a34a",
                      fontWeight: "bold",
                    }}
                  >
                    ${p.amount}
                  </td>
                  <td style={{ padding: "0.75rem" }}>
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const cardStyle = {
  padding: "1.25rem",
  background: "#f8fafc",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
};
const tabStyle = (active) => ({
  padding: "0.6rem 1rem",
  background: "none",
  border: "none",
  borderBottom: active ? "3px solid #0284c7" : "none",
  color: active ? "#0284c7" : "#64748b",
  fontWeight: "bold",
  cursor: "pointer",
});
const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  borderRadius: "4px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
};
const labelStyle = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: "bold",
  marginBottom: "0.25rem",
};
const btnStyle = (bg) => ({
  padding: "0.6rem 1.2rem",
  background: bg,
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold",
  width: "100%",
});

export default TenantDashboard;
