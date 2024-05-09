import React from "react";
import config from "../../../config.json";

export default function MediaLibraryUpload({
  filteredMedia,
  selectedMedia,
  uploadMediaModel,
}) {
  return (
    <section>
      <div className="upload-grid">
        {filteredMedia.map((media) => (
          <div
            key={media._id}
            className={`media-item ${
              selectedMedia.includes(media.filename) ? "selected" : ""
            }`}
            onClick={() => uploadMediaModel(media._id)}
          >
            {media.mimeType.startsWith("image/") && ( // Check if it's an image
              <img
                className="media-item-img"
                // crossorigin="anonymous"
                src={config.mediaUrl + `/uploads/${media.filename}`} // Assuming images are stored in the root directory
                content="form-meta"
                alt={media.originalName} // Use originalName as alt text
              />
            )}
            {media.mimeType.startsWith("video/") && ( // Check if it's a video
              <div className="preview">
                <img src="/video.png" alt="Video" />
                <p>{media.originalName}</p>
                <video className="mediaItem-video" controls>
                  <source src={`/${media.filename}`} type={media.mimeType} />
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
