import React, { useState, useRef, useEffect } from "react";
import "../styles/productImage.css";
import Icon from "../../../icon";
import config from "../../../../config.json";

export default function ProductImage({
  isFeaturedImageVisible,
  handleImageChange,
  featureImage,
  setFeatureImage,
  errors,
  setErrors,
}) {
  const [dragging, setDragging] = useState(false);
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
      validateAndAddFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const validateAndAddFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        featureImage: "Only image files are allowed.",
      }));
      return;
    }

    const maxFileSize = 20 * 1024 * 1024; // 20 MB
    if (file.size > maxFileSize) {
      setErrors((prev) => ({
        ...prev,
        featureImage: "File size should not exceed 20 MB.",
      }));
      return;
    }

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.featureImage;
      return newErrors;
    });

    const fileUrl = URL.createObjectURL(file);
    const newImage = { file, preview: fileUrl };

    setFeatureImage(newImage);
    handleImageChange({ target: { files: [file] } });
    simulateUploadProgress();
  };

  const simulateUploadProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFile(e.target.files[0]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("Are you sure you want to remove this image?")) {
      // Revoke object URL if it exists
      if (
        featureImage?.preview &&
        !featureImage?.preview.includes("/uploads/")
      ) {
        URL.revokeObjectURL(featureImage.preview);
      }

      setFeatureImage(null);
      handleImageChange({ target: { files: [] } });
      setProgress(0);
    }
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup: Revoke object URLs to avoid memory leaks
      if (
        featureImage?.preview &&
        !featureImage?.preview.includes("/uploads/")
      ) {
        URL.revokeObjectURL(featureImage.preview);
      }
    };
  }, [featureImage]);

  /**
   * Get the proper image URL from various possible sources
   */
  const getImageUrl = () => {
    if (!featureImage) return "";

    // New file upload (has File object)
    if (featureImage.file && featureImage.preview) {
      return featureImage.preview;
    }

    // Existing image from backend (Upload model)
    if (featureImage.url) return featureImage.url;
    if (featureImage.cloudUrl) return featureImage.cloudUrl;
    if (featureImage.publicUrl) return featureImage.publicUrl;

    // Legacy filename-based URL
    if (featureImage.filename) {
      return `${config.mediaUrl}/uploads/${featureImage.filename}`;
    }

    // Direct preview URL (from editing mode)
    if (featureImage.preview) {
      return featureImage.preview;
    }

    return "";
  };

  const imageUrl = getImageUrl();

  return (
    <>
      {isFeaturedImageVisible && (
        <section
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`drop-zone ${dragging ? "dragging" : ""}`}
        >
          {imageUrl ? (
            <div
              className="selected-image-container"
              onClick={handleImageClick}
            >
              <img
                src={imageUrl}
                alt="Feature"
                className="selected-image"
                onError={(e) => {
                  console.error("Image failed to load:", imageUrl);
                  e.target.src = "/placeholder-image.png"; // Fallback image
                }}
              />
              <Icon
                onClick={handleRemoveImage}
                cancel
                width={12}
                height={12}
                fill={"#fff"}
                className="productImage__cancel-icon"
              />
              <div className="productImage-instruction">
                Click on the image to change or update
              </div>
            </div>
          ) : (
            <div className="productImage-container" onClick={handleImageClick}>
              <label
                htmlFor="file-input-product-image"
                className="productImage-label"
              >
                <i className="fas fa-file-upload productImage-icon"></i>
                <span className="productImage-text">
                  {dragging
                    ? "Drop files here"
                    : "Choose files to upload or drag and drop"}
                </span>
                <div className="upload-instruction">
                  Maximum upload file size: 20 MB
                </div>
              </label>
            </div>
          )}
          <input
            accept="image/*"
            type="file"
            id="file-input-product-image"
            onChange={handleFileChange}
            className="file-input-product"
            ref={fileInputRef}
            style={{ display: "none" }}
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
      {errors.featureImage && (
        <div className="productImage__error-message">{errors.featureImage}</div>
      )}
    </>
  );
}
