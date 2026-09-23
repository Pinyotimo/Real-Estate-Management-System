import { useEffect, useRef, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  ImageOff,
  Film,
  Camera,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const MediaGallery = ({ property, activeMedia, onMediaChange }) => {
  const containerRef = useRef(null);
  const activeThumbRef = useRef(null);

  // Aggregate images and videos safely
  const allMedia = useMemo(() => {
    const media = [];
    if (property?.images) {
      property.images.forEach((url) => media.push({ type: "image", url }));
    }
    if (property?.video) {
      media.push({ type: "video", url: property.video });
    }
    if (property?.videos && Array.isArray(property.videos)) {
      property.videos.forEach((url) => media.push({ type: "video", url }));
    }
    return media;
  }, [property]);

  const isVideo = (item) => item?.type === "video";

  // Calculate current active index
  const currentIndex = useMemo(() => {
    if (!activeMedia || allMedia.length === 0) return 0;
    const idx = allMedia.findIndex((m) => m.url === activeMedia.url);
    return idx >= 0 ? idx : 0;
  }, [activeMedia, allMedia]);

  // Navigate to previous media item
  const handlePrev = useCallback(() => {
    if (allMedia.length <= 1) return;
    const prevIdx = (currentIndex - 1 + allMedia.length) % allMedia.length;
    onMediaChange(allMedia[prevIdx]);
  }, [allMedia, currentIndex, onMediaChange]);

  // Navigate to next media item
  const handleNext = useCallback(() => {
    if (allMedia.length <= 1) return;
    const nextIdx = (currentIndex + 1) % allMedia.length;
    onMediaChange(allMedia[nextIdx]);
  }, [allMedia, currentIndex, onMediaChange]);

  // Keyboard arrow listener
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    },
    [handleNext, handlePrev]
  );

  // Scroll active thumbnail into center view
  useEffect(() => {
    if (activeThumbRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  // Empty state when no media is available
  if (allMedia.length === 0) {
    return (
      <Card className="border-border bg-card rounded-3xl p-10 text-center min-h-[340px] flex flex-col items-center justify-center space-y-3 shadow-xs">
        <CardContent className="p-0 flex flex-col items-center space-y-3">
          <div className="w-14 h-14 bg-muted text-muted-foreground rounded-2xl flex items-center justify-center shadow-xs">
            <ImageOff className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-foreground">
              No Media Available
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
              This property listing currently has no images or videos uploaded.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="space-y-4 outline-none group focus-visible:ring-2 focus-visible:ring-primary/20 rounded-3xl"
    >
      {/* Main Media Showcase Container */}
      <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[480px] bg-black rounded-3xl overflow-hidden border border-border shadow-md flex items-center justify-center group/viewer">
        {activeMedia ? (
          isVideo(activeMedia) ? (
            <video
              src={activeMedia.url}
              controls
              autoPlay
              muted
              className="w-full h-full object-contain bg-black"
              aria-label="Property video preview"
            />
          ) : (
            <img
              src={activeMedia.url}
              alt="Property showcase view"
              className="w-full h-full object-cover select-none transition-all duration-300"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `
                  <div class="flex flex-col items-center gap-2 text-muted-foreground">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span class="text-xs font-medium">Failed to load main image</span>
                  </div>
                `;
              }}
            />
          )
        ) : (
          <div className="text-center text-muted-foreground text-sm">
            Select a thumbnail below to preview
          </div>
        )}

        {/* Overlay Navigation Controls (Visible on Hover/Focus) */}
        {allMedia.length > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={handlePrev}
              aria-label="Previous media"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm opacity-0 group-hover/viewer:opacity-100 transition-all duration-200 active:scale-95 cursor-pointer shadow-lg border border-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={handleNext}
              aria-label="Next media"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-sm opacity-0 group-hover/viewer:opacity-100 transition-all duration-200 active:scale-95 cursor-pointer shadow-lg border border-white/10"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}

        {/* Floating Counter Badge */}
        {activeMedia && allMedia.length > 0 && (
          <Badge
            variant="secondary"
            className="absolute bottom-4 right-4 gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-semibold border border-white/10 shadow-lg hover:bg-black/80"
          >
            {isVideo(activeMedia) ? (
              <Film className="w-3.5 h-3.5 text-primary" />
            ) : (
              <Camera className="w-3.5 h-3.5 text-primary" />
            )}
            <span>
              {currentIndex + 1} / {allMedia.length}
            </span>
            <span className="text-white/60 font-normal border-l border-white/20 pl-1.5 ml-0.5 capitalize">
              {activeMedia.type}
            </span>
          </Badge>
        )}
      </div>

      {/* Horizontal Thumbnail Scrollbar */}
      {allMedia.length > 0 && (
        <div className="relative">
          <div
            role="listbox"
            aria-label="Property media thumbnails"
            className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-muted-foreground/20 snap-x"
          >
            {allMedia.map((item, idx) => {
              const isActive = activeMedia?.url === item.url;
              const isVid = isVideo(item);

              return (
                <button
                  key={idx}
                  ref={isActive ? activeThumbRef : null}
                  type="button"
                  onClick={() => onMediaChange(item)}
                  role="option"
                  aria-selected={isActive}
                  className={`relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200 snap-center outline-none cursor-pointer ${
                    isActive
                      ? "border-primary ring-2 ring-primary/30 scale-100 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100 scale-95"
                  }`}
                  title={
                    isVid ? `Watch Video ${idx + 1}` : `View Photo ${idx + 1}`
                  }
                >
                  {isVid ? (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <video
                        src={item.url}
                        muted
                        preload="metadata"
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="w-7 h-7 rounded-full bg-white/90 text-black flex items-center justify-center shadow-md">
                          <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={`Thumbnail ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.className +=
                          " bg-muted flex items-center justify-center text-[10px] text-muted-foreground";
                        e.target.parentElement.innerText = "Error";
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
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