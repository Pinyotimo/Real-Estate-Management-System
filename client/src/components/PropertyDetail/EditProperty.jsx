import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProperty, updateProperty } from "../../services/propertyService";


const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    type: "apartment",
    status: "available",
    bedrooms: "",
    bathrooms: "",
    area: "",
    description: "",
    amenities: "",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchProperty = async () => {
      try {
        const data = await getProperty(id);
        if (isMounted) {
          setFormData({
            name: data.name || "",
            location: data.location || "",
            price: data.price || "",
            type: data.type || "apartment",
            status: data.status || "available",
            bedrooms: data.bedrooms || "",
            bathrooms: data.bathrooms || "",
            area: data.area || "",
            description: data.description || "",
            amenities: Array.isArray(data.amenities)
              ? data.amenities.join(", ")
              : data.amenities || "",
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(
            "Failed to load property details. The listing may have been removed."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProperty();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...formData,
        amenities: formData.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        price: parseFloat(formData.price) || 0,
        bedrooms: parseInt(formData.bedrooms, 10) || 0,
        bathrooms: parseInt(formData.bathrooms, 10) || 0,
        area: parseFloat(formData.area) || 0,
      };
      await updateProperty(id, payload);
      setSuccess("Property updated successfully. Redirecting…");
      setTimeout(() => navigate(`/properties/${id}`), 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Update failed. Please check your connection and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const amenityChips = formData.amenities
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean);

  // ─── Loading Skeleton ─────────────────────────────
  if (loading) {
    return (
      <div className="page-card">
        <div
          className="animate-shimmer"
          style={{
            width: "240px",
            height: "24px",
            borderRadius: "var(--radius-sm)",
            marginBottom: "1.5rem",
          }}
        />
        <div className="dashboard-form-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="animate-shimmer"
              style={{ height: "70px", borderRadius: "var(--radius-sm)" }}
            />
          ))}
        </div>
        <div
          className="animate-shimmer"
          style={{
            height: "120px",
            borderRadius: "var(--radius-sm)",
            marginTop: "1rem",
          }}
        />
        <div
          className="animate-shimmer"
          style={{
            height: "70px",
            borderRadius: "var(--radius-sm)",
            marginTop: "1rem",
          }}
        />
      </div>
    );
  }

  // ─── Fatal Error State ────────────────────────────
  if (error && !formData.name) {
    return (
      <div className="page-card animate-fade-in">
        <div className="empty-state" style={{ padding: "2.5rem 1.5rem", textAlign: "center" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "var(--danger-soft)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 1rem",
              color: "var(--brand-black)",
            }}
          >
            <svg
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Unable to Load Property
          </p>
          <p
            style={{
              fontSize: "0.88rem",
              color: "var(--text-muted)",
              marginBottom: "1.25rem",
            }}
          >
            {error}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="dashboard-btn"
            >
              Retry
            </button>
            <Link to="/" className="dashboard-btn dashboard-btn--ghost">
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-card animate-fade-in">
      {/* Breadcrumb + Header */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div className="breadcrumb" style={{ marginBottom: "0.5rem" }}>
          <Link to="/" className="dashboard-link" style={{ fontSize: "0.78rem" }}>
            Properties
          </Link>
          <span style={{ color: "var(--text-muted)", margin: "0 0.35rem" }}>/</span>
          <Link
            to={`/properties/${id}`}
            className="dashboard-link"
            style={{ fontSize: "0.78rem" }}
          >
            Details
          </Link>
          <span style={{ color: "var(--text-muted)", margin: "0 0.35rem" }}>/</span>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Edit
          </span>
        </div>
        <div
          className="dashboard-space-between"
          style={{ flexWrap: "wrap", gap: "0.75rem" }}
        >
          <h2 className="dashboard-title" style={{ margin: 0 }}>
            Edit Property
          </h2>
          <Link
            to={`/properties/${id}`}
            className="dashboard-btn dashboard-btn--ghost"
            style={{ minHeight: "38px", fontSize: "0.82rem" }}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Details
          </Link>
        </div>
      </div>

      {/* Feedback Banners */}
      {error && (
        <div
          className="dashboard-panel"
          style={{
            marginBottom: "1rem",
            borderLeft: "4px solid var(--brand-black)",
            background: "var(--danger-soft)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.85rem 1rem",
          }}
        >
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="var(--brand-black)"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span style={{ fontSize: "0.88rem", fontWeight: 600, flex: 1 }}>
            {error}
          </span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="icon-button"
            style={{
              width: "28px",
              height: "28px",
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
            aria-label="Dismiss error"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
      {success && (
        <div
          className="dashboard-panel"
          style={{
            marginBottom: "1rem",
            borderLeft: "4px solid var(--brand-blue)",
            background: "var(--success-soft)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.85rem 1rem",
          }}
        >
          <svg
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="var(--brand-blue)"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span style={{ fontSize: "0.88rem", fontWeight: 600, flex: 1 }}>
            {success}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="dashboard-form-stack">
        {/* Basics Section */}
        <div className="add-property-section">
          <div className="add-property-section-heading">Property Basics</div>
          <div className="dashboard-form-grid">
            <div>
              <label className="dashboard-label required" htmlFor="edit-name">
                Property Name
              </label>
              <input
                id="edit-name"
                className="dashboard-input"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Riverside Apartments"
                required
              />
            </div>
            <div>
              <label
                className="dashboard-label required"
                htmlFor="edit-location"
              >
                Location
              </label>
              <input
                id="edit-location"
                className="dashboard-input"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Kilimani, Nairobi"
                required
              />
            </div>
          </div>
        </div>

        {/* Pricing & Status */}
        <div className="add-property-section add-property-section--navy">
          <div className="add-property-section-heading">Pricing & Status</div>
          <div className="dashboard-form-grid">
            <div>
              <label
                className="dashboard-label required"
                htmlFor="edit-price"
              >
                Price (KES)
              </label>
              <input
                id="edit-price"
                className="dashboard-input"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 45000"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="dashboard-label required" htmlFor="edit-type">
                Property Type
              </label>
              <select
                id="edit-type"
                className="dashboard-select"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div>
              <label
                className="dashboard-label required"
                htmlFor="edit-status"
              >
                Status
              </label>
              <select
                id="edit-status"
                className="dashboard-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="add-property-section add-property-section--cyan">
          <div className="add-property-section-heading">Specifications</div>
          <div className="dashboard-form-grid">
            <div>
              <label className="dashboard-label" htmlFor="edit-bedrooms">
                Bedrooms
              </label>
              <input
                id="edit-bedrooms"
                className="dashboard-input"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                placeholder="3"
                min="0"
              />
            </div>
            <div>
              <label className="dashboard-label" htmlFor="edit-bathrooms">
                Bathrooms
              </label>
              <input
                id="edit-bathrooms"
                className="dashboard-input"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                placeholder="2"
                min="0"
              />
            </div>
            <div>
              <label className="dashboard-label" htmlFor="edit-area">
                Area (sq ft)
              </label>
              <input
                id="edit-area"
                className="dashboard-input"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                placeholder="1200"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="add-property-section">
          <div className="add-property-section-heading">
            Description & Amenities
          </div>
          <div className="dashboard-form-stack">
            <div>
              <label className="dashboard-label" htmlFor="edit-description">
                Description
              </label>
              <textarea
                id="edit-description"
                className="dashboard-input"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the property, neighborhood, and unique selling points..."
                rows="4"
                maxLength={800}
                style={{ resize: "vertical", minHeight: "100px" }}
              />
              <div
                style={{
                  textAlign: "right",
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: "0.25rem",
                }}
              >
                {formData.description.length} / 800
              </div>
            </div>
            <div>
              <label className="dashboard-label" htmlFor="edit-amenities">
                Amenities
              </label>
              <input
                id="edit-amenities"
                className="dashboard-input"
                name="amenities"
                type="text"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="e.g. Pool, Gym, Parking, Security, Backup Generator"
              />
              {amenityChips.length > 0 && (
                <div
                  className="dashboard-inline-actions"
                  style={{ marginTop: "0.6rem", gap: "0.4rem" }}
                >
                  {amenityChips.map((chip, idx) => (
                    <span
                      key={`${chip}-${idx}`}
                      className="dashboard-pill"
                      style={{ fontSize: "0.72rem", textTransform: "none" }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            paddingTop: "0.75rem",
            borderTop: "1px solid var(--border)",
            marginTop: "0.5rem",
          }}
        >
          <Link
            to={`/properties/${id}`}
            className="dashboard-btn dashboard-btn--ghost"
            style={{ minHeight: "42px" }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="dashboard-btn dashboard-btn--success"
            style={{ minWidth: "160px" }}
          >
            {saving ? (
              <>
                <svg
                  className="animate-pulse"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Saving…</span>
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;