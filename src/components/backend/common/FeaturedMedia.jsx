import React, { useState } from "react";
import "./styles/featureMedia.css";
import FeaturedMediaUploadModal from "../media/FeaturedMediaUploadModal";
import config from "../../../config.json";

export default function FeaturedMedia({
  isFeaturedImageVisible,
  filteredMedia,
  selectedMedia,
  setSelectedMedia,
  handleFilterChange,
  mediaSearch,
  selectedFilter,
  selectedDate,
  handleFileChange,
  handleSearch,
  selectedThumbnail,
  setSelectedThumbnail,
  setMediaData,
  setNotification,
  setUploadProgress,
  setSelectedFiles,
  uploadProgress,
  handleUploadDelete,
}) {
  const [isFeaturdMediaOpen, setIsFeaturdMediaOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("library");
  const [selectedMediaDetails, setSelectedMediaDetails] = useState(null);
  const [insertedMedia, setInsertedMedia] = useState([]); // Track inserted media

  const handleSelectMedia = () => {
    setIsFeaturdMediaOpen(true);
  };

  const handleCloseMediaUploadModal = () => {
    setIsFeaturdMediaOpen(false);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleInsertMedia = () => {
    if (selectedMediaDetails) {
      const { filename, mimeType } = selectedMediaDetails;

      if (mimeType && mimeType.startsWith("image")) {
        const mediaObj = {
          type: "image",
          src: `${config.mediaUrl}/uploads/${filename}`,
          mimeType,
          filename,
        };
        setInsertedMedia((prevMedia) => [...prevMedia, mediaObj]);
        setSelectedThumbnail(mediaObj);
      }

      setSelectedMediaDetails(null);
      setIsFeaturdMediaOpen(false);
    }
  };

  const handleMediaSelection = (mediaId) => {
    const updatedSelectedMedia = selectedMedia.includes(mediaId)
      ? selectedMedia.filter((id) => id !== mediaId)
      : [...selectedMedia, mediaId];

    setSelectedMedia(updatedSelectedMedia);
  };

  const handleRemoveImage = () => {
    setSelectedThumbnail(null);
  };

  return (
    <>
      {isFeaturedImageVisible && (
        <section className="featured-media-section">
          <div className="featured-media-items">
            {insertedMedia.map((media, index) => (
              <div
                key={index}
                className={`featured-media-item ${
                  media.src === (selectedThumbnail && selectedThumbnail.src)
                    ? "selected-thumbnail"
                    : ""
                }`}
                onClick={() => setSelectedThumbnail(media)}
              >
                {media.mimeType === "image" && (
                  <img
                    src={`${config.mediaUrl}/uploads/${media.filename}`}
                    alt={`Featured Media ${index + 1}`}
                    width="100"
                    height="100"
                    className="featured-image"
                  />
                )}
              </div>
            ))}
          </div>

          {selectedThumbnail ? (
            <div
              className="featureImage__container"
              onClick={handleSelectMedia}
            >
              <img
                src={selectedThumbnail.src}
                alt="Selected Featured Thumbnail"
                className="featureImage__thumbnail"
              />
            </div>
          ) : (
            <div
              className="featureImage__container"
              onClick={handleSelectMedia}
            >
              <i className="fa fa-image featureImage__icon"></i>
              <h1 className="featureImage__text">Select Featured Image</h1>
            </div>
          )}

          {selectedThumbnail && (
            <div className="featureImage__instructions">
              <p>Click on the image to change or update</p>
              <span
                className="featureImage__remove-span"
                onClick={handleRemoveImage}
              >
                Remove this image
              </span>
            </div>
          )}

          <FeaturedMediaUploadModal
            isFeaturdMediaOpen={isFeaturdMediaOpen}
            onClick={handleCloseMediaUploadModal}
            selectedTab={selectedTab}
            handleTabChange={handleTabChange}
            filteredMedia={filteredMedia}
            handleMediaSelection={handleMediaSelection}
            handleSearch={handleSearch}
            handleFilterChange={handleFilterChange}
            mediaSearch={mediaSearch}
            selectedFilter={selectedFilter}
            setSelectedMediaDetails={setSelectedMediaDetails}
            selectedMediaDetails={selectedMediaDetails}
            selectedDate={selectedDate}
            selectedMedia={selectedMedia}
            handleFeaturdMedia={handleInsertMedia}
            handleFileChange={handleFileChange}
            setMediaData={setMediaData}
            setNotification={setNotification}
            setUploadProgress={setUploadProgress}
            uploadProgress={uploadProgress}
            setSelectedFiles={setSelectedFiles}
            handleUploadDelete={handleUploadDelete}
          />
        </section>
      )}
    </>
  );
}
