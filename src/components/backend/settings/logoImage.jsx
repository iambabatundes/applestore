import React, { useState, useEffect } from "react";
import {
  saveUpload,
  getUploads,
  deleteLogo,
} from "../../../services/logoService";
import "./styles/logoImage.css";

export default function LogoImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLogoId, setCurrentLogoId] = useState(null);

  const mediaUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCurrentLogo = async () => {
      try {
        const { data } = await getUploads();

        if (data && data.logoImage) {
          setCurrentLogoId(data._id);
          setPreview(`${mediaUrl}/uploads/${data.logoImage.filename}`);
        } else {
          console.log("No logo found.");
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchCurrentLogo();
  }, [mediaUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // Limit to 5MB
      alert("File size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);
    try {
      // Step 1: Delete previous logo if exists
      if (currentLogoId) {
        await deleteLogo(currentLogoId);
      }
      // Step 2: Upload the new logo
      const { data } = await saveUpload(selectedFile);
      setCurrentLogoId(data.logo._id);

      // Mocking progress (for demo purposes, simulate an upload)
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          setProgress((prev) => {
            if (prev < 100) {
              return prev + 10;
            } else {
              clearInterval(interval);
              resolve();
              return prev;
            }
          });
        }, 200);
      });

      await saveUpload(selectedFile);
      alert("Logo uploaded successfully.");
      setProgress(0);
    } catch (error) {
      console.error("Error uploading logo", error);
      alert("Failed to upload logo.", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    handleFileChange({ target: { files: [file] } });
  };

  return (
    <section>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        {preview ? (
          <img src={preview} alt="Logo Preview" style={{ maxWidth: "200px" }} />
        ) : (
          <p>Drag & drop your logo here, or click to select a file.</p>
        )}
        <input
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="fileUpload"
          name="logo"
        />
        <label htmlFor="fileUpload" style={{ cursor: "pointer" }}>
          {selectedFile ? "Change Logo" : "Select Logo"}
        </label>
      </div>

      {uploading && (
        <progress value={progress} max="100">
          {progress}%
        </progress>
      )}

      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Logo"}
      </button>

      {uploading && <p>Uploading: {progress}%</p>}
    </section>
  );
}
