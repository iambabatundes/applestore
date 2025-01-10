import React from "react";
import { FaTimes } from "react-icons/fa";
import config from "../../../../config.json";

export default function ColorImage({
  color,
  index,
  handleDrop,
  handleImageUpload,
  handleColorChange,
}) {
  const imageUrl =
    color.colorImages instanceof File
      ? color.colorImages.preview || URL.createObjectURL(color.colorImages)
      : typeof color.colorImages === "string"
      ? color.colorImages
      : color.colorImages.filename
      ? `${config.mediaUrl}/uploads/${color.colorImages.filename}`
      : "";

  //   let imageUrl = "";
  //   if (color.colorImages) {
  //     if (color.colorImages.preview && color.colorImages) {
  //       imageUrl = color.colorImages.preview;
  //     } else if (color.colorImages.filename) {
  //       imageUrl = `${config.mediaUrl}/uploads/${color.colorImages.filename}`;
  //     }
  //   }

  return (
    <div
      className="drag-drop-upload"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, index)}
      onClick={() => document.getElementById(`colorImagefile-${index}`).click()}
    >
      {imageUrl ? (
        <div className="color__imagePreview">
          <img
            className="color__img"
            src={imageUrl}
            alt="Preview"
            onClick={(e) => {
              e.stopPropagation();
              document.getElementById(`colorImagefile-${index}`).click();
            }}
          />
          <button
            className="color_cancel-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleColorChange(index, {
                ...color,
                colorImages: {},
              });
            }}
          >
            <FaTimes />
          </button>
        </div>
      ) : (
        <>
          <p className="color__drag">Drag & Drop or Click to Upload</p>
          <input
            accept="image/*"
            type="file"
            id={`colorImagefile-${index}`}
            onChange={(e) => handleImageUpload(e, index)}
            style={{ display: "none" }}
          />
        </>
      )}
    </div>
  );
}
