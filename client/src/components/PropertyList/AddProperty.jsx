import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

const AddProperty = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const total = mediaFiles.length + files.length;
    if (total > 12) {
      setError("Maximum 10 images and 2 videos allowed (12 files total).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const combined = [...mediaFiles, ...files];
    setMediaFiles(combined);

    const newPreviews = files.map((file) => ({
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
      name: file.name,
      type: file.type,
      size: file.size,
    }));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
    if (error) setError(null);
  };

  const removeFile = (index) => {
    const newFiles = [...mediaFiles];
    const newPreviews = [...filePreviews];

    if (newPreviews[index]?.url) {
      URL.revokeObjectURL(newPreviews[index].url);
    }

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setMediaFiles(newFiles);
    setFilePreviews(newPreviews);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      filePreviews.forEach((file) => file.url && URL.revokeObjectURL(file.url));
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    mediaFiles.forEach((file) => data.append("media", file));

    try {
      await API.post("/properties", data);
      navigate("/", { state: { success: "Property listed successfully!" } });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to create listing. Please check your connection and try again."
      );
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const SectionIcon = ({ children }) => (
    <span style={{
      width: '28px',
      height: '28px',
      borderRadius: 'var(--radius-sm)',
      background: 'var(--brand-very-light-blue)',
      color: 'var(--brand-blue)',
      display: 'inline-grid',
      placeItems: 'center',
      flexShrink: 0
    }}>
      {children}
    </span>
  );

  return (
    <div className="page-card animate-fade-in">
      {/* Header */}
      <div className="dashboard-space-between" style={{ marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 className="dashboard-title" style={{ margin: 0 }}>Post a New Property</h2>
          <p className="dashboard-subtitle" style={{ margin: '0.25rem 0 0' }}>
            Create a professional listing with photos, videos, and full details.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="dashboard-btn dashboard-btn--ghost"
          style={{ minHeight: '38px', fontSize: '0.82rem' }}
        >
          Cancel
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="dashboard-panel" style={{
          marginBottom: '1rem',
          borderLeft: '4px solid var(--brand-black)',
          background: 'var(--danger-soft)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1rem'
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="var(--brand-black)" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>{error}</span>
          <button
            onClick={() => setError(null)}
            className="icon-button"
            style={{ width: '28px', height: '28px', border: 'none', background: 'transparent' }}
            aria-label="Dismiss error"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="dashboard-form-stack">
        {/* Basics */}
        <div className="add-property-section">
          <div className="add-property-section-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SectionIcon>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </SectionIcon>
            Basics
          </div>
          <div className="dashboard-form-stack">
            <div>
              <label className="dashboard-label required" htmlFor="title">
                Property Title
              </label>
              <input
                id="title"
                type="text"
                name="title"
                placeholder="e.g. Modern 4-Bed Villa in Kilimani"
                onChange={handleChange}
                required
                className="dashboard-input"
                value={formData.title}
              />
            </div>
            <div>
              <label className="dashboard-label required" htmlFor="description">
                Full Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe the property, amenities, and neighborhood..."
                onChange={handleChange}
                required
                className="dashboard-input"
                rows="5"
                value={formData.description}
                maxLength={1200}
                style={{ resize: 'vertical', minHeight: '100px' }}
              />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {formData.description.length} / 1200
              </div>
            </div>
          </div>
        </div>

        {/* Price & Type */}
        <div className="add-property-section add-property-section--navy">
          <div className="add-property-section-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SectionIcon>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </SectionIcon>
            Price & Type
          </div>
          <div className="dashboard-form-grid">
            <div>
              <label className="dashboard-label required" htmlFor="price">
                Price (KES)
              </label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder="e.g. 450000"
                onChange={handleChange}
                required
                className="dashboard-input"
                value={formData.price}
                min="0"
              />
            </div>
            <div>
              <label className="dashboard-label required" htmlFor="houseType">
                Property Type
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
                <option value="Business Space / Office">Business Space / Office</option>
                <option value="Shop / Commercial">Shop / Commercial</option>
              </select>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="add-property-section add-property-section--cyan">
          <div className="add-property-section-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SectionIcon>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </SectionIcon>
            Specs
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
                value={formData.bedrooms}
                min="0"
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
                value={formData.bathrooms}
                min="0"
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
                value={formData.squareMeters}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="add-property-section">
          <div className="add-property-section-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SectionIcon>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </SectionIcon>
            Location
          </div>
          <div className="dashboard-form-grid">
            <div>
              <label className="dashboard-label required" htmlFor="county">
                County
              </label>
              <input
                id="county"
                type="text"
                name="county"
                placeholder="e.g. Nairobi"
                onChange={handleChange}
                required
                className="dashboard-input"
                value={formData.county}
              />
            </div>
            <div>
              <label className="dashboard-label required" htmlFor="estate">
                Estate / Area
              </label>
              <input
                id="estate"
                type="text"
                name="estate"
                placeholder="e.g. Kilimani"
                onChange={handleChange}
                required
                className="dashboard-input"
                value={formData.estate}
              />
            </div>
          </div>
        </div>

        {/* Condition & Map */}
        <div className="add-property-section add-property-section--navy">
          <div className="add-property-section-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SectionIcon>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 7m0 13V7" />
              </svg>
            </SectionIcon>
            Condition & Map
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
                value={formData.mapLocation}
              />
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="dashboard-panel" style={{ borderLeft: '4px solid var(--brand-light-blue)', paddingLeft: '1rem' }}>
          <div className="add-property-section-heading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <SectionIcon>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </SectionIcon>
            Media Upload
          </div>

          <label className="dashboard-label" htmlFor="media">
            Photos & Videos <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(Up to 10 images + 2 videos)</span>
          </label>

          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius)',
              padding: '1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'var(--surface-soft)',
              transition: 'border-color var(--transition), background var(--transition)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--brand-blue)';
              e.currentTarget.style.background = 'var(--brand-very-light-blue)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--surface-soft)';
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 0.75rem',
              color: 'var(--brand-blue)'
            }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.25rem' }}>
              Click to upload photos & videos
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              JPG, PNG, MP4 — Max 12 files
            </p>
          </div>

          <input
            ref={fileInputRef}
            id="media"
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleMediaChange}
            style={{ display: 'none' }}
          />

          {filePreviews.length > 0 && (
            <div className="media-preview-row" style={{ marginTop: '1rem' }}>
              {filePreviews.map((file, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div className="upload-media-thumb" style={{ position: 'relative' }}>
                    {file.url ? (
                      <img src={file.url} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <video
                          src={URL.createObjectURL(mediaFiles[idx])}
                          muted
                          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'grid',
                          placeItems: 'center',
                          pointerEvents: 'none'
                        }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: 'var(--brand-black)',
                            color: '#fff',
                            display: 'grid',
                            placeItems: 'center'
                          }}>
                            <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="icon-button"
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '22px',
                      height: '22px',
                      minHeight: '22px',
                      borderRadius: '50%',
                      background: 'var(--brand-black)',
                      color: '#fff',
                      border: '2px solid var(--surface)',
                      padding: 0,
                      cursor: 'pointer'
                    }}
                    aria-label={`Remove ${file.name}`}
                  >
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', maxWidth: '60px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.15rem', textAlign: 'center' }}>
                    {formatFileSize(file.size)}
                  </div>
                </div>
              ))}
              <div className="media-preview-count" style={{ alignSelf: 'center' }}>
                {filePreviews.length} file{filePreviews.length !== 1 ? 's' : ''} selected
              </div>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          paddingTop: '0.5rem',
          borderTop: '1px solid var(--border)',
          marginTop: '0.5rem'
        }}>
          <button
            type="submit"
            disabled={uploading}
            className="dashboard-btn dashboard-btn--success"
            style={{ minWidth: '180px' }}
          >
            {uploading ? (
              <>
                <svg className="animate-pulse" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Publishing…</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Publish Property Listing</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={uploading}
            className="dashboard-btn dashboard-btn--ghost"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;