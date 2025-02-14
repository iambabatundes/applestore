import React, { useCallback, useEffect } from "react";
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
  toggleDefault,
  handleColorImageUpload,
}) {
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
              <VariablesInput
                type="text"
                name="colorName"
                darkMode={darkMode}
                placeholder="Color Name"
                value={color.colorName}
                aria-label="Color Name"
                errors={errors?.[index]?.colorName}
                onChange={(e) =>
                  handleColorChange(index, {
                    ...color,
                    colorName: e.target.value,
                  })
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
                  handleColorChange(index, {
                    ...color,
                    colorPrice: e.target.value,
                  })
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
                  handleColorChange(index, { ...color, stock: e.target.value })
                }
              />
            </div>

            <div>
              <VariablesInput
                type="number"
                name="colorSalePrice"
                placeholder="Color Sale Price"
                value={color.colorSalePrice}
                aria-label="Color Sale Price"
                errors={errors?.[index]?.colorSalePrice}
                onChange={(e) =>
                  handleColorChange(index, {
                    ...color,
                    colorSalePrice: e.target.value,
                  })
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
                    handleColorChange(index, {
                      ...color,
                      colorSaleStartDate: e.target.value,
                    })
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
                    handleColorChange(index, {
                      ...color,
                      colorSaleEndDate: e.target.value,
                    })
                  }
                />
              </>
            )}

            <ColorImage
              handleImageUpload={handleColorImageUpload}
              handleColorChange={handleColorChange}
              color={color}
              handleDrop={handleDrop}
              index={index}
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
                  handleColorChange(index, {
                    ...color,
                    isAvailable: e.target.checked,
                  })
                }
              />

              <label>Default</label>
              <VariablesInput
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
            onClick={(e) => {
              e.preventDefault();
              handleRemoveColor(index);
            }}
            aria-label="Color"
          >
            <FaTrash /> Remove
          </span>
        </>
      ))}

      <button
        onClick={(e) => {
          e.preventDefault();
          handleAddColor();
        }}
        className="color__btn"
      >
        <FaPlus /> Add Color
      </button>
    </section>
  );
}
