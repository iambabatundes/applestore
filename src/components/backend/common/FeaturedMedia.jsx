import React, { useState } from "react";
import Button from "../button";
import FeaturedMediaUploadModal from "../media/FeaturedMediaUploadModal";

export default function FeaturedMedia({
  isFeaturedImageVisible,
  filteredMedia,
  selectedMedia,
  setSelectedMedia,
  mediaData,
  handleFilterChange,
  mediaSearch,
  selectedFilter,
  selectedDate,
  uniqueDates,
  handleSearch,
  selectedThumbnail,
  setSelectedThumbnail,
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
      const { dataUrl, fileType } = selectedMediaDetails;

      // Determine the type of media (image or video)
      const type = fileType.startsWith("image") ? "image" : "video";

      // Update the state with the new media details
      setInsertedMedia((prevMedia) => [
        ...prevMedia,
        { type, src: dataUrl, fileType },
      ]);

      // Clear the selected media details after insertion
      setSelectedMediaDetails(null);
      setIsFeaturdMediaOpen(false);
    }
  };

  const handleMediaSelection = (mediaId) => {
    // Toggle the selected state of the media item
    const updatedSelectedMedia = selectedMedia.includes(mediaId)
      ? selectedMedia.filter((id) => id !== mediaId)
      : [...selectedMedia, mediaId];

    setSelectedMedia(updatedSelectedMedia);
  };

  return (
    <>
      {isFeaturedImageVisible && (
        <section>
          <div className="featured-media-items">
            {insertedMedia.map(
              (media, index) =>
                // Only render if it's an image
                media.type === "image" && (
                  <div
                    key={index}
                    className={`featured-media-item ${
                      media === selectedThumbnail ? "selected-thumbnail" : ""
                    }`}
                    onClick={() => setSelectedThumbnail(media)}
                  >
                    <img
                      src={media.src}
                      alt={`Featured Media ${index + 1}`}
                      width="100"
                      height="100"
                    />
                  </div>
                )
            )}
          </div>

          {/* Button to open the MediaUploadModal */}
          <div>
            <Button title="Select Featured Media" onClick={handleSelectMedia} />
          </div>

          {/* Render the MediaUploadModal component */}
          <FeaturedMediaUploadModal
            isFeaturdMediaOpen={isFeaturdMediaOpen}
            onClick={handleCloseMediaUploadModal}
            selectedTab={selectedTab}
            handleTabChange={handleTabChange}
            filteredMedia={filteredMedia}
            handleMediaSelection={handleMediaSelection}
            mediaData={mediaData}
            handleSearch={handleSearch}
            handleFilterChange={handleFilterChange}
            mediaSearch={mediaSearch}
            selectedFilter={selectedFilter}
            uniqueDates={uniqueDates}
            setSelectedMediaDetails={setSelectedMediaDetails}
            selectedMediaDetails={selectedMediaDetails}
            selectedDate={selectedDate}
            selectedMedia={selectedMedia}
            handleFeaturdMedia={handleInsertMedia}
            // Pass any other necessary props here
          />
        </section>
      )}
    </>
  );
}
