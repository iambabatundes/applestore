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
      setErrors("Only image files are allowed.");
      return;
    }

    const maxFileSize = 20 * 1024 * 1024; // 20 MB
    if (file.size > maxFileSize) {
      setErrors("File size should not exceed 20 MB.");
      return;
    }

    setErrors("");
    const fileUrl = URL.createObjectURL(file);
    setFeatureImage({ file, preview: fileUrl });
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
    fileInputRef.current.value = null;
  };

  const handleRemoveImage = () => {
    if (window.confirm("Are you sure you want to remove this image?")) {
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
      // Revoke object URLs to avoid memory leaks
      if (featureImage && featureImage.preview) {
        URL.revokeObjectURL(featureImage.preview);
      }
    };
  }, [featureImage]);

  let imageUrl = "";
  if (featureImage) {
    if (featureImage.preview && featureImage) {
      imageUrl = featureImage.preview;
    } else if (featureImage.filename) {
      imageUrl = `${config.mediaUrl}/uploads/${featureImage.filename}`;
    }
  }

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
              <img src={imageUrl} alt="Uploaded" className="selected-image" />
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
                  Maximum upload file size: 50 MB
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
