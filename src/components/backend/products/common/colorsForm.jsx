import React, { useCallback, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import "../styles/colorForm.css";
import ColorInput from "./ColorInput";
import ColorImage from "./colorImage";
import useColors from "../hooks/useColors";

export default function ColorsForm({
  colors,
  errors,
  onColorChange,
  darkMode,
}) {
  const {
    handleAddColor,
    handleRemoveColor,
    handleColorChange,
    handleImageUpload,
    toggleDefault,
    errors: colorErrors,
  } = useColors(colors, onColorChange, errors);

  useEffect(() => {
    return () => {
      colors.forEach((color) => {
        if (color.colorImages instanceof File && color.colorImages.preview) {
          URL.revokeObjectURL(color.colorImages.preview);
        }
      });
    };
  }, [colors]);

  const handleDrop = useCallback(
    (e, index) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file instanceof File) {
        handleColorChange(index, { ...colors[index], colorImages: file });
      } else {
        console.error("Invalid file dropped:", file);
      }
    },
    [colors, handleColorChange]
  );

  return (
    <section className={`productColors ${darkMode ? "dark-mode" : ""}`}>
      <h1 className={`color__title ${darkMode ? "dark-mode" : ""}`}>Color</h1>
      {colors.map((color, index) => (
        <>
          <div key={index} className="productForm__color">
            <div>
              <ColorInput
                type="text"
                darkMode={darkMode}
                placeholder="Color Name"
                value={color.colorName}
                aria-label="Color Name"
                errors={colorErrors?.[index]?.colorName}
                onChange={(e) =>
                  handleColorChange(index, {
                    ...color,
                    colorName: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <ColorInput
                type="number"
                placeholder="Price"
                value={color.colorPrice}
                aria-label="Color Price"
                onChange={(e) =>
                  handleColorChange(index, {
                    ...color,
                    colorPrice: e.target.value,
                  })
                }
                errors={colorErrors?.[index]?.price}
              />
            </div>
            <div>
              <ColorInput
                type="number"
                placeholder="Quantity"
                value={color.stock}
                aria-label="Quantity"
                onChange={(e) =>
                  handleColorChange(index, { ...color, stock: e.target.value })
                }
                errors={colorErrors?.[index]?.stock}
              />
            </div>

            <div>
              <ColorInput
                type="number"
                placeholder="Color Sale Price"
                value={color.colorSalePrice}
                aria-label="Color Sale Price"
                onChange={(e) =>
                  handleColorChange(index, {
                    ...color,
                    colorSalePrice: e.target.value,
                  })
                }
                errors={colorErrors?.[index]?.colorSalePrice}
              />
            </div>

            {color.colorSalePrice && (
              <>
                <ColorInput
                  type="date"
                  placeholder="Color Sale Start Date"
                  value={
                    color.colorSaleStartDate
                      ? new Date(color.colorSaleStartDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  aria-label="Color Sale Start Date"
                  onChange={(e) =>
                    handleColorChange(index, {
                      ...color,
                      colorSaleStartDate: e.target.value,
                    })
                  }
                  errors={errors?.[index]?.colorSaleStartDate}
                />

                <ColorInput
                  type="date"
                  placeholder="Color Sale End Date"
                  value={
                    color.colorSaleEndDate
                      ? new Date(color.colorSaleEndDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  aria-label="Color Sale End Date"
                  onChange={(e) =>
                    handleColorChange(index, {
                      ...color,
                      colorSaleEndDate: e.target.value,
                    })
                  }
                  errors={errors?.[index]?.colorSaleEndDate}
                />
              </>
            )}

            <ColorImage
              handleImageUpload={handleImageUpload}
              handleColorChange={handleColorChange}
              color={color}
              handleDrop={handleDrop}
              index={index}
            />

            <div>
              <label>Is Available</label>

              <ColorInput
                type="checkbox"
                checked={color.isAvailable}
                aria-label="Is Available"
                onChange={(e) =>
                  handleColorChange(index, {
                    ...color,
                    isAvailable: e.target.checked,
                  })
                }
              />

              <label>Default</label>
              <ColorInput
                type="checkbox"
                checked={color.isDefault}
                aria-label="Default Color"
                onChange={() => toggleDefault(index)}
              />
            </div>
          </div>
          <hr className="color__indicationLine" />
          <span
            className="color__btn-remove"
            onClick={() => handleRemoveColor(index)}
            aria-label="Color"
          >
            <FaTrash /> Remove
          </span>
        </>
      ))}

      <button onClick={handleAddColor} className="color__btn">
        <FaPlus /> Add Color
      </button>
    </section>
  );
}
