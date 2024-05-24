import React, { useState, useRef } from "react";
import "../styles/productImage.css";
import Icon from "../../../icon";

export default function ProductImage({
  isFeaturedImageVisible,
  handleImageChange,
  featureImage,
  setFeatureImage,
}) {
  const [dragging, setDragging] = useState(false);
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
      handleImageChange({ target: { files: e.dataTransfer.files } });
      e.dataTransfer.clearData();
    }
  };

  const handleRemoveImage = () => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setFeatureImage(null);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {isFeaturedImageVisible && (
        <section
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`drop-zone ${dragging ? "dragging" : ""}`}
        >
          {featureImage ? (
            <div className="selected-image-container">
              <img
                src={featureImage}
                alt="Uploaded"
                className="selected-image"
                onClick={handleImageClick}
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
            <div className="productImage-container">
              <label
                htmlFor="file-input-product"
                className="productImage-label"
                onClick={handleImageClick}
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
          {/* Move input outside of conditional rendering to ensure ref assignment */}
          <input
            accept="image/*"
            type="file"
            id="file-input-product"
            onChange={handleImageChange}
            className="file-input-product"
            ref={fileInputRef}
          />
        </section>
      )}
    </>
  );
}
