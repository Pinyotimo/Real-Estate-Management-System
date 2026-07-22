import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const AddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    houseType: "Residential House",
    bedrooms: "1",
    bathrooms: "1",
    county: "",
    estate: "",
    squareMeters: "",
    mapLocation: "",
    condition: "Excellent",
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [filePreviews, setFilePreviews] = useState([]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 12) {
      alert("Maximum 10 images and 2 videos allowed.");
      e.target.value = "";
      return;
    }
    setMediaFiles(files);

    const previews = files.map((file) => ({
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      name: file.name,
      type: file.type,
    }));
    setFilePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    mediaFiles.forEach((file) => data.append("media", file));

    try {
      await API.post("/properties", data);
      navigate("/", { state: { success: "Property listed successfully!" } });
    } catch (err) {
      console.error(err);
      alert("Failed to create listing. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-card">
      <h2 className="dashboard-title">Post a New Property</h2>
      <form onSubmit={handleSubmit} className="dashboard-form-stack">
        {/* Title & Description */}
        <div className="form-section form-section--purple">
          <div
            className="form-section-heading"
            style={{ color: "var(--accent-purple)" }}
          >
            📝 Basics
          </div>
          <div>
            <label className="dashboard-label" htmlFor="title">
              Property Title *
            </label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="e.g. Modern 4-Bed Villa in Kilimani"
              onChange={handleChange}
              required
              className="dashboard-input"
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            <label className="dashboard-label" htmlFor="description">
              Full Description *
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Describe the property, amenities, and neighborhood..."
              onChange={handleChange}
              required
              className="dashboard-input"
              style={{ minHeight: "100px", resize: "vertical" }}
            />
          </div>
        </div>

        {/* Price & Type */}
        <div className="form-section form-section--teal">
          <div
            className="form-section-heading"
            style={{ color: "var(--accent-teal)" }}
          >
            💰 Price & Type
          </div>
          <div className="dashboard-form-grid">
            <div>
              <label className="dashboard-label" htmlFor="price">
                Price (Ksh) *
              </label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder="e.g. 450000"
                onChange={handleChange}
                required
                className="dashboard-input"
              />
            </div>
            <div>
              <label className="dashboard-label" htmlFor="houseType">
                Property Type *
              </label>
              <select
                id="houseType"
                name="houseType"
                onChange={handleChange}
                value={formData.houseType}
                className="dashboard-input"
              >
                <option value="Residential House">Residential House</option>
                <option value="Apartment">Apartment</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Business Space / Office">
                  Business Space / Office
                </option>
                <option value="Shop / Commercial">Shop / Commercial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bedrooms, Bathrooms, Size */}
        <div className="form-section form-section--orange">
          <div
            className="form-section-heading"
            style={{ color: "var(--accent-orange)" }}
          >
            📐 Specs
          </div>
          <div className="dashboard-form-grid">
            <div>
              <label className="dashboard-label" htmlFor="bedrooms">
                Bedrooms
              </label>
              <input
                id="bedrooms"
                type="number"
                name="bedrooms"
                placeholder="3"
                onChange={handleChange}
                className="dashboard-input"
              />
            </div>
            <div>
              <label className="dashboard-label" htmlFor="bathrooms">
                Bathrooms
              </label>
              <input
                id="bathrooms"
                type="number"
                name="bathrooms"
                placeholder="2"
                onChange={handleChange}
                className="dashboard-input"
              />
            </div>
            <div>
              <label className="dashboard-label" htmlFor="squareMeters">
                Size (m²)
              </label>
              <input
                id="squareMeters"
                type="number"
                name="squareMeters"
                placeholder="200"
                onChange={handleChange}
                className="dashboard-input"
              />
            </div>
          </div>
        </div>

        {/* County & Estate */}
        <div className="form-section form-section--pink">
          <div
            className="form-section-heading"
            style={{ color: "var(--accent-pink)" }}
          >
            📍 Location
          </div>
          <div className="dashboard-form-grid">
            <div>
              <label className="dashboard-label" htmlFor="county">
                County *
              </label>
              <input
                id="county"
                type="text"
                name="county"
                placeholder="e.g. Nairobi"
                onChange={handleChange}
                required
                className="dashboard-input"
              />
            </div>
            <div>
              <label className="dashboard-label" htmlFor="estate">
                Estate / Area *
              </label>
              <input
                id="estate"
                type="text"
                name="estate"
                placeholder="e.g. Kilimani"
                onChange={handleChange}
                required
                className="dashboard-input"
              />
            </div>
          </div>
        </div>

        {/* Condition & Map Link */}
        <div className="form-section form-section--yellow">
          <div
            className="form-section-heading"
            style={{ color: "var(--accent-yellow)" }}
          >
            ✨ Condition & Map
          </div>
          <div className="dashboard-form-grid">
            <div>
              <label className="dashboard-label" htmlFor="condition">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                onChange={handleChange}
                value={formData.condition}
                className="dashboard-input"
              >
                <option value="Brand New">Brand New</option>
                <option value="Excellent">Excellent</option>
                <option value="Renovated">Renovated</option>
                <option value="Good">Good</option>
                <option value="Needs Work">Needs Work</option>
              </select>
            </div>
            <div>
              <label className="dashboard-label" htmlFor="mapLocation">
                Google Maps Link
              </label>
              <input
                id="mapLocation"
                type="url"
                name="mapLocation"
                placeholder="https://maps.app.goo.gl/..."
                onChange={handleChange}
                className="dashboard-input"
              />
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div>
          <label className="dashboard-label" htmlFor="media">
            Photos & Videos (Up to 10 images + 2 videos)
          </label>
          <input
            id="media"
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
            required
            className="dashboard-input"
            style={{ padding: "0.4rem" }}
          />
          {filePreviews.length > 0 && (
            <div
              style={{
                marginTop: "0.75rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {filePreviews.map((file, idx) => (
                <div
                  key={idx}
                  className="media-thumb"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    background: "var(--surface-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    position: "relative",
                  }}
                >
                  {file.url ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span>🎬</span>
                  )}
                </div>
              ))}
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  alignSelf: "center",
                }}
              >
                {filePreviews.length} file(s) selected
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          className="dashboard-btn dashboard-btn--gradient"
          style={{ alignSelf: "flex-start" }}
        >
          {uploading ? (
            <>
              <span
                className="animate-pulse"
                style={{
                  display: "inline-block",
                  width: "1rem",
                  height: "1rem",
                  background: "currentColor",
                  borderRadius: "50%",
                  marginRight: "0.5rem",
                }}
              ></span>
              Uploading…
            </>
          ) : (
            "Publish Property Listing"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProperty;
