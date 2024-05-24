import React, { useState, useRef } from "react";
import "../styles/productGallery.css";
import Icon from "../../../icon";

export default function ProductGallery({
  isProductGalleryVisible,
  handleProductImagesChange,
  media,
  setMedia,
}) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const validateAndAddFiles = (files) => {
    const validFiles = [];
    const maxFileSize = 50 * 1024 * 1024; // 50 MB

    for (let file of files) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        setError("Only image and video files are allowed.");
        return;
      }

      if (file.size > maxFileSize) {
        setError("File size should not exceed 50 MB.");
        return;
      }

      validFiles.push(file);
    }

    setError("");
    setProgress(0); // Reset progress
    uploadFiles(validFiles);
  };

  const uploadFiles = (files) => {
    const uploadProgress = files.map(() => 0);
    const updateProgress = () => {
      const total = uploadProgress.reduce((acc, val) => acc + val, 0);
      setProgress((total / (files.length * 100)) * 100);
    };

    files.forEach((file, index) => {
      // Simulating upload with a timeout
      const simulateUpload = () => {
        uploadProgress[index] += 10;
        updateProgress();
        if (uploadProgress[index] < 100) {
          setTimeout(simulateUpload, 100);
        } else {
          setMedia((prevMedia) => [...prevMedia, file]);
        }
      };
      simulateUpload();
    });
  };

  const handleRemoveMedia = (index) => {
    if (window.confirm("Are you sure you want to remove this media?")) {
      setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
    }
  };

  const handleMediaClick = (index) => {
    if (fileInputRef.current) {
      fileInputRef.current.dataset.index = index;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    validateAndAddFiles(files);
    fileInputRef.current.value = null; // Reset the file input
  };

  const handleDragStart = (index) => {
    setDragging(index);
  };

  const handleDragOverMedia = (index) => {
    if (dragging === index) return;
    const reorderedMedia = [...media];
    const [draggedItem] = reorderedMedia.splice(dragging, 1);
    reorderedMedia.splice(index, 0, draggedItem);
    setMedia(reorderedMedia);
    setDragging(index);
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  return (
    <>
      {isProductGalleryVisible && (
        <section
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`drop-zone ${dragging ? "dragging" : ""}`}
        >
          {media.length > 0 ? (
            <div className="media-container">
              {media.map((file, index) => {
                const fileUrl = URL.createObjectURL(file);
                return (
                  <div
                    className="mediaItems"
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={() => handleDragOverMedia(index)}
                    onDragEnd={handleDragEnd}
                  >
                    {file.type.startsWith("image/") ? (
                      <img
                        src={fileUrl}
                        alt={`Media ${index}`}
                        className="media-preview"
                        onClick={() => handleMediaClick(index)}
                      />
                    ) : (
                      <video
                        src={fileUrl}
                        className="media-preview"
                        controls
                        onClick={() => handleMediaClick(index)}
                      />
                    )}
                    <Icon
                      cancel
                      className="remove-icon"
                      width={8}
                      height={8}
                      fill={"#fff"}
                      onClick={() => handleRemoveMedia(index)}
                    />
                  </div>
                );
              })}
              <div
                className="mediaItems add-more"
                onClick={() => fileInputRef.current.click()}
              >
                <div className="add-more-content">
                  <i className="fa fa-plus-circle"></i>
                  {/* <span>Click to add more images/video</span> */}
                </div>
              </div>
              <div className="productGallery-instruction">
                Click on the image to change or update
              </div>
            </div>
          ) : (
            <div className="productGallery-container">
              <label
                htmlFor="file-input-product"
                className="productGallery-label"
                onClick={() => fileInputRef.current.click()}
              >
                <i className="fas fa-file-upload productGallery-icon"></i>
                <span className="productGallery-text">
                  {dragging
                    ? "Drop files here"
                    : "Choose files to upload or drag and drop"}
                </span>
                <div className="upload-instruction">
                  Maximum upload file size: 50 MB
                </div>
              </label>
            </div>
          )}
          <input
            accept="image/*,video/*"
            type="file"
            id="file-input-product"
            multiple
            onChange={handleFileChange}
            className="file-input-product"
            ref={fileInputRef}
          />
          {progress > 0 && progress < 100 && (
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </section>
      )}
      {error && <div className="productGallary__error-message">{error}</div>}
    </>
  );
}
