import React from "react";
import "./styles/SelectFiles.css";

export default function SelectFiles({
  onChange,
  className,
  uploadMaxMain,
  uploadMaxSize,
}) {
  return (
    <div className={`${className}`}>
      <div className="upload-container">
        <label htmlFor="file-input" className="upload-label">
          <i className="fas fa-file upload-icon"></i>
          <span className="upload-text">Choose files to upload</span>
        </label>
        <input
          type="file"
          id="file-input"
          onChange={onChange}
          className="file-input"
          multiple // Allow multiple file selection
        />
      </div>

      <div className={`${uploadMaxMain}`}>
        <h4 className={`${uploadMaxSize}`}>
          Maximum upload file size: <span>2 GB</span>
        </h4>
      </div>
    </div>
  );
}
