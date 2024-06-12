import React, { useState, useRef, useEffect } from "react";
import config from "../../config.json";
import Icon from "../icon";
import defaultUserImage from "./images/user.png"; // Add default image import

export default function ProfileImage({
  profileImage,
  setProfileImage,
  handleProfileImageChange,
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
      validateAndAddFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const validateAndAddFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    const maxFileSize = 50 * 1024 * 1024; // 50 MB
    if (file.size > maxFileSize) {
      setError("File size should not exceed 50 MB.");
      return;
    }

    setError("");
    const fileUrl = URL.createObjectURL(file);
    setProfileImage({ file, preview: fileUrl });
    handleProfileImageChange(file, fileUrl);
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
    fileInputRef.current.value = null; // Reset the file input
  };

  const handleRemoveImage = () => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setProfileImage(null);
      handleProfileImageChange(null, null);
      setProgress(0); // Reset progress when image is removed
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
      if (profileImage && profileImage.preview) {
        URL.revokeObjectURL(profileImage.preview);
      }
    };
  }, [profileImage]);

  let imageUrl = "";
  if (profileImage) {
    if (profileImage.preview) {
      imageUrl = profileImage.preview;
    } else if (profileImage.filename) {
      imageUrl = `${config.mediaUrl}/uploads/${profileImage.filename}`;
    }
  }

  return (
    <section>
      <section
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`drop-zone ${dragging ? "dragging" : ""}`}
      >
        {imageUrl ? (
          <div className="selected-image-container" onClick={handleImageClick}>
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
          <div className="selected-image-container" onClick={handleImageClick}>
            <img
              src={defaultUserImage}
              alt="Default"
              className="selected-image"
            />
            <div className="productImage-instruction">
              Click on the image to change or update
            </div>
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
      {error && <div className="productImage__error-message">{error}</div>}
    </section>
  );
}
