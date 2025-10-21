import React, { useState, useRef, useEffect } from "react";
import config from "../../config.json";
import Icon from "../icon";
import defaultUserImage from "./images/user.png";
import { FaExclamationCircle } from "react-icons/fa";

export default function ProfileImage({
  profileImage,
  setProfileImage,
  handleProfileImageChange,
  disabled = false,
  error = null,
}) {
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState("");
  const fileInputRef = useRef(null);

  // Allowed types matching backend
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragging(true);
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

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const validateAndAddFile = (file) => {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      const errorMsg = "Only JPEG, PNG, WebP, and GIF images are allowed";
      setLocalError(errorMsg);
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      const errorMsg = "Image size must be less than 5MB";
      setLocalError(errorMsg);
      return;
    }

    setLocalError("");
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
    fileInputRef.current.value = null;
  };

  const handleRemoveImage = () => {
    if (window.confirm("Are you sure you want to remove this image?")) {
      setProfileImage(null);
      handleProfileImageChange(null, null);
      setProgress(0);
      setLocalError("");
    }
  };

  const handleImageClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && fileInputRef.current) {
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

  // Get image URL
  let imageUrl = "";
  if (profileImage) {
    if (profileImage.preview) {
      imageUrl = profileImage.preview;
    } else if (profileImage.url) {
      imageUrl = profileImage.url;
    } else if (profileImage.filename) {
      imageUrl = `${config.mediaUrl}/uploads/${profileImage.filename}`;
    }
  }

  const displayError = error || localError;

  return (
    <section>
      <section
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`drop-zone ${dragging ? "dragging" : ""} ${
          disabled ? "disabled" : ""
        }`}
      >
        {imageUrl ? (
          <div className="selected-image-container" onClick={handleImageClick}>
            <img src={imageUrl} alt="Profile" className="selected-image" />
            {!disabled && (
              <Icon
                onClick={handleRemoveImage}
                cancel
                width={12}
                height={12}
                fill={"#fff"}
                className="productImage__cancel-icon"
              />
            )}
            {!disabled && (
              <div className="productImage-instruction">
                Click on the image to change or update
              </div>
            )}
          </div>
        ) : (
          <div className="selected-image-container" onClick={handleImageClick}>
            <img
              src={defaultUserImage}
              alt="Default"
              className="selected-image"
            />
            {!disabled && (
              <div className="productImage-instruction">
                Click on the image to change or update
              </div>
            )}
          </div>
        )}
        <input
          accept={ALLOWED_TYPES.join(",")}
          type="file"
          id="file-input-profile-image"
          onChange={handleFileChange}
          className="file-input-product"
          ref={fileInputRef}
          style={{ display: "none" }}
          disabled={disabled}
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

      {displayError && (
        <div className="productImage__error-message">
          <FaExclamationCircle /> {displayError}
        </div>
      )}

      <div className="image-upload-hint">Max 5MB • JPEG, PNG, WebP, GIF</div>
    </section>
  );
}
