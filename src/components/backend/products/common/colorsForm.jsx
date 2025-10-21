import React, { useEffect, useRef } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "../styles/colorForm.css";
import VariablesInput from "./variablesInput";
import ColorImage from "./colorImage";

export default function ColorsForm({
  colors,
  errors,
  darkMode,
  handleAddColor,
  handleRemoveColor,
  handleColorChange,
  toggleDefaultColor,
  handleColorImageUpload,
  getColorImageUrl,
}) {
  // Track blob URLs that need cleanup
  const blobUrlsRef = useRef(new Set());

  // Cleanup only when component unmounts
  useEffect(() => {
    return () => {
      // Only revoke blob URLs when component is fully unmounted
      blobUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
          console.log("Cleaned up blob URL:", url);
        } catch (err) {
          console.warn("Failed to revoke blob URL:", url, err);
        }
      });
      blobUrlsRef.current.clear();
    };
  }, []); // Empty dependency array = only runs on unmount

  // Track new blob URLs
  useEffect(() => {
    colors.forEach((color) => {
      if (
        color.colorImages?.preview &&
        color.colorImages.preview.startsWith("blob:") &&
        !color.colorImages.preview.includes("/uploads/")
      ) {
        blobUrlsRef.current.add(color.colorImages.preview);
      }
    });
  }, [colors]);

  return (
    <section className={`productColors ${darkMode ? "dark-mode" : ""}`}>
      <h1 className={`color__title ${darkMode ? "dark-mode" : ""}`}>Color</h1>

      {colors.map((color, index) => (
        <div key={index} className="color-wrapper">
          <div className="productForm__color">
            <div>
              <VariablesInput
                type="text"
                name="colorName"
                darkMode={darkMode}
                placeholder="Color Name"
                value={color.colorName}
                aria-label="Color Name"
                errors={errors?.[index]?.colorName}
                onChange={(e) =>
                  handleColorChange(index, "colorName", e.target.value)
                }
              />
            </div>

            <div>
              <VariablesInput
                type="number"
                name="colorPrice"
                placeholder="Price"
                value={color.colorPrice}
                aria-label="Color Price"
                errors={errors?.[index]?.colorPrice}
                onChange={(e) =>
                  handleColorChange(index, "colorPrice", e.target.value)
                }
              />
            </div>

            <div>
              <VariablesInput
                type="number"
                name="stock"
                placeholder="Quantity"
                value={color.stock}
                aria-label="Quantity"
                errors={errors?.[index]?.stock}
                onChange={(e) =>
                  handleColorChange(index, "stock", e.target.value)
                }
              />
            </div>

            <div>
              <VariablesInput
                type="number"
                name="colorSalePrice"
                placeholder="Color Sale Price"
                value={color.colorSalePrice || ""}
                aria-label="Color Sale Price"
                errors={errors?.[index]?.colorSalePrice}
                onChange={(e) =>
                  handleColorChange(index, "colorSalePrice", e.target.value)
                }
              />
            </div>

            {color.colorSalePrice && (
              <>
                <VariablesInput
                  type="date"
                  name="colorSaleStartDate"
                  placeholder="Color Sale Start Date"
                  errors={errors?.[index]?.colorSaleStartDate}
                  value={
                    color.colorSaleStartDate
                      ? new Date(color.colorSaleStartDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  aria-label="Color Sale Start Date"
                  onChange={(e) =>
                    handleColorChange(
                      index,
                      "colorSaleStartDate",
                      e.target.value
                    )
                  }
                />

                <VariablesInput
                  type="date"
                  name="colorSaleEndDate"
                  placeholder="Color Sale End Date"
                  value={
                    color.colorSaleEndDate
                      ? new Date(color.colorSaleEndDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  aria-label="Color Sale End Date"
                  errors={errors?.[index]?.colorSaleEndDate}
                  onChange={(e) =>
                    handleColorChange(index, "colorSaleEndDate", e.target.value)
                  }
                />
              </>
            )}

            <ColorImage
              handleImageUpload={handleColorImageUpload}
              handleColorChange={handleColorChange}
              color={color}
              index={index}
              getColorImageUrl={getColorImageUrl}
            />
            {errors?.[index]?.colorImages && (
              <p className="error-message">{errors[index].colorImages}</p>
            )}

            <div>
              <label>Is Available</label>
              <VariablesInput
                type="checkbox"
                checked={color.isAvailable}
                aria-label="Is Available"
                onChange={(e) =>
                  handleColorChange(index, "isAvailable", e.target.checked)
                }
              />

              <label>Default</label>
              <VariablesInput
                type="checkbox"
                checked={color.isDefault}
                aria-label="Default Color"
                onChange={() => toggleDefaultColor(index)}
              />
            </div>
          </div>

          <hr className="color__indicationLine" />

          <span
            className="color__btn-remove"
            onClick={(e) => {
              e.preventDefault();
              // Remove blob URL from tracking before removing color
              const colorToRemove = colors[index];
              if (colorToRemove?.colorImages?.preview?.startsWith("blob:")) {
                blobUrlsRef.current.delete(colorToRemove.colorImages.preview);
                URL.revokeObjectURL(colorToRemove.colorImages.preview);
              }
              handleRemoveColor(index);
            }}
            aria-label="Remove Color"
          >
            <FaTrash /> Remove
          </span>
        </div>
      ))}

      <button
        onClick={(e) => {
          e.preventDefault();
          handleAddColor();
        }}
        className="color__btn"
        type="button"
      >
        <FaPlus /> Add Color
      </button>
    </section>
  );
}
