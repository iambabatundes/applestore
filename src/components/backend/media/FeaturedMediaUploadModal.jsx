import React, { useState } from "react";
import Icon from "../../icon";
import "./styles/MediaUploadModal.css";
import Button from "../button";
import FileUpload from "./FileUpload";
import MediaLibrary from "./MediaLibrary";

export default function FeaturedMediaUploadModal({
  isFeaturdMediaOpen,
  onClick,
  selectedMedia,
  handleMediaSelection,
  handleFilterChange,
  selectedFilter,
  handleDateChange,
  selectedDate,
  handleSearch,
  mediaSearch,
  filteredMedia,
  handleFeaturdMedia,
  setSelectedMediaDetails,
  selectedMediaDetails,
  setUploadProgress,
  uploadProgress,
  setMediaData,
  setNotification,
  setSelectedFiles,
  handleUploadDelete,
  selectedThumbnail,
  setSelectedMedia,
  handleFileSelect,
}) {
  const [selectedTab, setSelectedTab] = useState("upload");
  // const [showFileUpload, setShowFileUpload] = useState(true);

  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleUploadSuccess = (newMedia) => {
    setSelectedTab("library");
    setMediaData((prevMedia) => [newMedia, ...prevMedia]);
    handleMediaSelection(newMedia);
  };

  return (
    <section>
      {isFeaturdMediaOpen && (
        <section className="mediaUpload" onClick={handleFormClick}>
          <div className="mediaUpload-main">
            <div className="mediaUpload-heading">
              <h1>Add Media</h1>
              <Icon cancel className="mediaUpload-cancel" onClick={onClick} />
            </div>

            <div className="modal-tabs">
              <Button
                title="Upload files"
                onClick={() => handleTabChange("upload")}
                className={selectedTab === "upload" ? "active" : ""}
              />

              <Button
                title="Media Library"
                onClick={() => handleTabChange("library")}
                className={selectedTab === "library" ? "active" : ""}
              />
            </div>
            <section className="modal-content-area">
              {selectedTab === "upload" && (
                <FileUpload
                  setMediaData={setMediaData}
                  setNotification={setNotification}
                  setUploadProgress={setUploadProgress}
                  uploadProgress={uploadProgress}
                  setSelectedFiles={setSelectedFiles}
                  onUploadSuccess={handleUploadSuccess}
                />
              )}
              {selectedTab === "library" && (
                <MediaLibrary
                  selectedMedia={selectedMedia}
                  handleMediaSelection={handleMediaSelection}
                  handleFilterChange={handleFilterChange}
                  selectedFilter={selectedFilter}
                  handleDateChange={handleDateChange}
                  selectedDate={selectedDate}
                  handleSearch={handleSearch}
                  mediaSearch={mediaSearch}
                  filteredMedia={filteredMedia}
                  selectedMediaDetails={selectedMediaDetails}
                  setSelectedMediaDetails={setSelectedMediaDetails}
                  handleUploadDelete={handleUploadDelete}
                  selectedThumbnail={selectedThumbnail}
                  setSelectedMedia={setSelectedMedia}
                  handleFileSelect={handleFileSelect}
                />
              )}
            </section>
          </div>

          <Button
            title="Set Featured Media"
            className="mediaModal"
            onClick={handleFeaturdMedia}
          />
        </section>
      )}
    </section>
  );
}
