import React, { useState } from "react";
import "./styles/fileUpload.css";
import { handleFileChange } from "./fileUploadHandler";

export default function FileUpload({
  uploadProgress,
  setUploadProgress,
  setMediaData,
  setNotification,
  setSelectedFiles, // Add this prop
  onUploadSuccess, // Add this prop
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    const file = event.dataTransfer.files[0];
    handleImageChange({ target: { files: [file] } });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const mimeType = file.type.split("/")[0];
      if (mimeType === "image") {
        setIsUploading(true);
        setErrorMessage("");
        handleFileChange(
          event,
          setUploadProgress,
          setMediaData,
          setSelectedFiles, // Pass the prop
          null,
          setNotification
        ).then(() => {
          onUploadSuccess(file); // Notify parent on success
          setIsUploading(false);
        });
      } else {
        setErrorMessage("Only images are allowed.");
      }
    }
  };

  return (
    <div className="file-upload-container">
      <section
        className={`file-upload-main ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="fileUpload__section">
          <div className="uploadContent">
            <div className="uploadContainer">
              <label htmlFor="fileInput" className="fileUpload__label">
                <i className="fas fa-image"></i>
                <span className="fileUpload-text">
                  {isDragging
                    ? "Drop image here"
                    : "Choose an image to upload or drag and drop"}
                </span>
              </label>
              <input
                type="file"
                id="fileInput"
                onChange={handleImageChange}
                className="fileUpload__input"
                accept="image/*"
                aria-label="File upload input"
              />
            </div>

            <div className="file__upload-info">
              <h4>
                Maximum upload file size: <span>50 MB</span>
              </h4>
            </div>

            {errorMessage && (
              <div className="file__upload-error">
                <p>{errorMessage}</p>
              </div>
            )}

            {isUploading && (
              <div className="file__upload-spinner">
                <i className="fas fa-spinner fa-spin"></i> Uploading...
              </div>
            )}
          </div>

          {uploadProgress > 0 && (
            <div className="file__progress-bar">
              <div
                className="file__progress-bar-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span className="file__progress-bar-text">{uploadProgress}%</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
