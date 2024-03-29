import React, { useState } from "react";
import "./styles/MediaLibrary.css";
import MediaFilter from "./MediaFilter";
import FilterByDate from "./FilterByDate";
import MediaSearch from "./MediaSearch";
import useCopyToClipboard from "../common/useCopyToClipboard";
import CopyToClipboard from "../copyToClipboard";

export default function MediaLibrary({
  mediaData,
  selectedFilter,
  selectedDate,
  selectedMedia,
  handleFilterChange,
  handleDateChange,
  uniqueDates,
  mediaSearch,
  handleSearch,
  filteredMedia,
  setSelectedMediaDetails,
  selectedMediaDetails,
}) {
  const [altText, setAltText] = useState("");
  const [title, setTitle] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [inputText, setInputText] = useState("");
  const [copyToClipboard, copyResult] = useCopyToClipboard();

  // const handleMediaItemClick = (media) => {
  //   setSelectedMediaDetails(media);
  // };

  const handleMediaItemClick = (media) => {
    setSelectedMediaDetails(media);
    setAltText(""); // Reset Alt Text on new selection
    setTitle(""); // Reset Title on new selection
    setFileLink(generateFileLink(media)); // Generate file link on new selection
  };

  const generateFileLink = (media) => {
    const siteOrigin = window.location.origin;
    const fileName = media.fileName; // Use the fileName property instead of dataUrl
    const fileExtension =
      media.fileType === "image"
        ? ".jpg"
        : media.fileType === "video"
        ? ".mp4"
        : ""; // Adjust based on your file types
    return `${siteOrigin}/admin/upload/${fileName}${fileExtension}`;
  };

  const handleDeletePermanently = (mediaId) => {
    // Call the parent component's function to handle deletion
    handleDeletePermanently(mediaId);
    // Clear the selected media details after deletion
    setSelectedMediaDetails(null);
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
              uniqueDates={uniqueDates}
            />
          </div>
          <MediaSearch handleSearch={handleSearch} mediaSearch={mediaSearch} />
        </div>

        <div className="uploadGrid">
          {filteredMedia.map((media) => (
            <div
              key={media.id}
              className={`mediaItem ${
                selectedMedia.includes(media.id) ? "selected" : ""
              }`}
              onClick={() => handleMediaItemClick(media)}
            >
              {media.fileType === "image" && (
                <img
                  className="mediaItem-img"
                  src={media.dataUrl}
                  alt={media.fileName}
                  type="image"
                />
              )}

              {media.fileType === "video" && (
                <div className="preview">
                  <img src="/video.png" alt="Video" />
                  <p>{media.fileName}</p>
                  {media.fileType === "video" && (
                    <video className="mediaItem-video" src={media.dataUrl} />
                  )}
                </div>
              )}

              {media.fileType === "doc" && (
                <div className="preview">
                  <img src="/document.png" alt="Video" />
                  <p>{media.fileName}</p>
                  {media.fileType === "doc" && <a href={media.dataUrl} />}
                </div>
              )}

              {media.fileType === "pdf" && (
                <div className="preview">
                  <img src="/document.png" alt="Video" />
                  <p>{media.fileName}</p>
                  {media.fileType === "pdf" && <a href={media.dataUrl} />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <section className="attrachment-detail">
        <div className="attrachment-detail-main">
          {selectedMediaDetails && (
            <>
              <div>
                <h1 className="attrachment-detail-header">
                  Attrachment Details
                </h1>
                {selectedMediaDetails.fileType === "image" && (
                  <img
                    className="attrachment-img"
                    src={selectedMediaDetails.dataUrl}
                    alt={selectedMediaDetails.fileName}
                  />
                )}

                {selectedMediaDetails.fileType === "video" && (
                  <video controls autoPlay className="attrachment-video">
                    <source
                      src={selectedMediaDetails.dataUrl}
                      type="video/mp4"
                    />
                  </video>
                )}

                {selectedMediaDetails.fileType === "doc" && (
                  <div>
                    <img src="/document.png" alt="Document" />
                    <a
                      href={selectedMediaDetails.dataUrl}
                      download={selectedMediaDetails.fileName}
                    ></a>
                  </div>
                )}

                {selectedMediaDetails.fileType === "pdf" && (
                  <div>
                    <img src="/document.png" alt="PDF" />
                    <a
                      href={selectedMediaDetails.dataUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    ></a>
                  </div>
                )}
              </div>

              <div>
                <h1 className="selectedMediaDetails-h1">
                  {selectedMediaDetails.fileName}
                </h1>
                <p>{selectedMediaDetails.date}</p>
                <p>{selectedMediaDetails.fileSize}</p>
                <span
                  className="delete-parmently"
                  // onClick={() =>
                  //   handleDeletePermanently(selectedMediaDetails.id)
                  // }
                >
                  Delete parmently
                </span>
                <hr className="attachment-line" />
                <div className="media__attachment">
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
                      defaultValue={altText}
                      // onChange={(e) => setAltText(e.target.value)}
                      // cols="10"
                      // rows="10"
                    ></textarea>
                  </span>

                  <span className="attachment-details-main">
                    <label
                      htmlFor="attachment-title"
                      // className="attachment-details-label"
                    >
                      Title
                    </label>
                    <input
                      type="text"
                      id="attachment-title"
                      value={title || selectedMediaDetails.dataUrl}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </span>

                  <div className="attachment__link">
                    <label
                      htmlFor="attachment-link"
                      // className="attachment-details-label"
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
