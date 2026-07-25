import PropTypes from "prop-types";
import { useEffect, useRef, useCallback } from "react";

const MediaGallery = ({ property, activeMedia, onMediaChange }) => {
  const { images, video, videos } = property;
  const thumbsRef = useRef(null);

  // Aggregate all media (same logic, preserved)
  const allMedia = [];
  if (images) {
    images.forEach((url) => allMedia.push({ type: "image", url }));
  }
  if (video) {
    allMedia.push({ type: "video", url: video });
  }
  if (videos && videos.length > 0) {
    videos.forEach((url) => allMedia.push({ type: "video", url }));
  }

  const isVideo = (item) => item?.type === "video";

  // Keyboard navigation for main viewer
  const handleKeyDown = useCallback(
    (e) => {
      if (!activeMedia || allMedia.length <= 1) return;
      const currentIdx = allMedia.findIndex((m) => m.url === activeMedia.url);
      if (currentIdx === -1) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        onMediaChange(allMedia[(currentIdx + 1) % allMedia.length]);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onMediaChange(
          allMedia[(currentIdx - 1 + allMedia.length) % allMedia.length]
        );
      }
    },
    [activeMedia, allMedia, onMediaChange]
  );

  useEffect(() => {
    const el = thumbsRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Empty state when property has no media at all
  if (allMedia.length === 0) {
    return (
      <div
        className="dashboard-panel empty-state"
        style={{ minHeight: "300px", display: "grid", placeItems: "center" }}
      >
        <div
          className="dashboard-stack"
          style={{ alignItems: "center", gap: "0.75rem" }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "var(--surface-muted)",
              display: "grid",
              placeItems: "center",
              color: "var(--text-muted)",
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p
            style={{
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            No Media Available
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
            This property has no photos or videos yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-stack">
      {/* Main Viewer */}
      <div
        className="dashboard-panel media-viewer animate-fade-in"
        role="region"
        aria-label="Property media viewer"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        {activeMedia ? (
          isVideo(activeMedia) ? (
            <video
              src={activeMedia.url}
              controls
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                background: "#000",
              }}
              aria-label="Property video"
            />
          ) : (
            <img
              src={activeMedia.url}
              alt="Property view"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<span style="color:var(--text-muted);font-size:0.85rem;">Failed to load image</span>';
              }}
            />
          )
        ) : (
          <div className="empty-state" style={{ textAlign: "center" }}>
            <p>Select a thumbnail below to preview</p>
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {allMedia.length > 0 && (
        <div
          className="media-thumbs"
          role="listbox"
          aria-label="Property media thumbnails"
          ref={thumbsRef}
          tabIndex={0}
        >
          {allMedia.map((item, idx) => {
            const isActive = activeMedia?.url === item.url;
            const isVid = isVideo(item);

            return (
              <div
                key={idx}
                onClick={() => onMediaChange(item)}
                role="option"
                aria-selected={isActive}
                tabIndex={-1}
                className={`media-thumb ${isActive ? "is-active" : ""}`}
                title={isVid ? `Video ${idx + 1}` : `Image ${idx + 1}`}
                style={{ position: "relative" }}
              >
                {isVid ? (
                  <>
                    <video
                      src={item.url}
                      muted
                      preload="metadata"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.6,
                      }}
                    />
                    {/* Play overlay */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(0,0,0,0.3)",
                        pointerEvents: "none",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "rgba(255,255,255,0.95)",
                          display: "grid",
                          placeItems: "center",
                          color: "var(--brand-black)",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </>
                ) : (
                  <img
                    src={item.url}
                    alt={`Thumbnail ${idx + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.parentElement.style.background =
                        "var(--surface-muted)";
                      e.target.parentElement.innerHTML =
                        '<span style="font-size:0.7rem;color:var(--text-muted)">Error</span>';
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Media Counter Pill */}
      {activeMedia && allMedia.length > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span className="dashboard-pill" style={{ fontSize: "0.72rem" }}>
            {allMedia.findIndex((m) => m.url === activeMedia.url) + 1} /{" "}
            {allMedia.length}
            {isVideo(activeMedia) ? " — Video" : " — Photo"}
          </span>
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