import React from "react";
import config from "../../../config.json";

export default function MobileMediaCarousel({
  mergedMediaList,
  zoomMedia,
  setZoomMedia,
}) {
  return (
    <>
      <div className="product-media-carousel">
        {mergedMediaList.map((media, index) => {
          const mediaUrl = `${config.mediaUrl}/uploads/${media.filename}`;
          return media.mimeType.startsWith("image") ? (
            <img
              key={index}
              src={mediaUrl}
              alt={`media-${index}`}
              className="media-slide"
              onClick={() => setZoomMedia(mediaUrl)}
            />
          ) : (
            <video
              key={index}
              src={mediaUrl}
              muted
              autoPlay
              loop
              playsInline
              className="media-slide"
            />
          );
        })}
      </div>
      {zoomMedia && (
        <div className="zoom-overlay" onClick={() => setZoomMedia(null)}>
          <button className="zoom-close-btn" onClick={() => setZoomMedia(null)}>
            ×
          </button>
          <img src={zoomMedia} alt="Zoomed" className="zoomed-media" />
        </div>
      )}
    </>
  );
}
