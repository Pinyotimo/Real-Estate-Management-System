import { useEffect, useState } from "react";
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

  // Revoke object URLs when previews change or component unmounts, to avoid memory leaks
  useEffect(() => {
    return () => {
      filePreviews.forEach((file) => file.url && URL.revokeObjectURL(file.url));
    };
  }, [filePreviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    mediaFiles.forEach((file) => data.append("media", file));

    try {
      await API.post("/properties", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/", { state: { success: "Property listed successfully!" } });
    } catch (err) {
      console.error(err);
      alert("Failed to create listing. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <style>{`
        .add-property-section {
          border-left: 4px solid var(--primary);
          padding-left: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 0 var(--radius) var(--radius) 0;
        }
        .add-property-section--navy { border-left-color: var(--brand-navy, #262262); }
        .add-property-section--cyan { border-left-color: var(--brand-cyan, #00AFEF); }
        .add-property-section-heading {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .media-thumb {
          width: 60px;
          height: 60px;
          border-radius: 6px;
          overflow: hidden;
          border: 2px solid var(--brand-cyan, #00AFEF);
          background: var(--surface-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: var(--text-muted);
          position: relative;
        }
        .media-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .media-preview-row {
          margin-top: 0.75rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }
        .media-preview-count {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>

      <div className="page-card">
        <h2 className="dashboard-title">Post a New Property</h2>
        <form onSubmit={handleSubmit} className="dashboard-form-stack">
          {/* Basics */}
          <div className="add-property-section">
            <div className="add-property-section-heading" style={{ color: "var(--primary)" }}>
              📝 Basics
            </div>
            <div>
              <label className="dashboard-label" htmlFor="title">Property Title *</label>
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
              <label className="dashboard-label" htmlFor="description">Full Description *</label>
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
          <div className="add-property-section add-property-section--navy">
            <div className="add-property-section-heading" style={{ color: "var(--brand-navy, #262262)" }}>
              💰 Price & Type
            </div>
            <div className="dashboard-form-grid">
              <div>
                <label className="dashboard-label" htmlFor="price">Price ($) *</label>
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
                <label className="dashboard-label" htmlFor="houseType">Property Type *</label>
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
                  <option value="Business Space / Office">Business Space / Office</option>
                  <option value="Shop / Commercial">Shop / Commercial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bedrooms, Bathrooms, Size */}
          <div className="add-property-section add-property-section--cyan">
            <div className="add-property-section-heading" style={{ color: "var(--brand-cyan, #00AFEF)" }}>
              📐 Specs
            </div>
            <div className="dashboard-form-grid">
              <div>
                <label className="dashboard-label" htmlFor="bedrooms">Bedrooms</label>
                <input id="bedrooms" type="number" name="bedrooms" placeholder="3" onChange={handleChange} className="dashboard-input" />
              </div>
              <div>
                <label className="dashboard-label" htmlFor="bathrooms">Bathrooms</label>
                <input id="bathrooms" type="number" name="bathrooms" placeholder="2" onChange={handleChange} className="dashboard-input" />
              </div>
              <div>
                <label className="dashboard-label" htmlFor="squareMeters">Size (m²)</label>
                <input id="squareMeters" type="number" name="squareMeters" placeholder="200" onChange={handleChange} className="dashboard-input" />
              </div>
            </div>
          </div>

          {/* County & Estate */}
          <div className="add-property-section">
            <div className="add-property-section-heading" style={{ color: "var(--primary)" }}>
              📍 Location
            </div>
            <div className="dashboard-form-grid">
              <div>
                <label className="dashboard-label" htmlFor="county">County *</label>
                <input id="county" type="text" name="county" placeholder="e.g. Nairobi" onChange={handleChange} required className="dashboard-input" />
              </div>
              <div>
                <label className="dashboard-label" htmlFor="estate">Estate / Area *</label>
                <input id="estate" type="text" name="estate" placeholder="e.g. Kilimani" onChange={handleChange} required className="dashboard-input" />
              </div>
            </div>
          </div>

          {/* Condition & Map Link */}
          <div className="add-property-section add-property-section--navy">
            <div className="add-property-section-heading" style={{ color: "var(--brand-navy, #262262)" }}>
              ✨ Condition & Map
            </div>
            <div className="dashboard-form-grid">
              <div>
                <label className="dashboard-label" htmlFor="condition">Condition</label>
                <select id="condition" name="condition" onChange={handleChange} value={formData.condition} className="dashboard-input">
                  <option value="Brand New">Brand New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Renovated">Renovated</option>
                  <option value="Good">Good</option>
                  <option value="Needs Work">Needs Work</option>
                </select>
              </div>
              <div>
                <label className="dashboard-label" htmlFor="mapLocation">Google Maps Link</label>
                <input id="mapLocation" type="url" name="mapLocation" placeholder="https://maps.app.goo.gl/..." onChange={handleChange} className="dashboard-input" />
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
              <div className="media-preview-row">
                {filePreviews.map((file, idx) => (
                  <div key={idx} className="media-thumb">
                    {file.url ? (
                      <img src={file.url} alt={file.name} />
                    ) : (
                      <span>🎬</span>
                    )}
                  </div>
                ))}
                <div className="media-preview-count">
                  {filePreviews.length} file(s) selected
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className="dashboard-btn dashboard-btn--success"
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
    </>
  );
};

export default AddProperty;