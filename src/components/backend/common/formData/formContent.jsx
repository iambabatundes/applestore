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
  // const [insertedImages, setInsertedImages] = useState([]);
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
  };

  const handleMediaSelection = (mediaId) => {
    // Toggle the selected state of the media item
    const updatedSelectedMedia = selectedMedia.includes(mediaId)
      ? selectedMedia.filter((id) => id !== mediaId)
      : [...selectedMedia, mediaId];

    setSelectedMedia(updatedSelectedMedia);
  };

  // const handleRemoveImage = (index) => {
  //   const updatedInsertedImages = [...insertedImages];
  //   updatedInsertedImages.splice(index, 1);
  //   setInsertedImages(updatedInsertedImages);

  //   // Remove the image tag from the editor content
  //   setEditorContent((prevContent) => {
  //     const regex = new RegExp(
  //       `<img.*?alt="${insertedImages[index].fileName}".*?>`,
  //       "g"
  //     );
  //     return prevContent.replace(regex, "");
  //   });
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

  // const handleInsertMedia = () => {
  //   if (selectedMediaDetails) {
  //     const { dataUrl, fileName } = selectedMediaDetails;

  //     // Set the desired width and height values
  //     const width = 100; // Example width in pixels
  //     const height = 50; // Example height in pixels

  //     // Create the HTML for the resized image
  //     const imageHtml = `<img src="${dataUrl}" alt="${fileName}" style="width: ${width}px; height: ${height}px;" />`;

  //     // Update the editor content
  //     setEditorContent((prevContent) => prevContent + imageHtml);

  //     // Clear the selected media details after insertion
  //     setSelectedMediaDetails(null);
  //     setIsMediaUploadOpen(false);
  //   }
  // };

  const handleInsertMedia = () => {
    if (selectedMediaDetails) {
      const { dataUrl, fileName, fileType } = selectedMediaDetails;

      let mediaDetails;

      switch (fileType) {
        case "image":
          mediaDetails = `<img src="${dataUrl}" alt="${fileName}" />`;
          break;
        case "video":
          mediaDetails = insertVideo(selectedMediaDetails);
          // (
          //   <video key={fileName} controls>
          //     <source src={dataUrl} type="video/mp4" />
          //   </video>
          // );
          break;
        case "audio":
          mediaDetails = insertAudio(selectedMediaDetails);
          break;
        case "pdf":
          mediaDetails = insertPdf(selectedMediaDetails);
          break;
        case "doc":
          mediaDetails = insertDocument(selectedMediaDetails);
          break;
        // Add more cases for other media types if needed
        default:
          // Handle unknown file types
          break;
      }

      // Update the state with the new media details
      setInsertedMedia((prevMedia) => [...prevMedia, mediaDetails]);

      // Clear the selected media details after insertion
      setSelectedMediaDetails(null);
      setIsMediaUploadOpen(false);

      // Update the editor content
      setEditorContent((prevContent) => prevContent + mediaDetails);

      // Clear the selected media details after insertion
      // setSelectedMediaDetails(null);
      // setIsMediaUploadOpen(false);
    }
  };

  const insertVideo = (media) => {
    const { dataUrl, fileName } = media;
    // You can customize the video HTML based on your requirements
    return `<video controls><source src="${dataUrl}" type="video/mp4" /></video>`;
  };

  const insertAudio = (media) => {
    const { dataUrl, fileName } = media;
    // You can customize the audio HTML based on your requirements
    return `<audio src="${dataUrl}" alt="${fileName}" controls></audio>`;
  };

  const insertPdf = (media) => {
    const { dataUrl, fileName } = media;
    // You can customize the PDF HTML based on your requirements
    return `<embed src="${dataUrl}" type="application/pdf" title="${fileName}" width="100%" height="600px" /> <div>
    <img src="/document.png" alt="PDF" />
    <a
      href=${dataUrl}
      title="${fileName}"
      target="_blank"
      rel="noopener noreferrer"
    ></a>
  </div>`;
  };

  const insertDocument = (media) => {
    const { dataUrl, fileName } = media;
    // You can customize the document HTML based on your requirements
    return `<iframe src="${dataUrl}" title="${fileName}" width="100%" height="600px"></iframe>`;
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
          handleSelectModal={handleInsertMedia}
          selectedMediaDetails={selectedMediaDetails}
          setSelectedMediaDetails={setSelectedMediaDetails}
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
