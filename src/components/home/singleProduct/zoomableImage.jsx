import React, { useState } from "react";

export default function ZoomableImage({ src, fadeClass }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { offsetWidth, offsetHeight } = target;
    const xPercent = (offsetX / offsetWidth) * 100;
    const yPercent = (offsetY / offsetHeight) * 100;
    setZoomPosition({ x: xPercent, y: yPercent });
  };

  const handleImageHover = () => {
    setIsZoomed(true);
  };

  const handleImageLeave = () => {
    setIsZoomed(false);
  };

  return (
    <div
      className="zoom-container"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleImageHover}
      onMouseLeave={handleImageLeave}
    >
      <img src={src} alt="Zoomable" className={`zoom-image ${fadeClass}`} />
      {isZoomed && (
        <div
          className="magnifier"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
        />
      )}
    </div>
  );
}
