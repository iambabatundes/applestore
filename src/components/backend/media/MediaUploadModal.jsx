import React from "react";
import Icon from "../../icon";
import "./styles/MediaUploadModal.css";
import Button from "../button";
import FileUpload from "./FileUpload";
import MediaLibrary from "./MediaLibrary";

export default function MediaUploadModal({
  isMediaUploadOpen,
  onClick,
  selectedTab,
  handleTabChange,
  handleFileChange,
  selectedMedia,
  handleMediaSelection,
  handleFilterChange,
  selectedFilter,
  handleDateChange,
  selectedDate,
  uniqueDates,
  handleSearch,
  mediaSearch,
  filteredMedia,
  handleSelectModal,
  setSelectedMediaDetails,
  selectedMediaDetails,
  handleFileSelect,
}) {
  const handleFormClick = (e) => {
    e.stopPropagation();
  };

  return (
    <section>
      {isMediaUploadOpen && (
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
                <FileUpload handleFileChange={handleFileChange} />
              )}
              {selectedTab === "library" && (
                <>
                  <MediaLibrary
                    selectedMedia={selectedMedia}
                    handleMediaSelection={handleMediaSelection}
                    handleFilterChange={handleFilterChange}
                    selectedFilter={selectedFilter}
                    handleDateChange={handleDateChange}
                    selectedDate={selectedDate}
                    uniqueDates={uniqueDates}
                    handleSearch={handleSearch}
                    mediaSearch={mediaSearch}
                    filteredMedia={filteredMedia}
                    selectedMediaDetails={selectedMediaDetails}
                    setSelectedMediaDetails={setSelectedMediaDetails}
                    handleFileSelect={handleFileSelect}
                  />
                </>
              )}
            </section>
          </div>

          <Button
            title="Insert to Post"
            className="mediaModal"
            onClick={handleSelectModal}
            // disabled
          />
        </section>
      )}
    </section>
  );
}
