import React, { useState, useEffect } from "react";
import Header from "./common/header";
import Button from "./button";
import TagsHeader from "./common/TagsHeader";
import PostTags from "./common/postTags";
import CategoryHeader from "./common/CategoriesHeader";
import PostCategories from "./common/postCategories";
import FeaturedImageHeader from "./common/featuredImageHeader";
import FeaturedMedia from "./common/FeaturedMedia";
import ProductForm from "./common/formData/productForm";
import {
  saveProduct,
  updateProduct,
  getProducts,
} from "../../services/productService";
import { toast } from "react-toastify";
import ProductImage from "./common/formData/ProductImage";
import { getTags } from "../../services/tagService";

export default function AddProduct({
  editingMode,
  handleSearch,
  mediaData,
  mediaSearch,
  filteredMedia,
  selectedFilter,
}) {
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
  // const [productData, setProductData] = useState([]);
  const [isTagsVisible, setIsTagsVisible] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFeaturedImageVisible, setIsFeaturedImageVisible] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [featureImage, setFeatureImage] = useState({});
  const [editorContent, setEditorContent] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function getTag() {
      const tags = await getTags();
      setTags(tags);
    }

    getTag();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChange = (content) => {
    setEditorContent(content);
  };

  // Function to handle the selection of the featured image
  const handleSelectFeaturedImage = (selectedImage) => {
    setProductDetails((prevState) => ({
      ...prevState,
      featureImage: selectedImage,
    }));
  };

  // Function to handle image upload
  const handleImageChange = (e) => {
    console.log(e.target.files);
    setFeatureImage(URL.createObjectURL(e.target.files[0]));
    // const file = e.target.files[0];
    // setFeatureImage(file);
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
        // If editing, update existing product
        await updateProduct(productData);
        toast.success("Product updated successfully");
      } else {
        // If adding new, save as a new product
        await saveProduct(productData);
        toast.success("Product created successfully");
      }

      // Optionally, you can reset form fields after successful submission
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

      // Optionally, you can redirect the user after successful submission
      // history.push("/products"); // Assuming you're using react-router
    } catch (error) {
      toast.error("Failed to save product");
      console.error("Error saving product:", error);
    }
  };

  const toggleCategories = () => {
    setIsCategoriesVisible(!isCategoriesVisible);
  };

  const toggleTags = () => {
    setIsTagsVisible(!isTagsVisible);
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
          <ProductForm
            onChange={handleInputChange}
            data={productDetails}
            onSubmit={handleSubmit}
            setEditorContent={setEditorContent}
            editorContent={editorContent}
            handleChange={handleChange}
          />
        </section>

        <div className="" style={{ width: 250 }}>
          <div className="createPost-publish">
            <Button title="Publish" className="" />
          </div>

          <div className="createPost-publish">
            <CategoryHeader
              CategoryTitle="Categories"
              isCategoriesVisible={isCategoriesVisible}
              onClick={toggleCategories}
            />

            <PostCategories
              isCategoriesVisible={isCategoriesVisible}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>

          <div className="createPost-publish">
            <TagsHeader
              TagsTitle="Tags"
              isTagsVisible={isTagsVisible}
              onClick={toggleTags}
            />

            <PostTags
              isTagsVisible={isTagsVisible}
              onTagsChange={handleTagsChange}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </div>

          <div className="createPost-publish">
            <FeaturedImageHeader
              FeaturedImageTitle="Product Image"
              isFeaturedImageVisible={isFeaturedImageVisible}
            />

            {/* Pass necessary props to ProductImage component */}
            <ProductImage
              isFeaturedImageVisible={isFeaturedImageVisible}
              insertedMedia={productDetails.media}
              selectedThumbnail={productDetails.featureImage}
              setSelectedThumbnail={handleSelectFeaturedImage}
              handleImageChange={handleImageChange}
              featureImage={featureImage}
            />
          </div>

          <div className="createPost-publish">
            <FeaturedImageHeader
              FeaturedImageTitle="Product Gallary"
              isFeaturedImageVisible={isFeaturedImageVisible}
            />

            {/* Pass necessary props to ProductImage component */}
            <ProductImage
              isFeaturedImageVisible={isFeaturedImageVisible}
              insertedMedia={productDetails.media}
              selectedThumbnail={productDetails.featureImage}
              setSelectedThumbnail={handleSelectFeaturedImage}
              handleImageChange={handleImageChange}
              featureImage={featureImage}
            />
          </div>
        </div>
      </section>
    </section>
  );
}
