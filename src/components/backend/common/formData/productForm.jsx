import React from "react";
import "../styles/productForm.css";
import InputField from "../../products/common/InputField";
import TextareaField from "../../products/common/TextareaField";
import AttributesForm from "../../products/common/AttributesForm";

import ColorsForm from "../../products/common/colorsForm";
import SizeForm from "../../products/common/sizeForm";
import CapacityForm from "../../products/common/capacityForm";
import MaterialsForm from "../../products/common/materialsForm";

export default function ProductForm({
  data,
  errors,
  darkMode,
  handleInputChange,
  handleEditorChange,
  attributes,
  onAttributesChange,
  onColorChange,
  editorContent,
  handleSubmit,
  colors,
  toggleDefaultColor,
  handleAddColor,
  handleRemoveColor,
  handleColorChange,
  handleColorImageUpload,
  handleAddSize,
  handleRemoveSize,
  handleSizeChange,
  toggleDefaultSize,
  sizes,
  capacity,
  handleAddCap,
  handleRemoveCap,
  handleCapChange,
  toggleDefaultCap,
  materials,
  toggleDefaultMaterials,
  handleAddMaterials,
  handleMaterialsChange,
  handleRemoveMaterials,
}) {
  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ color: [] }],
    ["clean"],
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  return (
    <section className={`productForm__main ${darkMode ? "dark-mode" : ""}`}>
      <form onSubmit={handleSubmit}>
        <InputField
          name="name"
          autoFocus
          onChange={handleInputChange}
          value={data.name}
          errors={errors.name}
          placeholder="Product Name"
          tooltip="Enter your product name"
          darkMode={darkMode}
        />

        <section className="productForm__group-two">
          <InputField
            name="sku"
            onChange={handleInputChange}
            value={data.sku}
            errors={errors.sku}
            placeholder="SKU"
            tooltip="Enter your product SKU"
            darkMode={darkMode}
          />

          <InputField
            name="weight"
            onChange={handleInputChange}
            value={data.weight}
            errors={errors.weight}
            placeholder="Weight"
            tooltip="Enter your product Weight"
            darkMode={darkMode}
            type="number"
          />
        </section>
        <section className="productForm__group-two">
          <InputField
            name="price"
            onChange={handleInputChange}
            value={data.price}
            errors={errors.price}
            placeholder="Price"
            tooltip="Enter your product Price"
            darkMode={darkMode}
          />

          <InputField
            name="numberInStock"
            onChange={handleInputChange}
            value={data.numberInStock}
            errors={errors.numberInStock}
            placeholder="Quantity"
            tooltip="Enter your product Quantity"
            darkMode={darkMode}
            type="number"
          />
        </section>

        <section className="productForm__group-two">
          <InputField
            name="brand"
            onChange={handleInputChange}
            value={data.brand}
            errors={errors.brand}
            placeholder="Brand"
            tooltip="Enter your product Brand"
            darkMode={darkMode}
          />

          <InputField
            name="manufacturer"
            onChange={handleInputChange}
            value={data.manufacturer}
            errors={errors.manufacturer}
            placeholder="Manufacturer"
            tooltip="Enter your product Manufacturer"
            darkMode={darkMode}
          />
        </section>

        <section className="productForm__group-two">
          <InputField
            name="salePrice"
            onChange={handleInputChange}
            value={data.salePrice || ""}
            errors={errors.salePrice}
            placeholder="Sale Price"
            tooltip="Enter your product Sale Price"
            darkMode={darkMode}
            type="number"
          />

          {data.salePrice && (
            <>
              <InputField
                name="saleStartDate"
                onChange={handleInputChange}
                // value={data.saleStartDate}
                value={
                  data.saleStartDate
                    ? new Date(data.saleStartDate).toISOString().split("T")[0]
                    : ""
                }
                errors={errors.saleStartDate}
                placeholder="Sale Start Date"
                tooltip="Enter your product Sale Start Date"
                darkMode={darkMode}
                type="date"
              />

              <InputField
                name="saleEndDate"
                onChange={handleInputChange}
                value={
                  data.saleEndDate
                    ? new Date(data.saleEndDate).toISOString().split("T")[0]
                    : ""
                }
                // value={data.saleEndDate}
                errors={errors.saleEndDate}
                placeholder="Sale End Date"
                tooltip="Enter your product Sale End Date"
                darkMode={darkMode}
                type="date"
              />
            </>
          )}
        </section>

        <section className="productForm__group-three"></section>

        <section>
          <AttributesForm
            darkMode={darkMode}
            onAttributesChange={onAttributesChange}
            attributes={attributes}
            errors={errors.attributes}
          />

          <ColorsForm
            colors={colors}
            errors={errors.colors}
            // onColorChange={onColorChange}
            darkMode={darkMode}
            handleAddColor={handleAddColor}
            handleRemoveColor={handleRemoveColor}
            handleColorChange={handleColorChange}
            toggleDefault={toggleDefaultColor}
            handleColorImageUpload={handleColorImageUpload}
          />

          <SizeForm
            darkMode={darkMode}
            handleAddSize={handleAddSize}
            handleRemoveSize={handleRemoveSize}
            handleSizeChange={handleSizeChange}
            toggleDefaultSize={toggleDefaultSize}
            errors={errors.sizes}
            sizes={sizes}
            // setSizes={setSizes}
          />

          <CapacityForm
            capacity={capacity}
            handleAddCap={handleAddCap}
            handleRemoveCap={handleRemoveCap}
            handleCapChange={handleCapChange}
            toggleDefaultCap={toggleDefaultCap}
            errors={errors.capacity}
            darkMode={darkMode}
          />

          <MaterialsForm
            darkMode={darkMode}
            errors={errors.materials}
            materials={materials}
            handleAddMaterials={handleAddMaterials}
            handleMaterialsChange={handleMaterialsChange}
            handleRemoveMaterials={handleRemoveMaterials}
            toggleDefaultMaterials={toggleDefaultMaterials}
          />
        </section>

        <TextareaField
          label="About the Product"
          id="aboutProduct"
          errors={errors.aboutProduct}
          modules={modules}
          value={editorContent.aboutProduct}
          onChange={(content) => handleEditorChange("aboutProduct", content)}
          tooltip="Enter information About the Product"
        />

        <TextareaField
          label="Product Details"
          id="aboutProduct"
          errors={errors.productDetails}
          modules={modules}
          value={editorContent.productDetails}
          onChange={(content) => handleEditorChange("productDetails", content)}
          tooltip="Enter the product highlights"
        />

        <TextareaField
          label="Product Description"
          id="description"
          errors={errors.description}
          modules={modules}
          value={editorContent.description}
          onChange={(content) => handleEditorChange("description", content)}
          tooltip="Enter the product description"
        />

        <TextareaField
          label="Product Information"
          id="productInformation"
          errors={errors.productInformation}
          modules={modules}
          value={editorContent.productInformation}
          onChange={(content) =>
            handleEditorChange("productInformation", content)
          }
          tooltip="Enter the Product Information"
        />
      </form>
    </section>
  );
}
