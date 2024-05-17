import React, { useState } from "react";
import "./styles/mediaUpload.css";

export default function MediaUpload({
  showMediaUpload,
  handleUploadCancel,
  onChange,
  uploadProgress,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    onChange({ target: { files } });
  };

  return (
    <div className={`media-upload-container ${showMediaUpload ? "show" : ""}`}>
      {showMediaUpload && (
        <section
          className={`media-upload-main ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="media-upload-section">
            <span className="media-cancel" onClick={handleUploadCancel}>
              <i className="fa fa-times" aria-hidden="true"></i>
            </span>

            <div className="upload-content">
              <div className="upload-container">
                <label htmlFor="file-input" className="upload-label">
                  <i className="fas fa-file-upload upload-icon"></i>
                  <span className="upload-text">
                    {isDragging
                      ? "Drop files here"
                      : "Choose files to upload or drag and drop"}
                  </span>
                </label>
                <input
                  type="file"
                  id="file-input"
                  onChange={onChange}
                  className="file-input"
                  multiple
                />
              </div>

              <div className="upload-info">
                <h4>
                  Maximum upload file size: <span>50 MB</span>
                </h4>
              </div>
            </div>

            {uploadProgress > 0 && (
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <span className="progress-bar-text">{uploadProgress}%</span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
