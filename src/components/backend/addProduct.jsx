import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

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
import { getCurrentUser } from "../../services/authService";

export default function AddProduct({ darkMode }) {
  const initialProductDetails = useMemo(
    () => ({
      name: "",
      sku: "",
      aboutProduct: "",
      productDetails: "",
      productInformation: "",
      description: "",
      brand: "",
      manufacturer: "",
      weight: "",
      price: "",
      numberInStock: "",
      salePrice: "",
      saleStartDate: "",
      saleEndDate: "",
      media: [],
      featureImage: {},
      category: [],
      tags: [],
    }),
    []
  );

  const [productDetails, setProductDetails] = useState(initialProductDetails);
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
  const [editorproductDetails, setEditorProductDetails] = useState("");
  const [editorProductInformation, setEditorProductInformation] = useState("");
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const fetchTag = useCallback(async () => {
    try {
      const { data: tags } = await getTags();
      setTags(tags);
    } catch (error) {
      console.error("Failed to fetch tags", error);
    }
  }, [setTags]);

  const fetchCategory = useCallback(async () => {
    try {
      const { data: categories } = await getCategories([]);
      setCategories(categories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  }, [setCategories]);

  useEffect(() => {
    fetchTag();
    fetchCategory();

    async function getProductDetails(productId) {
      try {
        const { data: product } = await getProduct(productId);

        setProductDetails({
          ...product,
          media: product.media || [], // Ensure media is an array
          featureImage: product.featureImage,
        });
        setSelectedTags(product.tags.map((tag) => tag.name));
        setSelectedCategories(product.category || []);
        setFeatureImage(product.featureImage);
        setMedia(product.media || []); // Ensure media is an array
        setEditorAbout(product.aboutProduct);
        setEditorProductDetails(product.productDetails);
        setEditorContent(product.description);
        setEditorProductInformation(product.productInformation);
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
    } else {
      setEditingMode(false);
      setProductDetails(initialProductDetails); // Reset the form to initial state
      setSelectedTags([]);
      setSelectedCategories([]);
      setFeatureImage(null);
      setMedia([]);
      setEditorAbout("");
      setEditorProductDetails("");
      setEditorContent("");
      setEditorProductInformation("");
    }
  }, [params.id, navigate, fetchTag, fetchCategory, initialProductDetails]); // Todo

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("Product Details before submitting:", productDetails); // Todo

    const categoryNames = selectedCategories.map((category) => category.name);

    // getCurrentUser()
    const user = getCurrentUser(); // Get the current user
    const userId = user ? user._id : null;
    // const userId = user ? { username: user.username, email: user.email } : null;

    console.log("User ID:", userId);

    const requestBody = {
      ...productDetails,
      aboutProduct: editorAbout,
      productDetails: editorproductDetails,
      productInformation: editorProductInformation,
      description: editorContent,
      category: categoryNames,
      tags: selectedTags,
      media: productDetails.media || [],
      featureImage: productDetails.featureImage,
      userId,
    };

    try {
      if (editingMode) {
        await updateProduct(productDetails._id, requestBody, userId);
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

  const handleChangeAbout = useCallback((content) => {
    setEditorAbout(content);
    setProductDetails((prevState) => ({
      ...prevState,
      aboutProduct: content,
    }));
  }, []);

  const handleProductDetails = useCallback((content) => {
    setEditorProductDetails(content);
    setProductDetails((prevState) => ({
      ...prevState,
      productDetails: content,
    }));
  }, []);

  const handleContentChange = useCallback((content) => {
    setEditorContent(content);
    setProductDetails((prevState) => ({
      ...prevState,
      description: content,
    }));
  }, []);

  const handleProductInformation = useCallback((content) => {
    setEditorProductInformation(content);
    setProductDetails((prevState) => ({
      ...prevState,
      productInformation: content,
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const preview = URL.createObjectURL(file);
      setFeatureImage({ file, preview });
      setProductDetails((prevState) => ({
        ...prevState,
        featureImage: { file, preview },
      }));
    } else {
      setFeatureImage(null);
      setProductDetails((prevState) => ({
        ...prevState,
        featureImage: null,
      }));
    }
  }, []);

  const handleProductImagesChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    setProductDetails((prevState) => ({
      ...prevState,
      media: [...(prevState.media || []), ...files],
    }));
  }, []);

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
              editorAbout={editorAbout}
              editorDecription={editorContent}
              handleChangeDecription={handleContentChange}
              handleChangeAbout={handleChangeAbout}
              handleChangeHighlight={handleContentChange}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              handleProductDetails={handleProductDetails}
              editorproductDetails={editorproductDetails}
              handleProductInformation={handleProductInformation}
              editorProductInformation={editorProductInformation}
            />
          </section>

          <div className="addProduct-sidebar">
            <div className={`addProduct-header ${darkMode ? "dark-mode" : ""}`}>
              <span className="addProduct__publish-heading">
                <button
                  onClick={handleSubmit}
                  // disabled={isSubmitting}
                  className={`publish-button ${darkMode ? "dark-mode" : ""}`}
                >
                  {editingMode ? "Update" : "Publish"}
                </button>
                {/* {isSubmitting && <div className="loading-spinner"></div>} */}
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
              />
            </div>

            <div className={`addProduct-header ${darkMode ? "dark-mode" : ""}`}>
              <span className="addProduct__publish-heading">
                <button
                  onClick={handleSubmit}
                  // disabled={isSubmitting}
                  className={`publish-button ${darkMode ? "dark-mode" : ""}`}
                >
                  {editingMode ? "Update" : "Publish"}
                </button>
                {/* {isSubmitting && <div className="loading-spinner"></div>} */}
              </span>
            </div>
          </div>
        </section>
      </section>
    </section>
  );
}
