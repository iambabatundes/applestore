import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import VariablesInput from "./variablesInput";

export default function CapacityForm({
  darkMode,
  capacity,
  handleAddCap,
  handleRemoveCap,
  handleCapChange,
  toggleDefaultCap,
  errors,
}) {
  return (
    <section className={`productColors ${darkMode ? "dark-mode" : ""}`}>
      <h1 className={`color__title ${darkMode ? "dark-mode" : ""}`}>
        Capacity
      </h1>
      {capacity.map((cap, index) => (
        <>
          <div key={index} className="productForm__color">
            <div>
              <VariablesInput
                key={index}
                type="text"
                name="capName"
                darkMode={darkMode}
                placeholder="Capacity Name"
                value={cap.capName}
                aria-label="Capacity Name"
                // errors={errors?.[index]?.sizeName}
                errors={errors?.[index]?.capName}
                onChange={(e) =>
                  handleCapChange(index, {
                    ...cap,
                    capName: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <VariablesInput
                type="number"
                name="capPrice"
                placeholder="Capacity Price"
                value={cap.capPrice}
                aria-label="Capacity Price"
                onChange={(e) =>
                  handleCapChange(index, {
                    ...cap,
                    capPrice: e.target.value,
                  })
                }
                errors={errors?.[index]?.capPrice}
              />
            </div>
            <div>
              <VariablesInput
                type="number"
                name="capStock"
                placeholder="Quantity"
                value={cap.capStock}
                aria-label="Quantity"
                onChange={(e) =>
                  handleCapChange(index, {
                    ...cap,
                    capStock: e.target.value,
                  })
                }
                errors={errors?.[index]?.capStock}
              />
            </div>

            <div>
              <VariablesInput
                type="number"
                name="capSalePrice"
                placeholder="Capacity Price"
                value={cap.capSalePrice}
                aria-label="Capacity Price"
                onChange={(e) =>
                  handleCapChange(index, {
                    ...cap,
                    capSalePrice: e.target.value,
                  })
                }
                errors={errors?.[index]?.capSalePrice}
              />
            </div>

            {cap.capSalePrice && (
              <>
                <VariablesInput
                  type="date"
                  name="capSaleStartDate"
                  placeholder="Capacity Sale Start Date"
                  value={
                    cap.capSaleStartDate
                      ? new Date(cap.capSaleStartDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  aria-label="Capacity Sale Start Date"
                  onChange={(e) =>
                    handleCapChange(index, {
                      ...cap,
                      capSaleStartDate: e.target.value,
                    })
                  }
                  errors={errors?.[index]?.capSaleStartDate}
                />

                <VariablesInput
                  type="date"
                  name="capSaleEndDate"
                  placeholder="Capacity Sale End Date"
                  value={
                    cap.capSaleEndDate
                      ? new Date(cap.capSaleEndDate).toISOString().split("T")[0]
                      : ""
                  }
                  aria-label="Capacity Sale End Date"
                  onChange={(e) =>
                    handleCapChange(index, {
                      ...cap,
                      capSaleEndDate: e.target.value,
                    })
                  }
                  errors={errors?.[index]?.capSaleEndDate}
                />
              </>
            )}

            <div>
              <label>Is Available</label>

              <VariablesInput
                type="checkbox"
                checked={cap.isAvailable}
                aria-label="Is Available"
                onChange={(e) =>
                  handleCapChange(index, {
                    ...cap,
                    isAvailable: e.target.checked,
                  })
                }
              />

              <label>Default</label>
              <VariablesInput
                type="checkbox"
                checked={cap.isDefault}
                aria-label="Default Size"
                onChange={() => toggleDefaultCap(index)}
              />
            </div>
          </div>
          <hr className="size__indicationLine" />
          <span
            className="size__btn-remove"
            onClick={(e) => {
              e.preventDefault();
              handleRemoveCap(index);
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
          handleAddCap();
        }}
        className="size__btn"
      >
        <FaPlus /> Add Capacity
      </button>
    </section>
  );
}
