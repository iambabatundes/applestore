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
  const [draggedIndex, setDraggedIndex] = useState(null);
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
    const errors = [];

    for (let file of files) {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        errors.push(`${file.name}: Only image and video files are allowed.`);
        continue;
      }

      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File size should not exceed 50 MB.`);
        continue;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      setErrors((prev) => ({
        ...prev,
        media: errors.join(" "),
      }));
      return;
    }

    if (media.length + validFiles.length < 2) {
      setErrors((prev) => ({
        ...prev,
        media: "Please upload at least 2 media files.",
      }));
      setShowMinMediaMessage(true);
      return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.media;
      return newErrors;
    });

    setShowMinMediaMessage(false);
    setProgress(0);
    uploadFiles(validFiles);
  };

  const uploadFiles = (files) => {
    const uploadProgress = files.map(() => 0);
    const updateProgress = () => {
      const total = uploadProgress.reduce((acc, val) => acc + val, 0);
      setProgress((total / (files.length * 100)) * 100);
    };

    files.forEach((file, index) => {
      const simulateUpload = () => {
        uploadProgress[index] += 10;
        updateProgress();
        if (uploadProgress[index] < 100) {
          setTimeout(simulateUpload, 100);
        } else {
          const preview = URL.createObjectURL(file);
          const mediaItem = {
            file,
            preview,
            type: file.type,
            mimeType: file.type,
          };
          setMedia((prevMedia) => [...prevMedia, mediaItem]);
          handleProductImagesChange({ target: { files: [file] } });
        }
      };
      simulateUpload();
    });
  };

  const handleRemoveMedia = (index, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to remove this media?")) {
      setMedia((prevMedia) => {
        const mediaToRemove = prevMedia[index];

        // Revoke object URL if it's a new upload (not from backend)
        if (
          mediaToRemove?.preview &&
          !mediaToRemove?.preview.includes("/uploads/")
        ) {
          URL.revokeObjectURL(mediaToRemove.preview);
        }

        return prevMedia.filter((_, i) => i !== index);
      });
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
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOverMedia = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const reorderedMedia = [...media];
    const [draggedItem] = reorderedMedia.splice(draggedIndex, 1);
    reorderedMedia.splice(index, 0, draggedItem);
    setMedia(reorderedMedia);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  useEffect(() => {
    return () => {
      // Cleanup: Revoke object URLs to avoid memory leaks
      media.forEach((mediaItem) => {
        if (mediaItem?.preview && !mediaItem?.preview.includes("/uploads/")) {
          URL.revokeObjectURL(mediaItem.preview);
        }
      });
    };
  }, []);

  /**
   * Get the proper media URL from various possible sources
   */
  const getMediaUrl = (mediaItem) => {
    if (!mediaItem) return null;

    // New file upload (has File object)
    if (mediaItem.file && mediaItem.preview) {
      return mediaItem.preview;
    }

    // Existing media from backend (Upload model)
    if (mediaItem.url) return mediaItem.url;
    if (mediaItem.cloudUrl) return mediaItem.cloudUrl;
    if (mediaItem.publicUrl) return mediaItem.publicUrl;

    // Legacy filename-based URL
    if (mediaItem.filename) {
      return `${config.mediaUrl}/uploads/${mediaItem.filename}`;
    }

    // Direct preview URL (from editing mode)
    if (mediaItem.preview) {
      return mediaItem.preview;
    }

    return null;
  };

  /**
   * Check if media is a video
   */
  const isVideo = (mediaItem) => {
    if (mediaItem.type?.startsWith("video/")) return true;
    if (mediaItem.mimeType?.startsWith("video/")) return true;
    return false;
  };

  return (
    <>
      {isProductGalleryVisible && (
        <section
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`productGallery__drop-zone ${dragging ? "dragging" : ""} ${
            darkMode ? "dark-mode" : ""
          }`}
        >
          {media.length > 0 ? (
            <div className="media-container">
              {media.map((mediaItem, index) => {
                const fileUrl = getMediaUrl(mediaItem);

                return (
                  <div
                    className={`mediaItems ${darkMode ? "dark-mode" : ""}`}
                    key={mediaItem._id || index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOverMedia(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {isVideo(mediaItem) ? (
                      <video
                        src={fileUrl}
                        className="media-preview"
                        controls
                        onClick={(e) => handleMediaClick(e, index)}
                        onError={(e) => {
                          console.error("Video failed to load:", fileUrl);
                        }}
                      />
                    ) : (
                      <img
                        src={fileUrl}
                        alt={`Media ${index + 1}`}
                        className="media-preview"
                        onClick={(e) => handleMediaClick(e, index)}
                        onError={(e) => {
                          console.error("Image failed to load:", fileUrl);
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                    )}
                    <Icon
                      cancel
                      className={`remove-icon ${darkMode ? "dark-mode" : ""}`}
                      width={8}
                      height={8}
                      fill={"#fff"}
                      onClick={(e) => handleRemoveMedia(index, e)}
                    />
                  </div>
                );
              })}
              <div
                className="mediaItems add-more"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="add-more-content">
                  <i className="fa fa-plus-circle"></i>
                </div>
              </div>
              <div className="productGallery-instruction">
                Click on the image to change or update. Drag to reorder.
              </div>
            </div>
          ) : (
            <div className="productGallery-container">
              <label
                htmlFor="file-input-product-gallery"
                className={`productGallery-label ${
                  darkMode ? "dark-mode" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                <i className="fas fa-file-upload productGallery-icon"></i>
                <span
                  className={`productGallery-text ${
                    darkMode ? "dark-mode" : ""
                  }`}
                >
                  {dragging
                    ? "Drop files here"
                    : "Choose files to upload or drag and drop"}
                </span>
                <div className="upload-instruction">
                  Maximum upload file size: 50MB || Upload at least 2 media
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
