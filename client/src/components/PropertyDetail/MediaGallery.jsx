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
      <div className="dashboard-panel media-viewer">
        {activeMedia ? (
          isVideo(activeMedia) ? (
            <video src={activeMedia.url} controls />
          ) : (
            <img src={activeMedia.url} alt="Main view" />
          )
        ) : (
          <span className="dashboard-text-muted">No media uploaded</span>
        )}
      </div>

      {allMedia.length > 0 && (
        <div className="media-thumbs" aria-label="Property media thumbnails">
          {allMedia.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onMediaChange(item)}
              className={`media-thumb ${activeMedia?.url === item.url ? "is-active" : ""}`}
            >
              {isVideo(item) ? (
                <span>Video</span>
              ) : (
                <img src={item.url} alt={`Thumbnail ${idx + 1}`} />
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
