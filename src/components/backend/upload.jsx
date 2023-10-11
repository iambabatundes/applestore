import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles/upload.css";
import Header from "./common/header";
import Button from "./button";
import { getMediaDatas } from "./mediaData";
import MediaUpload from "./media/mediaUpload";

export default function Upload() {
  const [mediaData, setMediaData] = useState([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState("");

  useEffect(() => {
    setMediaData(getMediaDatas);
  });

  useEffect(() => {
    // Simulated fetch (replace with actual fetch)
    setTimeout(() => {
      const maxFileSizeFromServerMB = 2048; // Example: Maximum file size in MB
      setMaxFileSize(maxFileSizeFromServerMB);
    }, 1000);
  }, []);

  const getMaxFileSizeGB = () => {
    if (maxFileSize !== null) {
      const maxFileSizeGB = maxFileSize / 1024; // Convert MB to GB
      return maxFileSizeGB.toFixed(0); // Display with 2 decimal places
    }
    return "N/A"; // Display "N/A" if maxFileSizeMB is not set yet
  };

  const handleBulkSelect = () => {
    // do something
  };

  const handleUploadCanel = () => {
    setShowMediaUpload(false);
  };

  const handleAddNewClick = () => {
    setShowMediaUpload(true);
  };

  return (
    <section className="padding">
      <Header
        headerTitle="Media Library"
        buttonTitle="Add New"
        // to="/admin/new-media"
        onClick={handleAddNewClick}
      />

      <MediaUpload
        getMaxFileSizeGB={getMaxFileSizeGB}
        handleUploadCanel={handleUploadCanel}
        showMediaUpload={showMediaUpload}
      />

      <div className="mediaUpload-main">
        <div className="mediaSearch">
          <span>{/* <i class="fa fa-th-large" aria-hidden="true"></i> */}</span>
          <select
            name="allMediaItem"
            id="allMediaItem"
            className="allMediadata"
          >
            <option value="">All media item</option>
          </select>

          <select name="mediaByDate" id="mediaByDate" className="allMediadata">
            <option value="">All Date</option>
          </select>

          <Button
            title="Bulk select"
            className="btn"
            onClick={handleBulkSelect}
          />
        </div>
      </div>

      <div className="upload-grid">
        {mediaData.map((media) => (
          <div className="media-item" key={media.key}>
            <img
              src={media.imageUrl}
              alt={`This is the media` + media.imageUrl}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
