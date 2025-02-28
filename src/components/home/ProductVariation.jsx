import React, { useState, useEffect } from "react";
import config from "../../config.json";
import "./styles/productVariation.css";

export default function ProductVariation({
  colors = [],
  sizes = [],
  capacity = [],
  materials = [],
  onColorSelect,
}) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedCap, setSelectedCap] = useState(null);
  const [selectedMat, setSelectedMat] = useState(null);

  useEffect(() => {
    if (colors.length > 0) {
      setSelectedColor(colors[0]);
      if (colors[0].colorImages?.length > 0) {
        onColorSelect(
          `${config.mediaUrl}/uploads/${colors[0].colorImages[0]?.filename}`
        );
      }
    }
    if (sizes.length > 0) setSelectedSize(sizes[0]);
    if (capacity.length > 0) setSelectedCap(capacity[0]);
    if (materials.length > 0) setSelectedMat(materials[0]);
  }, [colors, sizes, capacity, materials, onColorSelect]);

  const handleColorClick = (color) => {
    setSelectedColor(color);
    if (color.colorImages?.length > 0) {
      onColorSelect(
        `${config.mediaUrl}/uploads/${color.colorImages[0]?.filename}`
      );
    }
  };

  return (
    <section className="product-variation">
      {/* Color Selection */}
      {colors.length > 0 && (
        <>
          <h1 className="productVariation__heading">
            Color: {selectedColor?.colorName}
          </h1>
          <div className="variation-container">
            {colors.map((color) => (
              <img
                key={color.colorName}
                src={
                  color.colorImages?.length > 0
                    ? `${config.mediaUrl}/uploads/${color.colorImages[0]?.filename}`
                    : "/default-image.jpg"
                }
                alt={color.colorName}
                onClick={() => handleColorClick(color)}
                className={`color-option ${
                  selectedColor?.colorName === color.colorName ? "selected" : ""
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <>
          <h1 className="productVariation__heading">
            Size: {selectedSize?.sizeName}
          </h1>
          <div className="variation-container">
            {sizes.map((size) => (
              <div
                key={size.sizeName}
                onClick={() => setSelectedSize(size)}
                className={`size-option ${
                  selectedSize?.sizeName === size.sizeName ? "selected" : ""
                }`}
              >
                {size.sizeName}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Capacity Selection */}
      {capacity.length > 0 && (
        <>
          <h1 className="productVariation__heading">
            Capacity: {selectedCap?.capName}
          </h1>
          <div className="variation-container">
            {capacity.map((cap) => (
              <div
                key={cap.capName}
                onClick={() => setSelectedCap(cap)}
                className={`capacity-option ${
                  selectedCap?.capName === cap.capName ? "selected" : ""
                }`}
              >
                {cap.capName}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Material Selection */}
      {materials.length > 0 && (
        <>
          <h1 className="productVariation__heading">
            Material: {selectedMat?.matName}
          </h1>
          <div className="variation-container">
            {materials.map((mat) => (
              <div
                key={mat.matName}
                onClick={() => setSelectedMat(mat)}
                className={`material-option ${
                  selectedMat?.matName === mat.matName ? "selected" : ""
                }`}
              >
                {mat.matName}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
