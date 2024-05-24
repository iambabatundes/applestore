import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Header from "./common/header";
import Button from "./button";
import TagsHeader from "./common/TagsHeader";
import PostTags from "./common/postTags";
import CategoryHeader from "./common/CategoriesHeader";
import FeaturedImageHeader from "./common/featuredImageHeader";
import FeaturedMedia from "./common/FeaturedMedia";
import ProductForm from "./common/formData/productForm";
import {
  saveProduct,
  updateProduct,
  getProducts,
} from "../../services/productService";
import ProductImage from "./common/formData/ProductImage";
import { getTags, saveTag } from "../../services/tagService";
import { getCategories, saveCategory } from "../../services/categoryService";
import DataCategory from "./products/dataCategory";
import DataTags from "./products/dataTags";
import ProductGallary from "./common/formData/productGallary";
import ProductGallaryHeader from "./common/productGallaryHeader";
import { validationSchema } from "./products/validateForm";

export default function AddProduct() {
  const [productDetails, setProductDetails] = useState({
    name: "",
    weight: "",
    sku: "",
    price: "",
    salePrice: "",
    numberInStock: "",
    description: "",
    tags: [],
    categories: [],
    featureImage: {},
    media: [],
  });

  const [isTagsVisible, setIsTagsVisible] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFeaturedImageVisible, setIsFeaturedImageVisible] = useState(true);
  const [isProductGallaryVisible, setIsProductGallaryVisible] = useState(true);

  const [featureImage, setFeatureImage] = useState({});
  const [media, setMedia] = useState([]);
  const [editingMode, setEditingMode] = useState({});
  const [editorContent, setEditorContent] = useState("");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getTag() {
      const { data: tags } = await getTags();
      setTags(tags);
    }

    async function getCategory() {
      const { data: categories } = await getCategories();
      setCategories(categories);
    }

    getTag();
    getCategory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFeatureImage(URL.createObjectURL(e.target.files[0]));
      setProductDetails((prevState) => ({
        ...prevState,
        featureImage: e.target.files[0],
      }));
    } else {
      setFeatureImage(null);
      setProductDetails((prevState) => ({
        ...prevState,
        featureImage: {},
      }));
    }
  };

  const handleProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setProductDetails((prevState) => ({
      ...prevState,
      media: [...prevState.media, ...files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productDetails,
        description: editorContent,
        tags: selectedTags,
        categories: selectedCategories,
        featureImage: featureImage,
      };

      if (editingMode) {
        await updateProduct(productData);
        toast.success("Product updated successfully");
      } else {
        await saveProduct(productData);
        toast.success("Product created successfully");
      }

      setProductDetails({
        name: "",
        weight: "",
        sku: "",
        price: "",
        salePrice: "",
        numberInStock: "",
        description: "",
        tags: [],
        categories: [],
        featureImage: {},
        media: [],
      });
      setEditorContent("");
      setSelectedTags([]);
      setSelectedCategories([]);
      setFeatureImage({});
      alert("Post submitted successfully!");
      navigate("/admin/posts");
    } catch (error) {
      toast.error("Failed to save product");
      console.error("Error saving product:", error);
      alert("An error occurred while submitting the product.");
    }
  };

  const toggleCategories = () => {
    setIsCategoriesVisible(!isCategoriesVisible);
  };

  const toggleTags = () => {
    setIsTagsVisible(!isTagsVisible);
  };

  const togglefeatureImage = () => {
    setIsFeaturedImageVisible(!isFeaturedImageVisible);
  };

  const toggleProductGallary = () => {
    setIsProductGallaryVisible(!isProductGallaryVisible);
  };

  const handleTagsChange = (tags) => {
    setSelectedTags(tags);
  };

  return (
    <section className="padding">
      <Header
        headerTitle={editingMode ? "Edit Product" : "Add New Product"}
        buttonTitle={editingMode ? "Add New" : ""}
        to="/admin/add-product"
      />

      <section className="createNew-grid">
        <section className="blog__post">
          <section className="productForm__main">
            <Formik
              initialValues={productDetails}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                  <ProductForm
                    editorContent={editorContent}
                    handleEditorChange={handleEditorChange}
                  />
                  <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </Form>
              )}
            </Formik>
          </section>
        </section>

        <div className="" style={{ width: 285 }}>
          <div className="createPost-publish">
            <Button title="Publish" className="" />
          </div>

          <div className="createPost-publish">
            <CategoryHeader
              CategoryTitle="Categories"
              isCategoriesVisible={isCategoriesVisible}
              onClick={toggleCategories}
            />

            <DataCategory
              isCategoriesVisible={isCategoriesVisible}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              categories={categories}
              setCategories={setCategories}
              getCategories={getCategories}
              saveCategory={saveCategory}
            />
          </div>

          <div className="createPost-publish">
            <TagsHeader
              TagsTitle="Tags"
              isTagsVisible={isTagsVisible}
              onClick={toggleTags}
            />

            <DataTags
              isTagsVisible={isTagsVisible}
              onTagsChange={handleTagsChange}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
              dataTags={tags}
              getDataTags={getTags}
              saveDataTag={saveTag}
              setDataTags={setTags}
            />
          </div>

          <div className="createPost-publish">
            <FeaturedImageHeader
              FeaturedImageTitle="Product Image"
              isFeaturedImageVisible={isFeaturedImageVisible}
              onClick={togglefeatureImage}
            />

            <ProductImage
              isFeaturedImageVisible={true}
              handleImageChange={handleImageChange}
              featureImage={featureImage}
              // setFeatureImage={setFeatureImage}
            />
          </div>

          <div className="createPost-publish">
            <ProductGallaryHeader
              dataImageVisible={isProductGallaryVisible}
              productGallaryTitle="Product Gallary"
              onClick={toggleProductGallary}
            />

            <ProductGallary
              handleImageChange={handleImageChange}
              handleProductImagesChange={handleProductImagesChange}
              isProductGalleryVisible={isProductGallaryVisible}
              media={media}
              setMedia={setMedia}
            />
          </div>
        </div>
      </section>
    </section>
  );
}
