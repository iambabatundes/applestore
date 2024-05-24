import React, { useState } from "react";
import "./styles/MediaLibrary.css";
import MediaFilter from "./MediaFilter";
import FilterByDate from "./FilterByDate";
import MediaSearch from "./MediaSearch";
import config from "../../../config.json";
import { convertFileSize } from "./fileSizeConvert";

export default function MediaLibrary({
  selectedFilter,
  selectedDate,
  selectedMedia,
  handleFilterChange,
  handleDateChange,
  mediaSearch,
  handleSearch,
  filteredMedia,
  setSelectedMediaDetails,
  selectedMediaDetails,
  handleUploadDelete,
  selectedThumbnail,
  handleFileSelect,
}) {
  const [altText, setAltText] = useState("");
  const [title, setTitle] = useState("");

  const handleMediaItemClick = (media) => {
    setSelectedMediaDetails(media);
    setAltText(""); // Reset Alt Text on new selection
    setTitle(""); // Reset Title on new selection
    handleFileSelect(media._id); // Select or deselect the media item
  };

  return (
    <section className="mediaLibrary-media">
      <div className="mediaLibrary-container">
        <div className="mediaLibrary-filter-main">
          <div className="mediaLibrary-filter">
            <MediaFilter
              handleFilterChange={handleFilterChange}
              selectedFilter={selectedFilter}
            />

            <FilterByDate
              handleDateChange={handleDateChange}
              selectedDate={selectedDate}
            />
          </div>
          <MediaSearch handleSearch={handleSearch} mediaSearch={mediaSearch} />
        </div>

        <div className="uploadGrid">
          {filteredMedia.map((media) => (
            <div
              key={media._id}
              className={`mediaLibrary-item ${
                selectedMedia.includes(media._id) ? "selected" : ""
              }`}
              onClick={() => handleMediaItemClick(media)}
            >
              <div className="media-item-content">
                {media.mimeType?.startsWith("image/") && (
                  <img
                    className="mediaLibrary-item-img"
                    src={config.mediaUrl + `/uploads/${media.filename}`}
                    alt={media.originalName}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <section className="attachment-detail">
        <div className="attachment-detail-main">
          {selectedMediaDetails && (
            <>
              <div>
                <h1 className="attachment-detail-header">Attachment Details</h1>
                {selectedMediaDetails.mimeType?.startsWith("image/") && (
                  <img
                    className="attachment-img"
                    src={
                      config.mediaUrl +
                      `/uploads/${selectedMediaDetails.filename}`
                    }
                    alt={selectedMediaDetails.originalName}
                  />
                )}
              </div>

              <div>
                <h1 className="selectedMediaDetails-h1">
                  {selectedMediaDetails.originalName}
                  {selectedMediaDetails.filename}
                </h1>
                <p>{selectedMediaDetails.mimeType}</p>
                <p>{selectedMediaDetails.uploadDate}</p>
                <p>{convertFileSize(selectedMediaDetails.size)}</p>
                <span
                  className="delete-permanently"
                  onClick={() => handleUploadDelete(selectedMediaDetails.id)}
                >
                  Delete permanently
                </span>
                <hr className="attachment-line" />

                <div className="media-attachment">
                  <span className="attachment-details">
                    <label
                      htmlFor="attachment-details"
                      className="attachment-details-label"
                    >
                      Alt Text
                    </label>
                    <textarea
                      id="attachment-details"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                    ></textarea>
                  </span>

                  <span className="attachment-details-main">
                    <label
                      htmlFor="attachment-title"
                      className="attachment-details-label"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="attachment-title"
                      value={title || selectedMediaDetails.name}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </section>
  );
}
