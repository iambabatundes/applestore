import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import Button from "./button";

import TagsHeader from "./common/TagsHeader";
import CategoryHeader from "./common/CategoriesHeader";
import FeaturedImageHeader from "./common/featuredImageHeader";
import ProductForm from "./common/formData/productForm";
import {
  saveProduct,
  updateProduct,
  getProduct,
} from "../../services/productService";
import ProductImage from "./common/formData/ProductImage";
import { getTags, saveTag } from "../../services/tagService";
import { getCategories, saveCategory } from "../../services/categoryService";
import DataCategory from "./products/dataCategory";
import DataTags from "./products/dataTags";
import ProductGallary from "./common/formData/productGallary";
import ProductGalleryHeader from "./common/productGallaryHeader";
import "../backend/products/styles/addProduct.css";

export default function AddProduct() {
  const [productDetails, setProductDetails] = useState({
    name: "",
    sku: "",
    description: "",
    weight: "",
    price: "",
    numberInStock: "",
    salePrice: "",
    saleStartDate: "",
    saleEndDate: "",
    media: [],
    featureImage: {},
  });
  const [isTagsVisible, setIsTagsVisible] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFeaturedImageVisible, setIsFeaturedImageVisible] = useState(true);
  const [featureImage, setFeatureImage] = useState(null);
  const [isProductGallaryVisible, setIsProductGallaryVisible] = useState(true);
  const [media, setMedia] = useState([]);
  const [editingMode, setEditingMode] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [editorAbout, setEditorAbout] = useState("");
  const [editorHighlight, setEditorHighlight] = useState("");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function getTag() {
      const { data: tags } = await getTags();
      setTags(tags);
    }

    async function getCategory() {
      const { data: categories } = await getCategories([]);
      setCategories(categories);
    }

    async function getProductDetails(productId) {
      try {
        const { data: product } = await getProduct(productId);

        setProductDetails({
          ...product,
          media: product.media || [], // Ensure media is an array
          featureImage: product.featureImage,
        });
        setSelectedTags(product.tags);
        // setSelectedCategories(product.category);
        setSelectedCategories(product.category || []);
        setFeatureImage(product.featureImage);
        setMedia(product.media || []); // Ensure media is an array

        // Ensure media objects are of correct type and structure
        // const mediaFiles = product.media.map((m) => {
        //   return m instanceof File ? m : { ...m, url: m.url }; // Add url property if missing
        // });
        // setMedia(mediaFiles);

        setEditorContent(product.description);
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          navigate("/not-found");
        }
      }
    }

    const productId = params.id;
    if (productId) {
      setEditingMode(true);
      getProductDetails(productId);
    }

    getTag();
    getCategory();
  }, [params.id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Product Details before submitting:", productDetails); // Todo

    const categoryNames = selectedCategories.map((category) => category.name);

    const requestBody = {
      ...productDetails,
      description: editorContent,
      category: categoryNames,
      tags: selectedTags,
      // tags: selectedTags.map((tag) => tag._id),
      media: productDetails.media || [], // to-do
      featureImage: productDetails.featureImage,
    };

    console.log("Request Body:", requestBody);

    try {
      if (editingMode) {
        await updateProduct(productDetails._id, requestBody);
        toast.success("Product updated successfully");
        console.log("This is the updated product", requestBody);
      } else {
        await saveProduct(requestBody);
        console.log("This is the created product", requestBody);
        toast.success("Product added successfully");
      }
      console.log("This is the response");
      navigate("/admin/all-products");
    } catch (error) {
      toast.error("An error occurred while saving the product");
      console.log("An error occurred while saving the product", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleContentChange = (content) => {
    setEditorContent(content);
    setProductDetails((prevState) => ({
      ...prevState,
      description: content,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setFeatureImage({ file, preview });
      setProductDetails((prevState) => ({
        ...prevState,
        // featureImage: file,
        featureImage: { file, preview }, // to-do
      }));
    } else {
      setFeatureImage(null);
      setProductDetails((prevState) => ({
        ...prevState,
        featureImage: null,
      }));
    }
  };

  const handleProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setProductDetails((prevState) => ({
      ...prevState,
      media: [...(prevState.media || []), ...files],
    }));
  };

  return (
    <section className="">
      <header className="addProduct__heading">
        <h1 className="addProduct__title">
          {editingMode ? "Edit Product" : "Add New Product"}
        </h1>
        <Link to="/admin/add-product">
          <button className="addProduct__btn">
            {editingMode ? "Add New" : ""}
          </button>
        </Link>
      </header>

      <section className="padding add-product-section">
        <section className="addProduct-grid">
          <section className="addProduct__productForm">
            <ProductForm
              data={productDetails}
              editorAbout={editorAbout}
              editorDecription={editorContent}
              editorHighlight={editorHighlight}
              handleChangeDecription={handleContentChange}
              handleChangeAbout={handleContentChange}
              handleChangeHighlight={handleContentChange}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
          </section>

          <div className="addProduct-sidebar">
            <div className="addProduct-header">
              <Button
                title="Publish"
                className="publish-button"
                disabled=""
                onClick={handleSubmit}
              />
            </div>

            <div className="addProduct-header">
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
              />
            </div>

            <div className="addProduct-header">
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
              />
            </div>

            <div className="addProduct-header">
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
              />
            </div>

            <div className="addProduct-header">
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
              />
            </div>

            <div className="addProduct-header">
              <Button
                title="Publish"
                className="publish-button"
                disabled=""
                onClick={handleSubmit}
              />
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}
