import React, { useState } from "react";
import { saveUpload } from "../../../services/logoService";
import { toast } from "react-toastify"; // for notifications
import "react-toastify/dist/ReactToastify.css";

export default function LogoImage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null); // Preview image
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // Upload progress

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // Limit to 5MB
      toast.error("File size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file)); // Set preview URL
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    setUploading(true);
    try {
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

      await saveUpload(selectedFile); // Call actual upload service
      toast.success("Logo uploaded successfully.");
      setProgress(0); // Reset progress
    } catch (error) {
      console.error("Error uploading logo", error);
      toast.error("Failed to upload logo.");
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

      <button>Save</button>
    </section>
  );
}
