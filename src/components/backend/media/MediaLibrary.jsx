import React from "react";

export default function MediaLibrary({
  mediaData,
  selectedFilter,
  selectedDate,
}) {
  return (
    <section>
      <div className="upload-grid">
        {mediaData
          .filter(
            (media) =>
              (!selectedFilter || media.fileType === selectedFilter) &&
              (!selectedDate || media.date === selectedDate)
          )
          .map((media) => (
            <div className="media-item" key={media.id}>
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
                  {media.fileType === "video" && <video src={media.dataUrl} />}
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
