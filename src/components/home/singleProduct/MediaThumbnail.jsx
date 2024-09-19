import React from "react";

export default function MediaThumbnails({
  mediaData,
  selectedMedia,
  onMediaClick,
}) {
  return (
    <div className="media-thumbnails">
      {mediaData.map((media, index) => (
        <div
          key={index}
          className={`thumbnail ${
            selectedMedia.url === media.url ? "active" : ""
          }`}
          onClick={() => onMediaClick(media)}
          onMouseEnter={() => onMediaClick(media)}
        >
          {media.type === "image" ? (
            <img
              src={media.url}
              alt={`Media ${index}`}
              className="singleImage__productImage"
            />
          ) : (
            <video
              src={media.url}
              muted
              className="singleImage__productVideo"
            />
          )}
        </div>
      ))}
    </div>
  );
}
