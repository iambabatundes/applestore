import React, { useState, useEffect } from "react";
import "./styles/upload.css";
import Header from "./common/header";
import { getMediaDatas } from "./mediaData";
import MediaUpload from "./media/mediaUpload";
import MediaLibraryUpload from "./media/MediaLibraryUpload";
import Button from "./button";
import MediaFilter from "./media/MediaFilter";
import FilterByDate from "./media/FilterByDate";
import MediaSearch from "./media/MediaSearch";

export default function Upload({
  mediaData,
  setMediaData,
  selectedMedia,
  maxFileSize,
  setMaxFileSize,
  uniqueDates,
  loading,
  handleFilterChange,
  handleDateChange,
  selectedFilter,
  selectedDate,
  handleSearch,
  mediaSearch,
  filteredMedia,
}) {
  const [showMediaUpload, setShowMediaUpload] = useState(false);

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

  const handleFileChange = (file) => {
    // Implement file upload logic here and then add it to mediaData
    const newMedia = {
      id: mediaData.length + 1, // Generate a unique ID
      imageUrl: URL.createObjectURL(file), // Use the file for the image URL
      name: file.name, // Use the file name as the media name
    };
    setMediaData([...mediaData, newMedia]);
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
        onChange={handleFileChange}
      />

      <div className="mediaUpload-mains">
        <div className="mediaSearch-main">
          <div className="mediaSearch">
            <MediaFilter
              selectedFilter={selectedFilter}
              handleFilterChange={handleFilterChange}
            />

            <FilterByDate
              handleDateChange={handleDateChange}
              selectedDate={selectedDate}
              uniqueDates={uniqueDates}
            />

            <Button
              onClick={handleBulkSelect}
              title="Select & Delete"
              type="button"
              className="bulk-select-btn"
              // Todo
            />

            {loading && <span className="Imageloading"></span>}
          </div>

          <div>
            <MediaSearch
              handleSearch={handleSearch}
              mediaSearch={mediaSearch}
            />
          </div>
        </div>
      </div>

      <div className="upload-grid">
        <MediaLibraryUpload
          mediaData={mediaData}
          selectedFilter={selectedFilter}
          selectedDate={selectedDate}
          selectedMedia={selectedMedia}
          filteredMedia={filteredMedia}
        />
      </div>
    </section>
  );
}
