import React, { useState } from "react";
import "./styles/MediaLibrary.css";
import MediaFilter from "./MediaFilter";
import FilterByDate from "./FilterByDate";
import MediaSearch from "./MediaSearch";
import useCopyToClipboard from "../common/useCopyToClipboard";
import CopyToClipboard from "../copyToClipboard";
import config from "../../../config.json";
import { convertFileSize, generateFileLink } from "./fileSizeConvert";

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
}) {
  const [altText, setAltText] = useState("");
  const [title, setTitle] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [inputText, setInputText] = useState("");
  const [copyToClipboard, copyResult] = useCopyToClipboard();

  const handleMediaItemClick = (media) => {
    setSelectedMediaDetails(media);
    setAltText(""); // Reset Alt Text on new selection
    setTitle(""); // Reset Title on new selection
    setFileLink(generateFileLink(media)); // Generate file link on new selection
  };

  const handleClickCopy = () => {
    // Copy the text from the input field into the clipboard
    copyToClipboard(fileLink);
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
              // uniqueDates={uniqueDates}
            />
          </div>
          <MediaSearch handleSearch={handleSearch} mediaSearch={mediaSearch} />
        </div>

        <div className="uploadGrid">
          {filteredMedia.map((media) => (
            <div
              key={media._id}
              className={`media-item ${
                selectedMedia.includes(media.filename) ? "selected" : ""
              }`}
              onClick={() => handleMediaItemClick(media)}
            >
              <div className="media-item-content">
                {media.mimeType?.startsWith("image/") && ( // Check if it's an image
                  <img
                    className="media-item-img"
                    src={config.mediaUrl + `/uploads/${media.filename}`} // Assuming images are stored in the root directory
                    alt={media.originalName} // Use originalName as alt text
                  />
                )}
                {media.mimeType?.startsWith("video/") && ( // Check if it's a video
                  <div className="previews">
                    {/* <img src="/video.png" alt="Video" /> */}
                    <p>{media.originalName}</p>
                    <video className="mediaItem-video" controls>
                      <source
                        src={config.mediaUrl + `/uploads/${media.filename}`}
                        type={media.mimeType}
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
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

                {selectedMediaDetails.mimeType?.startsWith("video/") && (
                  <video controls autoPlay className="attachment-video">
                    <source
                      src={
                        config.mediaUrl +
                        `/uploads/${selectedMediaDetails.filename}`
                      }
                      type={selectedMediaDetails.mimeType}
                    />
                  </video>
                )}
              </div>

              <div>
                <h1 className="selectedMediaDetails-h1">
                  {selectedMediaDetails.originalName}
                </h1>
                <p>{selectedMediaDetails.mimeType}</p>
                <p>{selectedMediaDetails.uploadDate}</p>
                <p>{convertFileSize(selectedMediaDetails.size)}</p>
                <span
                  className="delete-permanently"
                  onClick={() => handleUploadDelete(selectedMediaDetails._id)}
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

                  <div className="attachment-link">
                    <label
                      htmlFor="attachment-link"
                      className="attachment-details-label"
                    >
                      File Link
                    </label>
                    <input
                      type="text"
                      id="attachment-link"
                      value={inputText !== "" ? inputText : fileLink}
                      onChange={(e) => setInputText(e.target.value)}
                    />
                    <CopyToClipboard
                      fileLink={fileLink}
                      copyResult={copyResult}
                      handleClickCopy={handleClickCopy}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </section>
  );
}
