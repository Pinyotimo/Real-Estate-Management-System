import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProperties = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.get("/agent/overview");
      setProperties(data.data.properties || []);
    } catch (err) {
      console.error("Failed to load properties:", err);
      setError("Could not load your properties. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Remove this property listing?")) return;
    try {
      await API.delete(`/properties/${propertyId}`);
      setProperties((current) => current.filter((p) => p._id !== propertyId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete property.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard-shell">
        <p className="dashboard-subtitle" style={{ textAlign: "center", marginTop: "3rem" }}>
          Loading your properties...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-shell">
        <div className="dashboard-panel" style={{ textAlign: "center", maxWidth: "480px", margin: "3rem auto" }}>
          <p className="auth-error" style={{ display: "inline-block" }}>{error}</p>
          <div style={{ marginTop: "1rem" }}>
            <button className="dashboard-btn" onClick={fetchProperties}>Retry</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-space-between">
        <h2 className="dashboard-title">My Properties ({properties.length})</h2>
        <Link to="/add" className="dashboard-btn dashboard-btn--success">
          + Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="empty-state">
          You haven't listed any properties yet.
        </div>
      ) : (
        <div className="dashboard-card-grid dashboard-card-grid--property">
          {properties.map((property) => (
            <div key={property._id} className="dashboard-card">
              <span
                className={`dashboard-pill ${
                  property.status === "occupied"
                    ? "dashboard-pill--success"
                    : "dashboard-pill--info"
                }`}
              >
                {property.status === "occupied" ? "Occupied" : "Vacant"}
              </span>
              <h3 style={{ margin: "0.5rem 0 0" }}>{property.title}</h3>
              <p style={{ color: "var(--text-muted)", margin: 0 }}>
                📍 {property.estate}, {property.county}
              </p>
              <p style={{ margin: 0 }}>
                <strong>${Number(property.price).toLocaleString()}</strong> / month
              </p>
              <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.85rem" }}>
                {property.houseType}
              </p>
              <div className="dashboard-inline-actions" style={{ marginTop: "0.5rem" }}>
                <Link to={`/properties/${property._id}`} className="dashboard-btn dashboard-btn--outline">
                  View
                </Link>
                <Link to={`/properties/${property._id}/edit`} className="dashboard-btn">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(property._id)}
                  className="dashboard-btn dashboard-btn--danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;