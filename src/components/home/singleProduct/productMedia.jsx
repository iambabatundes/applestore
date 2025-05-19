import React, { useState } from "react";
import config from "../../../config.json";

export default function ProductMedia({
  selectedMedia,
  fadeClass,
  setIsZoomed,
  isZoomed,
  product,
}) {
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleImageHover = () => {
    setIsZoomed(true);
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { offsetWidth, offsetHeight } = target;

    // Calculate zoom percentage based on mouse position over the image
    const xPercent = (offsetX / offsetWidth) * 100;
    const yPercent = (offsetY / offsetHeight) * 100;

    setZoomPosition({ x: xPercent, y: yPercent });
  };

  const handleImageLeave = () => {
    setIsZoomed(false);
  };

  // Determine default media source
  const defaultMedia =
    selectedMedia?.url ||
    (product.featureImage
      ? `${config.mediaUrl}/uploads/${product.featureImage.filename}`
      : null) ||
    (product.media && product.media.length > 0
      ? `${config.mediaUrl}/uploads/${product.media[0].filename}`
      : "/default-image.jpg");

  return (
    <section className="main-media">
      {selectedMedia && selectedMedia.type === "image" ? (
        <div
          className="zoom-container"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleImageHover}
          onMouseLeave={handleImageLeave}
        >
          <img
            src={defaultMedia}
            alt="Selected media"
            className={`zoom-image ${fadeClass}`}
          />

          {isZoomed && (
            <div
              className={`magnifier ${isZoomed ? "visible" : ""}`}
              style={{
                backgroundImage: `url(${selectedMedia.url})`,
                backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          )}
        </div>
      ) : (
        <video src={defaultMedia} autoPlay controls className="main-video" />
      )}
    </section>
  );
}
