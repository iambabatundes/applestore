import React, { useState } from "react";
import "./styles/mediaProduct.css";
import productImage from "./images/produ3.avif";
import productImage1 from "./images/bac1.jpg";
import productImage2 from "./images/produ2.avif";
import productImage3 from "./images/produ1.avif";
import productImage4 from "./images/produ4.avif";
import productVideo1 from "./videos/thankYOufoun.mp4";
import productVideo2 from "./videos/video1.mp4";
import ShippingDetails from "./common/shippingDetails";

const mediaData = [
  { type: "image", medias: productImage },
  { type: "image", medias: productImage4 },
  { type: "image", medias: productImage1 },
  { type: "video", medias: productVideo1 },
  { type: "image", medias: productImage2 },
  { type: "video", medias: productVideo2 },
  { type: "image", medias: productImage3 },
];

export default function SingleProduct() {
  const [selectedMedia, setSelectedMedia] = useState(mediaData[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const handleMediaClick = (media) => {
    setSelectedMedia(media);
    setIsZoomed(false); // Reset zoom when switching media
  };

  const handleImageHover = (e) => {
    const { offsetX, offsetY, target } = e.nativeEvent;
    const { offsetWidth, offsetHeight } = target;
    const x = (offsetX / offsetWidth) * 100;
    const y = (offsetY / offsetHeight) * 100;
    setZoomPosition({ x, y });
    setIsZoomed(true);
  };

  const handleImageLeave = () => {
    setIsZoomed(false);
  };

  return (
    <section className="singleProduct-container">
      <div className="singleProduct__left">
        <section className="singleProduct__productMedia">
          <div className="media-thumbnails">
            {mediaData.map((media, index) => (
              <div
                key={index}
                className={`thumbnail ${
                  selectedMedia.medias === media.medias ? "active" : ""
                }`}
                onClick={() => handleMediaClick(media)}
              >
                {media.type === "image" ? (
                  <img
                    src={media.medias}
                    alt={`Media ${index}`}
                    className="singleImage__productImage"
                  />
                ) : (
                  <video
                    src={media.medias}
                    muted
                    className="singleImage__productVideo"
                  />
                )}
              </div>
            ))}
          </div>

          <section className="main-media">
            {selectedMedia.type === "image" ? (
              <div
                className="zoom-container"
                onMouseMove={handleImageHover}
                onMouseLeave={handleImageLeave}
              >
                <img
                  src={selectedMedia.medias}
                  alt="Selected media"
                  className="main-image"
                />
                {isZoomed && (
                  <div
                    className="zoomed-image"
                    style={{
                      backgroundImage: `url(${selectedMedia.medias})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                )}
              </div>
            ) : (
              <video
                src={selectedMedia.medias}
                controls
                className="main-video"
              />
            )}
          </section>
        </section>

        <section>
          <h1>
            Pro 4 TWS Wireless Headphones Earphone Bluetooth-compatible 5.3
            Waterproof Headset with Mic for Xiaomi iPhone Pro4 Earbuds
          </h1>
        </section>
      </div>
      <div className="singleProduct__shippingDetail">
        <ShippingDetails />
      </div>
    </section>
  );
}
