import PropTypes from "prop-types";

const MediaGallery = ({ property, activeMedia, onMediaChange }) => {
  const { images, video, videos } = property;

  const allMedia = [];
  if (images) {
    images.forEach((url) => allMedia.push({ type: "image", url }));
  }
  // If there's a single video field
  if (video) {
    allMedia.push({ type: "video", url: video });
  }
  // If there's an array of videos (optional)
  if (videos && videos.length > 0) {
    videos.forEach((url) => allMedia.push({ type: "video", url }));
  }

  const isVideo = (item) => item.type === "video";

  return (
    <div className="dashboard-stack">
      {/* Main viewer */}
      <div
        className="dashboard-panel"
        style={{
          height: "420px",
          background: "var(--surface-muted)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: 0,
        }}
      >
        {activeMedia ? (
          isVideo(activeMedia) ? (
            <video src={activeMedia.url} controls style={{ width: "100%", maxHeight: "100%" }} />
          ) : (
            <img src={activeMedia.url} alt="Main view" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          )
        ) : (
          <span className="dashboard-text-muted">No media uploaded</span>
        )}
      </div>

      {/* Thumbnails */}
      {allMedia.length > 0 && (
        <div className="dashboard-inline-actions" style={{ overflowX: "auto", paddingBottom: "0.5rem", gap: "0.5rem" }}>
          {allMedia.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onMediaChange(item)}
              style={{
                width: "80px",
                height: "60px",
                flexShrink: 0,
                cursor: "pointer",
                border: activeMedia?.url === item.url ? "3px solid var(--primary)" : "1px solid var(--border)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                background: "var(--surface-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              {isVideo(item) ? (
                <span>▶ Video</span>
              ) : (
                <img src={item.url} alt={`thumb-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

MediaGallery.propTypes = {
  property: PropTypes.object.isRequired,
  activeMedia: PropTypes.object,
  onMediaChange: PropTypes.func.isRequired,
};

export default MediaGallery;