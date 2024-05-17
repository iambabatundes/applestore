import React from "react";
import config from "../../../config.json";
import "./styles/MediaLibraryUpload.css";

export default function MediaLibraryUpload({
  filteredMedia,
  selectedMedia,
  handleFileSelect,
}) {
  return (
    <section>
      <div className="upload-grid">
        {filteredMedia.map((media) => (
          <div
            key={media._id}
            className={`media-item ${
              selectedMedia.includes(media._id) ? "selected" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleFileSelect(media._id);
            }}
          >
            {selectedMedia.includes(media._id) && (
              <div className="check-icon">
                <i className="fas fa-check"></i>
              </div>
            )}
            {media.mimeType && media.mimeType.startsWith("image/") && (
              <img
                className="media-item-img"
                src={`${config.mediaUrl}/uploads/${
                  media.filename
                }?${new Date().getTime()}`} // Add cache-busting query parameter
                alt={media.originalName}
              />
            )}
            {media.mimeType && media.mimeType.startsWith("video/") && (
              <div className="preview">
                <img src="/video.png" alt="Video" />
                <p>{media.originalName}</p>
                <video className="mediaItem-video" controls>
                  <source
                    src={config.mediaUrl + `/uploads/${media.filename}`}
                    type={media.mimeType}
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
