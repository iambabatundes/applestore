import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import VariablesInput from "./variablesInput";

export default function SizeForm({
  darkMode,
  sizes,
  handleAddSize,
  handleRemoveSize,
  handleSizeChange,
  toggleDefaultSize,
  errors,
}) {
  return (
    <section className={`productColors ${darkMode ? "dark-mode" : ""}`}>
      <h1 className={`color__title ${darkMode ? "dark-mode" : ""}`}>Size</h1>
      {sizes.map((size, index) => (
        <>
          <div key={index} className="productForm__color">
            <div>
              <VariablesInput
                key={index}
                type="text"
                name="sizeName"
                darkMode={darkMode}
                placeholder="Size Name"
                value={size.sizeName}
                aria-label="Size Name"
                // errors={errors?.[index]?.sizeName}
                errors={errors?.[index]?.sizeName}
                onChange={(e) =>
                  handleSizeChange(index, {
                    ...size,
                    sizeName: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <VariablesInput
                type="number"
                name="sizePrice"
                placeholder="Size Price"
                value={size.sizePrice}
                aria-label="Size Price"
                onChange={(e) =>
                  handleSizeChange(index, {
                    ...size,
                    sizePrice: e.target.value,
                  })
                }
                errors={errors?.[index]?.sizePrice}
              />
            </div>
            <div>
              <VariablesInput
                type="number"
                name="sizeStock"
                placeholder="Quantity"
                value={size.sizeStock}
                aria-label="Quantity"
                onChange={(e) =>
                  handleSizeChange(index, {
                    ...size,
                    sizeStock: e.target.value,
                  })
                }
                errors={errors?.[index]?.sizeStock}
              />
            </div>

            <div>
              <VariablesInput
                type="number"
                name="sizeSalePrice"
                placeholder="Size Sale Price"
                value={size.sizeSalePrice}
                aria-label="Size Sale Price"
                onChange={(e) =>
                  handleSizeChange(index, {
                    ...size,
                    sizeSalePrice: e.target.value,
                  })
                }
                errors={errors?.[index]?.sizeSalePrice}
              />
            </div>

            {size.sizeSalePrice && (
              <>
                <VariablesInput
                  type="date"
                  name="sizeSaleStartDate"
                  placeholder="size Sale Start Date"
                  value={
                    size.sizeSaleStartDate
                      ? new Date(size.sizeSaleStartDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  aria-label="Size Sale Start Date"
                  onChange={(e) =>
                    handleSizeChange(index, {
                      ...size,
                      sizeSaleStartDate: e.target.value,
                    })
                  }
                  errors={errors?.[index]?.sizeSaleStartDate}
                />

                <VariablesInput
                  type="date"
                  name="sizeSaleEndDate"
                  placeholder="Size Sale End Date"
                  value={
                    size.sizeSaleEndDate
                      ? new Date(size.sizeSaleEndDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  aria-label="Size Sale End Date"
                  onChange={(e) =>
                    handleSizeChange(index, {
                      ...size,
                      sizeSaleEndDate: e.target.value,
                    })
                  }
                  errors={errors?.[index]?.sizeSaleEndDate}
                />
              </>
            )}

            <div>
              <label>Is Available</label>

              <VariablesInput
                type="checkbox"
                checked={size.isAvailable}
                aria-label="Is Available"
                onChange={(e) =>
                  handleSizeChange(index, {
                    ...size,
                    isAvailable: e.target.checked,
                  })
                }
              />

              <label>Default</label>
              <VariablesInput
                type="checkbox"
                checked={size.isDefault}
                aria-label="Default Size"
                onChange={() => toggleDefaultSize(index)}
              />
            </div>
          </div>
          <hr className="size__indicationLine" />
          <span
            className="size__btn-remove"
            onClick={(e) => {
              e.preventDefault();
              handleRemoveSize(index);
            }}
            aria-label="Size"
          >
            <FaTrash /> Remove
          </span>
        </>
      ))}

      <button
        onClick={(e) => {
          e.preventDefault();
          handleAddSize();
        }}
        className="size__btn"
      >
        <FaPlus /> Add Size
      </button>
    </section>
  );
}
