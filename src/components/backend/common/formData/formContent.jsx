import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "./formContent.css";
import Button from "../../button";
import "../../styles/createNew.css";
import MediaUploadModal from "../../media/MediaUploadModal";
import FeaturedMediaUploadModal from "../../media/FeaturedMediaUploadModal";

export default function FormContent({
  selectedMedia,
  setSelectedMedia,
  handleFilterChange,
  selectedFilter,
  handleDateChange,
  selectedDate,
  handleSearch,
  mediaSearch,
  filteredMedia,
  handleFileChange,
  handleFileSelect,
  handleEditorChange,
  initialContent,
  editorContent,
  setEditorContent,
}) {
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("library");
  const [insertedMedia, setInsertedMedia] = useState([]); // Track inserted media
  const [selectedMediaDetails, setSelectedMediaDetails] = useState(null);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleAddMediaOpen = () => {
    setIsMediaUploadOpen(true);
  };

  const handleAddMediaClose = () => {
    setIsMediaUploadOpen(false);
  };

  const handleChange = (content) => {
    setEditorContent(content);
    handleEditorChange(content); // Pass the content back to the parent component
  };

  const handleMediaSelection = (mediaId) => {
    // Toggle the selected state of the media item
    const updatedSelectedMedia = selectedMedia.includes(mediaId)
      ? selectedMedia.filter((id) => id !== mediaId)
      : [...selectedMedia, mediaId];

    setSelectedMedia(updatedSelectedMedia);
  };

  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],
    // [{ size: [] }],

    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript

    [{ color: [] }], // dropdown with defaults from theme
    // [{ font: [] }],
    ["link", "image", "video"],

    ["clean"], // remove formatting button
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  return (
    <section className="formContent__main">
      <div>
        <div className="media-main">
          <div className="addMedia__btn">
            <Button
              title="Add Media"
              iconData="fa fa-picture-o"
              onClick={handleAddMediaOpen}
            />
          </div>
        </div>

        <MediaUploadModal
          isMediaUploadOpen={isMediaUploadOpen}
          onClick={handleAddMediaClose}
          selectedTab={selectedTab}
          handleTabChange={handleTabChange}
          selectedMedia={selectedMedia}
          setSelectedMedia={setSelectedMedia}
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
          handleFileChange={handleFileChange}
          handleFileSelect={handleFileSelect}
        />

        <ReactQuill
          modules={modules}
          onChange={handleChange}
          value={editorContent}
          theme="snow"
          placeholder={"Write something awesome..."}
          // formats={formats}
        />
      </div>
    </section>
  );
}
