import React, { useState } from "react";
import ReactQuill from "react-quill";
import "./formContent.css";
import Button from "../../button";
import "../../styles/createNew.css";
import MediaUploadModal from "../../media/MediaUploadModal";

export default function FormContent({
  autoSave,
  mediaData,
  selectedMedia,
  setSelectedMedia,
  handleFilterChange,
  selectedFilter,
  handleDateChange,
  selectedDate,
  uniqueDates,
  handleSearch,
  mediaSearch,
  filteredMedia,
}) {
  const [editorContent, setEditorContent] = useState("");
  const [isMediaUploadOpen, setIsMediaUploadOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("library");

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   onUpload(file);
  // };

  const handleAddMediaOpen = () => {
    setIsMediaUploadOpen(true);
  };

  const handleAddMediaClose = () => {
    setIsMediaUploadOpen(false);
  };

  const handleChange = (content) => {
    setEditorContent(content);
  };

  const handleMediaSelection = (mediaId) => {
    // Toggle the selected state of the media item
    const updatedSelectedMedia = selectedMedia.includes(mediaId)
      ? selectedMedia.filter((id) => id !== mediaId)
      : [...selectedMedia, mediaId];

    setSelectedMedia(updatedSelectedMedia);
  };

  // const handleAttachMedia = () => {
  //   // Call the onAttachMedia callback with the selected media items
  //   onAttachMedia(selectedMedia);
  //   // Close the media selection modal or sidebar
  //   setIsMediaUploadOpen(false);
  // };

  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote"],

    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript

    [{ color: [] }], // dropdown with defaults from theme
    // [{ font: [] }],

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
          mediaData={mediaData}
          selectedMedia={selectedMedia}
          setSelectedMedia={setSelectedMedia}
          handleMediaSelection={handleMediaSelection}
          // onAttachMedia={handleAttachMedia}
          handleFilterChange={handleFilterChange}
          selectedFilter={selectedFilter}
          handleDateChange={handleDateChange}
          selectedDate={selectedDate}
          uniqueDates={uniqueDates}
          handleSearch={handleSearch}
          mediaSearch={mediaSearch}
          filteredMedia={filteredMedia}
        />

        <ReactQuill
          modules={modules}
          onChange={handleChange}
          value={editorContent}
          theme="snow"
          // formats={formats}
        />
      </div>
    </section>
  );
}
