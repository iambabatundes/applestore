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

      // Check if the media type is an image
      if (fileType.startsWith("image")) {
        // Update the state with the new image details
        setInsertedMedia((prevMedia) => [
          ...prevMedia,
          { type: "image", src: dataUrl, fileType },
        ]);

        // Set the selected thumbnail to the newly inserted image
        setSelectedThumbnail({ type: "image", src: dataUrl, fileType });
      }

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
            {insertedMedia.map((media, index) => (
              <div
                key={index}
                className={`featured-media-item ${
                  media.src === (selectedThumbnail && selectedThumbnail.src)
                    ? "selected-thumbnail"
                    : ""
                }`}
                onClick={() => setSelectedThumbnail(media.src)}
              >
                {media.type === "image" && (
                  <img
                    src={media.src}
                    alt={`Featured Media ${index + 1}`}
                    width="100"
                    height="100"
                    className="featuredImage"
                  />
                )}
              </div>
            ))}
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
