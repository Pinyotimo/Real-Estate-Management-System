import SectionIcon from "./SectionIcon";

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MediaUploadFields = ({ fileInputRef, mediaFiles, filePreviews, onMediaChange, onRemoveFile }) => (
  <div className="dashboard-panel" style={{ borderLeft: "4px solid var(--brand-light-blue)", paddingLeft: "1rem" }}>
    <div className="add-property-section-heading" style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
      <SectionIcon>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </SectionIcon>
      Media Upload
    </div>

    <label className="dashboard-label" htmlFor="media">
      Photos & Videos <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(Up to 10 images + 2 videos)</span>
    </label>

    <div
      onClick={() => fileInputRef.current?.click()}
      style={{
        border: "2px dashed var(--border)",
        borderRadius: "var(--radius)",
        padding: "1.5rem",
        textAlign: "center",
        cursor: "pointer",
        background: "var(--surface-soft)",
        transition: "border-color var(--transition), background var(--transition)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--brand-blue)";
        e.currentTarget.style.background = "var(--brand-very-light-blue)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.background = "var(--surface-soft)";
      }}
    >
      <div style={{
        width: "48px", height: "48px", borderRadius: "50%", background: "var(--surface)",
        border: "1px solid var(--border)", display: "grid", placeItems: "center",
        margin: "0 auto 0.75rem", color: "var(--brand-blue)",
      }}>
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 0.25rem" }}>
        Click to upload photos & videos
      </p>
      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
        JPG, PNG, MP4 — Max 12 files
      </p>
    </div>

    <input
      ref={fileInputRef}
      id="media"
      type="file"
      multiple
      accept="image/*,video/*"
      onChange={onMediaChange}
      style={{ display: "none" }}
    />

    {filePreviews.length > 0 && (
      <div className="media-preview-row" style={{ marginTop: "1rem" }}>
        {filePreviews.map((file, idx) => (
          <div key={idx} style={{ position: "relative" }}>
            <div className="upload-media-thumb" style={{ position: "relative" }}>
              {file.url ? (
                <img src={file.url} alt={file.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <>
                  <video src={URL.createObjectURL(mediaFiles[idx])} muted style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                  <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--brand-black)", color: "#fff", display: "grid", placeItems: "center" }}>
                      <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemoveFile(idx)}
              className="icon-button"
              style={{
                position: "absolute", top: "-6px", right: "-6px", width: "22px", height: "22px", minHeight: "22px",
                borderRadius: "50%", background: "var(--brand-black)", color: "#fff", border: "2px solid var(--surface)",
                padding: 0, cursor: "pointer",
              }}
              aria-label={`Remove ${file.name}`}
            >
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", maxWidth: "60px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "0.15rem", textAlign: "center" }}>
              {formatFileSize(file.size)}
            </div>
          </div>
        ))}
        <div className="media-preview-count" style={{ alignSelf: "center" }}>
          {filePreviews.length} file{filePreviews.length !== 1 ? "s" : ""} selected
        </div>
      </div>
    )}
  </div>
);

export default MediaUploadFields;