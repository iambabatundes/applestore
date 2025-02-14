import React from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import VariablesInput from "./variablesInput";

export default function MaterialsForm({
  darkMode,
  materials,
  handleAddMaterials,
  handleRemoveMaterials,
  handleMaterialsChange,
  toggleDefaultMaterials,
  errors,
}) {
  return (
    <section className={`productColors ${darkMode ? "dark-mode" : ""}`}>
      <h1 className={`color__title ${darkMode ? "dark-mode" : ""}`}>
        Material
      </h1>
      {materials.map((mat, index) => (
        <>
          <div key={index} className="productForm__color">
            <div>
              <VariablesInput
                key={index}
                type="text"
                name="matName"
                darkMode={darkMode}
                placeholder="Material Name"
                value={mat.matName}
                aria-label="Material Name"
                // errors={errors?.[index]?.sizeName}
                errors={errors?.[index]?.matName}
                onChange={(e) =>
                  handleMaterialsChange(index, {
                    ...mat,
                    matName: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <VariablesInput
                type="number"
                name="matPrice"
                placeholder="Material Price"
                value={mat.matPrice}
                aria-label="Material Price"
                onChange={(e) =>
                  handleMaterialsChange(index, {
                    ...mat,
                    matPrice: e.target.value,
                  })
                }
                errors={errors?.[index]?.matPrice}
              />
            </div>
            <div>
              <VariablesInput
                type="number"
                name="matStock"
                placeholder="Material Quantity"
                value={mat.matStock}
                aria-label="Material Quantity"
                onChange={(e) =>
                  handleMaterialsChange(index, {
                    ...mat,
                    matStock: e.target.value,
                  })
                }
                errors={errors?.[index]?.matStock}
              />
            </div>

            <div>
              <VariablesInput
                type="number"
                name="matSalePrice"
                placeholder="Materials Sale Price"
                value={mat.matSalePrice}
                aria-label="Material Sale Price"
                onChange={(e) =>
                  handleMaterialsChange(index, {
                    ...mat,
                    matSalePrice: e.target.value,
                  })
                }
                errors={errors?.[index]?.matSalePrice}
              />
            </div>

            {mat.matSalePrice && (
              <>
                <VariablesInput
                  type="date"
                  name="matSaleStartDate"
                  placeholder="Material Sale Start Date"
                  value={
                    mat.matSaleStartDate
                      ? new Date(mat.matSaleStartDate)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  aria-label="Material Sale Start Date"
                  onChange={(e) =>
                    handleMaterialsChange(index, {
                      ...mat,
                      matSaleStartDate: e.target.value,
                    })
                  }
                  errors={errors?.[index]?.matSaleStartDate}
                />

                <VariablesInput
                  type="date"
                  name="matSaleEndDate"
                  placeholder="Material Sale End Date"
                  value={
                    mat.matSaleEndDate
                      ? new Date(mat.matSaleEndDate).toISOString().split("T")[0]
                      : ""
                  }
                  aria-label="Material Sale End Date"
                  onChange={(e) =>
                    handleMaterialsChange(index, {
                      ...mat,
                      matSaleEndDate: e.target.value,
                    })
                  }
                  errors={errors?.[index]?.matSaleEndDate}
                />
              </>
            )}

            <div>
              <label>Is Available</label>

              <VariablesInput
                type="checkbox"
                checked={mat.isAvailable}
                aria-label="Is Available"
                onChange={(e) =>
                  handleMaterialsChange(index, {
                    ...mat,
                    isAvailable: e.target.checked,
                  })
                }
              />

              <label>Default</label>
              <VariablesInput
                type="checkbox"
                checked={mat.isDefault}
                aria-label="Default Materials"
                onChange={() => toggleDefaultMaterials(index)}
              />
            </div>
          </div>
          <hr className="size__indicationLine" />
          <span
            className="size__btn-remove"
            onClick={(e) => {
              e.preventDefault();
              handleRemoveMaterials(index);
            }}
            aria-label="Materials Default checkout"
          >
            <FaTrash /> Remove
          </span>
        </>
      ))}

      <button
        onClick={(e) => {
          e.preventDefault();
          handleAddMaterials();
        }}
        className="size__btn"
      >
        <FaPlus /> Add Materials
      </button>
    </section>
  );
}
