import React, { useState, useEffect } from "react";
import {
  saveUpload,
  getUploads,
  deleteLogo,
  updateLogo,
} from "../../../services/logoService";
import "./styles/logoImage.css";

export default function LogoImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLogoId, setCurrentLogoId] = useState(null);
  const [currentLogo, setCurrentLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [storageType, setStorageType] = useState("local");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCurrentLogo();
  }, []);

  const fetchCurrentLogo = async () => {
    try {
      const { data } = await getUploads();

      if (data) {
        setCurrentLogo(data);
        setCurrentLogoId(data._id);
        setCompanyName(data.companyName || "");

        // Get logo URL from the enhanced schema
        const logoUrl =
          data.logoImage?.url ||
          data.logoImage?.cloudUrl ||
          data.logoImage?.publicUrl ||
          (data.logoImage?.filename
            ? `${import.meta.env.VITE_API_URL}/uploads/${
                data.logoImage.filename
              }`
            : null);

        if (logoUrl) {
          setPreview(logoUrl);
        }

        if (data.logoImage?.storageType) {
          setStorageType(data.logoImage.storageType);
        }
      } else {
        console.log("No logo found.");
      }
    } catch (error) {
      console.error("Error fetching logo:", error);
      // Don't show error if no logo exists yet
      if (error.response?.status !== 404) {
        setError("Failed to load current logo");
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    // Validate that either file or company name is provided
    if (!selectedFile && !companyName.trim()) {
      setError("Please provide either a logo image or company name.");
      return;
    }

    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const progressCallback = (percent) => {
        setProgress(percent);
      };

      let response;

      if (currentLogoId) {
        // Update existing logo
        response = await updateLogo(
          currentLogoId,
          selectedFile,
          companyName,
          storageType,
          { onProgress: progressCallback }
        );
      } else {
        // Create new logo
        response = await saveUpload(selectedFile, companyName, storageType, {
          onProgress: progressCallback,
        });
      }

      // Success
      alert(response.message || "Logo uploaded successfully!");

      // Refresh the logo immediately
      await fetchCurrentLogo();

      // IMPORTANT: Also trigger parent component refresh if callback provided
      // This updates the logo in navbar and throughout the app
      if (window.refreshAppLogo) {
        window.refreshAppLogo();
      }

      // Dispatch custom event for global logo refresh
      window.dispatchEvent(
        new CustomEvent("logoUpdated", {
          detail: { timestamp: Date.now() },
        })
      );

      // Reset selection
      setSelectedFile(null);
      setProgress(0);
    } catch (error) {
      console.error("Error uploading logo:", error);
      setError(
        error.response?.data?.message ||
          "Failed to upload logo. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentLogoId) return;

    if (!window.confirm("Are you sure you want to delete this logo?")) {
      return;
    }

    try {
      await deleteLogo(currentLogoId);
      alert("Logo deleted successfully!");

      // Reset state
      setCurrentLogo(null);
      setCurrentLogoId(null);
      setPreview(null);
      setCompanyName("");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error deleting logo:", error);
      setError(
        error.response?.data?.message ||
          "Failed to delete logo. Please try again."
      );
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.currentTarget.style.borderColor = "#4CAF50";
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.currentTarget.style.borderColor = "#ccc";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.currentTarget.style.borderColor = "#ccc";
    const file = event.dataTransfer.files[0];
    handleFileChange({ target: { files: [file] } });
  };

  return (
    <section className="logoImage__container">
      <h2 className="logoImage__title">Company Logo Management</h2>

      {error && (
        <div className="logoImage__error">
          <i className="fa fa-exclamation-circle"></i> {error}
        </div>
      )}

      {/* Current Logo Display */}
      {currentLogo && (
        <div className="logoImage__current">
          <h3>Current Logo</h3>
          <div className="logoImage__current-details">
            {currentLogo.companyName && (
              <p>
                <strong>Company:</strong> {currentLogo.companyName}
              </p>
            )}
            {currentLogo.logoImage && (
              <>
                <p>
                  <strong>Storage:</strong>{" "}
                  <span
                    className={`logoImage__badge ${currentLogo.logoImage.storageType}`}
                  >
                    {currentLogo.logoImage.storageType}
                  </span>
                </p>
                <p>
                  <strong>Size:</strong>{" "}
                  {(currentLogo.logoImage.size / 1024).toFixed(2)} KB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Company Name Input */}
      <div className="logoImage__field">
        <label htmlFor="companyName">Company Name</label>
        <input
          type="text"
          id="companyName"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name (optional)"
          className="logoImage__input"
        />
      </div>

      {/* Drag & Drop Zone */}
      <div
        className="logoImage__dropzone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="logoImage__preview">
            <img src={preview} alt="Logo Preview" />
          </div>
        ) : (
          <div className="logoImage__placeholder">
            <i className="fa fa-cloud-upload" style={{ fontSize: "48px" }}></i>
            <p>Drag & drop your logo here, or click to select a file.</p>
          </div>
        )}

        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="fileUpload"
          name="logo"
          accept="image/*"
        />
        <label htmlFor="fileUpload" className="logoImage__select-btn">
          {selectedFile ? "Change Logo" : "Select Logo"}
        </label>
      </div>

      {/* Storage Type Selection */}
      <div className="logoImage__storage">
        <label>Storage Type:</label>
        <div className="logoImage__storage-options">
          <label className="logoImage__radio">
            <input
              type="radio"
              name="storageType"
              value="local"
              checked={storageType === "local"}
              onChange={(e) => setStorageType(e.target.value)}
            />
            <span>Local Storage</span>
          </label>
          <label className="logoImage__radio">
            <input
              type="radio"
              name="storageType"
              value="cloudinary"
              checked={storageType === "cloudinary"}
              onChange={(e) => setStorageType(e.target.value)}
            />
            <span>Cloud (Cloudinary)</span>
          </label>
        </div>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="logoImage__progress">
          <div className="logoImage__progress-bar">
            <div
              className="logoImage__progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p>Uploading: {progress}%</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="logoImage__actions">
        <button
          className="logoImage__upload-btn"
          onClick={handleUpload}
          disabled={uploading || (!selectedFile && !companyName.trim())}
        >
          {uploading
            ? "Uploading..."
            : currentLogoId
            ? "Update Logo"
            : "Upload Logo"}
        </button>

        {currentLogoId && (
          <button
            className="logoImage__delete-btn"
            onClick={handleDelete}
            disabled={uploading}
          >
            <i className="fa fa-trash"></i> Delete Logo
          </button>
        )}
      </div>
    </section>
  );
}
