import React from "react";
import config from "../../../config.json";
import "../styles/singleProduct.css";

export default function MediaThumbnails({
  mediaData,
  selectedMedia,
  onMediaClick,
  product,
}) {
  let mediaList = [];

  if (product.featureImage) {
    mediaList.push({
      filename: product.featureImage.filename,
      mimeType: "image",
      isFeature: true,
    });
  }

  if (product.colorImages && product.colorImages.length > 0) {
    mediaList = mediaList.concat(
      product.colorImages.map((image) => ({
        filename: image.filename,
        mimeType: "image",
        isColorImage: true,
      }))
    );
  }

  if (mediaData && Array.isArray(mediaData)) {
    mediaList = mediaList.concat(mediaData);
  }

  return (
    <div className="media-thumbnails">
      {mediaList.map((media, index) => {
        const mediaUrl = `${config.mediaUrl}/uploads/${media.filename}`;

        return (
          <div
            key={index}
            className={`thumbnail ${
              selectedMedia?.url === mediaUrl ? "active" : ""
            } ${media.isFeature ? "feature-thumbnail" : ""}`}
            onClick={() => onMediaClick(media)}
            onMouseEnter={() => onMediaClick(media)}
          >
            {media.mimeType.startsWith("image") ? (
              <img
                src={mediaUrl}
                alt={`Media ${index}`}
                className="singleImage__productImage"
              />
            ) : (
              <video
                src={mediaUrl}
                muted
                className="singleImage__productVideo"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
