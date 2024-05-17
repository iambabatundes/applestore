import React, { useState, useEffect } from "react";
import "./styles/upload.css";
import Header from "./common/header";
import MediaUpload from "./media/mediaUpload";
import MediaLibraryUpload from "./media/MediaLibraryUpload";
import Button from "./button";
import MediaFilter from "./media/MediaFilter";
import FilterByDate from "./media/FilterByDate";
import MediaSearch from "./media/MediaSearch";
import { getUploads, deleteUpload } from "../../services/mediaService";
import { handleFileChange } from "./media/fileUploadHandler";

export default function Upload({
  // selectedMedia,
  handleFilterChange,
  selectedFilter,
  selectedDate,
  handleSearch,
  mediaSearch,
}) {
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [mediaData, setMediaData] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  // const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    async function fetchMediaData() {
      try {
        const { data: originalMedia } = await getUploads();
        setMediaData(originalMedia);
      } catch (error) {
        console.error("Error fetching media data:", error);
      }
    }

    fetchMediaData();
  }, [mediaData]);

  const handleUploadCancel = () => {
    setShowMediaUpload(false);
  };

  const handleAddNewClick = () => {
    setShowMediaUpload(true);
  };

  const handleFileSelect = (fileId) => {
    setSelectedFiles((prevSelectedFiles) =>
      prevSelectedFiles.includes(fileId)
        ? prevSelectedFiles.filter((id) => id !== fileId)
        : [...prevSelectedFiles, fileId]
    );
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteUpload(selectedFiles);
      setMediaData((prevMediaData) =>
        prevMediaData.filter((media) => !selectedFiles.includes(media._id))
      );
      setSelectedFiles([]);
      setNotification("Selected files deleted successfully!");
    } catch (error) {
      console.error("Error deleting files:", error);
      setNotification("Error deleting files. Please try again.");
    }

    setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
  };

  return (
    <section className="padding">
      <Header
        headerTitle="Media Library"
        buttonTitle="Add New"
        onClick={handleAddNewClick}
      />

      {notification && <div className="notification">{notification}</div>}

      <MediaUpload
        handleUploadCancel={handleUploadCancel}
        showMediaUpload={showMediaUpload}
        onChange={(event) =>
          handleFileChange(
            event,
            setUploadProgress,
            setMediaData,
            setSelectedFiles,
            setShowMediaUpload,
            setNotification
          )
        } // Use the function
        uploadProgress={uploadProgress}
      />

      <div className="mediaUpload-mains">
        <div className="mediaSearch-main">
          <div className="mediaSearch">
            <MediaFilter
              selectedFilter={selectedFilter}
              handleFilterChange={handleFilterChange}
            />

            <FilterByDate selectedDate={selectedDate} />

            <Button
              title="Delete Selected"
              type="button"
              className="bulk-select-btn"
              onClick={handleDeleteSelected}
              disabled={selectedFiles.length === 0}
            />
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
          filteredMedia={mediaData}
          selectedMedia={selectedFiles}
          handleFileSelect={handleFileSelect}
        />
      </div>
    </section>
  );
}
