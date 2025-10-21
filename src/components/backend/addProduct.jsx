import React, { useState } from "react";
import { Link } from "react-router-dom";

import TagsHeader from "./common/TagsHeader";
import CategoryHeader from "./common/CategoriesHeader";
import FeaturedImageHeader from "./common/featuredImageHeader";
import ProductForm from "./common/formData/productForm";
import ProductImage from "./common/formData/ProductImage";
import { getTags, saveTag } from "../../services/tagService";
import { getCategories, saveCategory } from "../../services/categoryService";
import DataCategory from "./products/dataCategory";
import DataTags from "./products/dataTags";
import ProductGallary from "./common/formData/productGallary";
import ProductGalleryHeader from "./common/productGallaryHeader";
import "../backend/products/styles/addProduct.css";
import useFetchTags from "./products/hooks/useFetchTags";
import useFetchCategories from "./products/hooks/useFetchCategories";
import useProductForm from "./products/hooks/useProductForm";
import PromotionsHeader from "./common/promotionHeader";
import DataPromotions from "./products/dataPromotions";
import useFetchPromotions from "./products/hooks/useFetchPromotions";

export default function AddProduct({ darkMode }) {
  const {
    productDetails,
    editorContent,
    selectedTags,
    selectedPromotions,
    setSelectedPromotions,
    errors,
    setErrors,
    setSelectedTags,
    selectedCategories,
    setSelectedCategories,
    featureImage,
    setFeatureImage,
    media,
    setMedia,
    isSubmitting,
    editingMode,
    handleSubmit,
    handleInputChange,
    handleEditorChange,
    handleImageChange,
    handleProductImagesChange,
    attributes,
    handleAttributesChange,

    colors,
    handleColorChange,
    handleAddColor,
    handleRemoveColor,
    toggleDefaultColor,
    handleColorImageUpload,
    getColorImageUrl,

    handleAddSize,
    handleRemoveSize,
    handleSizeChange,
    toggleDefaultSize,
    sizes,
    capacity,
    handleAddCapacity,
    handleCapacityChange,
    handleRemoveCapacity,
    toggleDefaultCapacity,
    materials,
    handleAddMaterials,
    handleMaterialsChange,
    handleRemoveMaterials,
    toggleDefaultMaterials,
  } = useProductForm();

  const [isTagsVisible, setIsTagsVisible] = useState(true);
  const [isPromotionsVisible, setIsPromotionsVisible] = useState(true);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(true);
  const [isFeaturedImageVisible, setIsFeaturedImageVisible] = useState(true);
  const [isProductGallaryVisible, setIsProductGallaryVisible] = useState(true);

  const { tags, setTags } = useFetchTags();
  const { promotions, setPromotions } = useFetchPromotions();
  const { categories, setCategories } = useFetchCategories();

  return (
    <section className={darkMode ? "dark-mode" : ""}>
      <header className={`addProduct__heading ${darkMode ? "dark-mode" : ""}`}>
        <h1 className={`addProduct__title ${darkMode ? "dark-mode" : ""}`}>
          {editingMode ? "Edit Product" : "Add New Product"}
        </h1>
        <Link to="/admin/add-product">
          <button className={`addProduct__btn ${darkMode ? "dark-mode" : ""}`}>
            {editingMode ? "Add New" : ""}
          </button>
        </Link>
      </header>

      <section
        className={`padding add-product-section ${darkMode ? "dark-mode" : ""}`}
      >
        <section className="addProduct-grid">
          <section className="addProduct__productForm">
            <ProductForm
              darkMode={darkMode}
              data={productDetails}
              errors={errors}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              editorContent={editorContent}
              handleEditorChange={handleEditorChange}
              attributes={attributes}
              onAttributesChange={handleAttributesChange}
              // onColorChange={handleColorChange}
              colors={colors}
              handleRemoveSize={handleRemoveSize}
              toggleDefaultSize={toggleDefaultSize}
              handleColorChange={handleColorChange}
              handleAddColor={handleAddColor}
              sizes={sizes}
              handleAddSize={handleAddSize}
              handleSizeChange={handleSizeChange}
              // setSizes={setSizes}
              handleRemoveColor={handleRemoveColor}
              toggleDefaultColor={toggleDefaultColor}
              handleColorImageUpload={handleColorImageUpload}
              getColorImageUrl={getColorImageUrl}
              capacity={capacity}
              handleAddCap={handleAddCapacity}
              handleRemoveCap={handleRemoveCapacity}
              handleCapChange={handleCapacityChange}
              toggleDefaultCap={toggleDefaultCapacity}
              materials={materials}
              handleAddMaterials={handleAddMaterials}
              handleMaterialsChange={handleMaterialsChange}
              handleRemoveMaterials={handleRemoveMaterials}
              toggleDefaultMaterials={toggleDefaultMaterials}
            />
          </section>

          <div className="addProduct-sidebar">
            <div className={`addProduct-header ${darkMode ? "dark-mode" : ""}`}>
              <span className="addProduct__publish-heading">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`publish-button ${darkMode ? "dark-mode" : ""}`}
                >
                  {editingMode ? "Update" : "Publish"}
                </button>
                {isSubmitting && <div className="loading-spinner"></div>}
              </span>
            </div>

            <div className={`addProduct-header ${darkMode ? "dark-mode" : ""}`}>
              <CategoryHeader
                CategoryTitle="Categories"
                isCategoriesVisible={true}
                onClick={() => setIsCategoriesVisible(!isCategoriesVisible)}
              />

              <DataCategory
                isCategoriesVisible={isCategoriesVisible}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                categories={categories}
                setCategories={setCategories}
                getCategories={getCategories}
                saveCategory={saveCategory}
                errors={errors.categories}
                setErrors={setErrors}
              />
            </div>

            <div className={`addProduct-header ${darkMode ? "dark-mode" : ""}`}>
              <TagsHeader
                TagsTitle="Tags"
                isTagsVisible={true}
                onClick={() => setIsTagsVisible(!isTagsVisible)}
              />

              <DataTags
                isTagsVisible={isTagsVisible}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                dataTags={tags}
                getDataTags={getTags}
                saveDataTag={saveTag}
                setDataTags={setTags}
                errors={errors}
                setErrors={setErrors}
              />
            </div>

            <div className={`addProduct-header ${darkMode ? "dark-mode" : ""}`}>
              <PromotionsHeader
                promotionTitle="Promotions"
                isPromotionVisible={true}
                onClick={() => setIsPromotionsVisible(!isPromotionsVisible)}
              />

              <DataPromotions
                isPromotionsVisible={isPromotionsVisible}
                selectedPromotions={selectedPromotions}
                setSelectedPromotions={setSelectedPromotions}
                dataPromotions={promotions}
                setPromotions={setPromotions}
                promotion={promotions}
              />
            </div>

            <div className={`addProduct-header ${darkMode ? "dark-mode" : ""}`}>
              <FeaturedImageHeader
                FeaturedImageTitle="Product Image"
                isFeaturedImageVisible={true}
                onClick={() =>
                  setIsFeaturedImageVisible(!isFeaturedImageVisible)
                }
              />

              <ProductImage
                isFeaturedImageVisible={isFeaturedImageVisible}
                handleImageChange={handleImageChange}
                featureImage={featureImage}
                setFeatureImage={setFeatureImage}
                errors={errors}
                setErrors={setErrors}
              />
            </div>

            <div className={`addProduct-header ${darkMode ? "dark-mode" : ""}`}>
              <ProductGalleryHeader
                dataImageVisible={true}
                productGallaryTitle="Product Gallery"
                onClick={() =>
                  setIsProductGallaryVisible(!isProductGallaryVisible)
                }
              />

              <ProductGallary
                handleProductImagesChange={handleProductImagesChange}
                isProductGalleryVisible={isProductGallaryVisible}
                media={media}
                setMedia={setMedia}
                darkMode={darkMode}
                errors={errors}
                setErrors={setErrors}
              />
            </div>

            <div className={`addProduct-header ${darkMode ? "dark-mode" : ""}`}>
              <span className="addProduct__publish-heading">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`publish-button ${darkMode ? "dark-mode" : ""}`}
                >
                  {editingMode ? "Update" : "Publish"}
                </button>
                {isSubmitting && <div className="loading-spinner"></div>}
              </span>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}
