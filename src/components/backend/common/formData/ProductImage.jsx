import React, { useState } from "react";
import Button from "../../button";

export default function ProductImage({
  isFeaturedImageVisible,
  handleImageChange, // New prop to handle image upload
  featureImage,
}) {
  const [image, setImage] = useState();

  function handleChange(e) {
    console.log(e.target.files);
    setImage(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <>
      {isFeaturedImageVisible && (
        <section>
          <div className="selected-image-container">
            <img
              src={featureImage}
              alt=""
              style={{ width: "100%", objectFit: "cover", padding: 10 }}
              className="selected-image"
            />
          </div>

          {/* File input field for image upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange} // Call handleImageChange when an image is selected
          />

          {/* Display different text based on whether an image is selected */}
        </section>
      )}
    </>
  );
}
