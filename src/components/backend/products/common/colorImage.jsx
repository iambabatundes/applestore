import React, { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function ColorImage({
  color,
  index,
  handleImageUpload,
  handleColorChange,
  getColorImageUrl,
}) {
  const imageUrl = getColorImageUrl
    ? getColorImageUrl(color.colorImages)
    : null;

  useEffect(() => {
    console.group(`🎨 Color ${index} Debug`);
    console.log("Full color object:", color);
    console.log("colorImages:", color.colorImages);
    console.log("Has file?", color.colorImages?.file instanceof File);
    console.log("Has preview?", !!color.colorImages?.preview);
    console.log("Computed imageUrl:", imageUrl);
    console.log("imageUrl type:", typeof imageUrl);
    console.log("imageUrl truthy?", !!imageUrl);
    console.groupEnd();
  }, [color, imageUrl, index]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(index, file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    // FIX: Use field-based API to remove image
    handleColorChange(index, "colorImages", null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file && file instanceof File) {
      handleImageUpload(index, file);
    }
  };

  return (
    <div
      className="drag-drop-upload"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() =>
        document.getElementById(`colorImagefile-${index}`)?.click()
      }
    >
      {imageUrl ? (
        <div className="color__imagePreview">
          <img
            className="color__img"
            src={imageUrl}
            alt="Color preview"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById(`colorImagefile-${index}`)?.click();
            }}
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.target.src = "/placeholder-image.png";
            }}
          />
          <button
            type="button"
            className="cancel-btn"
            onClick={handleRemoveImage}
            aria-label="Remove image"
          >
            <FaTimes />
          </button>
          {/* Hidden input for changing image */}
          <input
            accept="image/*"
            type="file"
            id={`colorImagefile-${index}`}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      ) : (
        <>
          <p className="color__drag">Drag & Drop or Click to Upload</p>
          <input
            accept="image/*"
            type="file"
            id={`colorImagefile-${index}`}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </>
      )}
    </div>
  );
}
