import React from "react";

export default function MediaLibraryUpload({
  mediaData,
  selectedFilter,
  selectedDate,
  selectedMedia,
  uploadMediaModel,
  filteredMedia,
}) {
  return (
    <section>
      <div className="upload-grid">
        {filteredMedia.map((media) => (
          <div
            key={media.id}
            className={`media-item ${
              selectedMedia.includes(media.id) ? "selected" : ""
            }`}
            onClick={() => uploadMediaModel(media.id)}
          >
            {media.fileType === "image" && (
              <img
                className="media-item-img"
                src={media.dataUrl}
                alt={media.fileName}
                type="image"
              />
            )}

            {media.fileType === "video" && (
              <div className="preview">
                <img src="/video.png" alt="Video" />
                <p>{media.fileName}</p>
                {media.fileType === "video" && (
                  <video className="mediaItem-video" src={media.dataUrl} />
                )}
              </div>
            )}

            {media.fileType === "doc" && (
              <div className="preview">
                <img src="/document.png" alt="Video" />
                <p>{media.fileName}</p>
                {media.fileType === "doc" && <a href={media.dataUrl} />}
              </div>
            )}

            {media.fileType === "pdf" && (
              <div className="preview">
                <img src="/document.png" alt="Video" />
                <p>{media.fileName}</p>
                {media.fileType === "pdf" && <a href={media.dataUrl} />}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
