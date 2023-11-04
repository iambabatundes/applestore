import React, { useState, useEffect } from "react";
import "./styles/upload.css";
import Header from "./common/header";
import { getMediaDatas } from "./mediaData";
import MediaUpload from "./media/mediaUpload";
import MediaLibrary from "./media/MediaLibrary";
import Button from "./button";

export default function Upload() {
  const [mediaData, setMediaData] = useState([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [uniqueDates, setUniqueDates] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setMediaData(getMediaDatas);
  // }, []);

  useEffect(() => {
    setLoading(true);
    const data = getMediaDatas();
    setMediaData(data);

    setTimeout(() => {
      setLoading(false); // Hide the loading indicator after 2 seconds
    }, 1000);

    // Extract unique dates from mediaData
    const dates = [...new Set(data.map((media) => media.date))];
    setUniqueDates(dates);
  }, []);

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

  const handleFilterChange = (event) => {
    setLoading(true); // Show the loading indicator
    setSelectedFilter(event.target.value);

    setTimeout(() => {
      setLoading(false); // Hide the loading indicator after 2 seconds
    }, 1000);
  };

  const handleDateChange = (event) => {
    setLoading(true); // Show the loading indicator
    setSelectedDate(event.target.value);

    setTimeout(() => {
      setLoading(false); // Hide the loading indicator after 2 seconds
    }, 1000);
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
        <div className="mediaSearch">
          <div className="allMediaItem-main">
            <select
              name="allMediaItem"
              id="allMediaItem"
              className="allMediadata"
              onChange={handleFilterChange}
              value={selectedFilter}
            >
              <option value="">All media item</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="doc">Documents</option>
              <option value="pdf">PDFs</option>
            </select>
          </div>

          <div className="mediaByDate-main">
            <select
              name="mediaByDate"
              id="mediaByDate"
              className="allMediadata"
              onChange={handleDateChange}
              value={selectedDate}
            >
              <option value="">All Date</option>
              {uniqueDates.map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleBulkSelect}
            title="Select & Delete"
            type="button"
            className="bulk-select-btn"
          />

          {loading && <span className="Imageloading"></span>}
        </div>
      </div>

      <div className="upload-grid">
        <MediaLibrary
          mediaData={mediaData}
          selectedFilter={selectedFilter}
          selectedDate={selectedDate}
        />
      </div>
    </section>
  );
}
