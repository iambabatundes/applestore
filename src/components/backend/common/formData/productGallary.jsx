import React, { useState, useRef, useEffect } from "react";
import "../styles/productGallery.css";
import config from "../../../../config.json";
import Icon from "../../../icon";

export default function ProductGallery({
  isProductGalleryVisible,
  handleProductImagesChange,
  media,
  setMedia,
  errors,
  setErrors,
  darkMode,
}) {
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMinMediaMessage, setShowMinMediaMessage] = useState(false);

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
        setErrors("Only image and video files are allowed.");
        return;
      }

      if (file.size > maxFileSize) {
        setErrors("File size should not exceed 50 MB.");
        return;
      }

      validFiles.push(file);
    }

    if (media.length + validFiles.length < 2) {
      setErrors("Please upload at least 2 media files.");
      setShowMinMediaMessage(true);
      return;
    }

    setErrors("");
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
          handleProductImagesChange({ target: { files: [file] } }); // Call the parent handler
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

  const handleMediaClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
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

  useEffect(() => {
    return () => {
      // Revoke object URLs to avoid memory leaks
      media.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [media]);

  return (
    <>
      {isProductGalleryVisible && (
        <section
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          // className={`drop-zone ${dragging ? "dragging" : ""}`}
          className={`productGallery__drop-zone ${dragging ? "dragging" : ""} ${
            darkMode ? "dark-mode" : ""
          }`}
        >
          {media.length > 0 ? (
            <div className="media-container">
              {media.map((file, index) => {
                let fileUrl;
                if (file instanceof File) {
                  fileUrl = URL.createObjectURL(file);
                } else if (file.filename) {
                  fileUrl = `${config.mediaUrl}/uploads/${file.filename}`;
                } else {
                  fileUrl = "";
                }

                return (
                  <div
                    // className="mediaItems"
                    className={`mediaItems ${darkMode ? "dark-mode" : ""}`}
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={() => handleDragOverMedia(index)}
                    onDragEnd={handleDragEnd}
                  >
                    {file.type?.startsWith("image/") ||
                    file.mimeType?.startsWith("image/") ? (
                      <img
                        src={fileUrl}
                        alt={`Media ${index}`}
                        className="media-preview"
                        onClick={(e) => handleMediaClick(e, index)}
                      />
                    ) : (
                      <video
                        src={fileUrl}
                        className="media-preview"
                        controls
                        onClick={(e) => handleMediaClick(e, index)}
                      />
                    )}
                    <Icon
                      cancel
                      // className="remove-icon"
                      className={`remove-icon ${darkMode ? "dark-mode" : ""}`}
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
                </div>
              </div>
              <div className="productGallery-instruction">
                Click on the image to change or update
              </div>
            </div>
          ) : (
            <div className="productGallery-container">
              <label
                htmlFor="file-input-product-gallery"
                // className="productGallery-label"
                className={`productGallery-label ${
                  darkMode ? "dark-mode" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fileInputRef.current.click();
                }}
              >
                <i className="fas fa-file-upload productGallery-icon"></i>
                <span
                  // className="productGallery-text"
                  className={`productGallery-text ${
                    darkMode ? "dark-mode" : ""
                  }`}
                >
                  {dragging
                    ? "Drop files here"
                    : "Choose files to upload or drag and drop"}
                </span>
                <div className="upload-instruction">
                  Maximum upload file size: 50 MB || Upload at least 2 media
                  files
                </div>
              </label>
              {showMinMediaMessage && (
                <div className="productGallery__min-media-message">
                  Please upload at least 2 media files.
                </div>
              )}
            </div>
          )}
          <input
            accept="image/*,video/*"
            type="file"
            id="file-input-product-gallery"
            multiple
            onChange={handleFileChange}
            className="file-input-product"
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          {progress > 0 && progress < 100 && (
            <div className={`progress-bar ${darkMode ? "dark-mode" : ""}`}>
              <div
                // className="progress-bar-fill"
                className={`progress-bar-fill ${darkMode ? "dark-mode" : ""}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
        </section>
      )}
      {errors.media && (
        <div className="productImage__error-message">{errors.media}</div>
      )}
    </>
  );
}
