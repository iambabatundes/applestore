import { useState, useCallback, useEffect, useMemo } from "react";
import {
  getProduct,
  saveProduct,
  updateProduct,
} from "../../../../services/productService";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getCurrentUser } from "../../../../services/authService";
import { schema } from "./productValidation";

const useProductForm = () => {
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
      promotion: [],
    }),
    []
  );

  const [productDetails, setProductDetails] = useState(initialProductDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMode, setEditingMode] = useState(false);
  const [editorContent, setEditorContent] = useState({
    aboutProduct: "",
    productDetails: "",
    productInformation: "",
    description: "",
  });
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [featureImage, setFeatureImage] = useState(null);
  const [media, setMedia] = useState([]);
  const [errors, setErrors] = useState({});

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async (productId) => {
      try {
        const { data: product } = await getProduct(productId);
        setProductDetails({
          ...product,
          media: product.media || [],
          featureImage: product.featureImage,
          salePrice: product.salePrice || null,
        });
        setSelectedTags(product.tags.map((tag) => tag.name));
        setSelectedCategories(product.category || []);
        setSelectedPromotions(
          product.promotion.map((promotion) => promotion.name)
        );
        setFeatureImage(product.featureImage);
        setMedia(product.media || []);
        setEditorContent({
          aboutProduct: product.aboutProduct,
          productDetails: product.productDetails,
          description: product.description,
          productInformation: product.productInformation,
        });
      } catch (ex) {
        if (ex.response && ex.response.status === 404) {
          navigate("/not-found");
        }
      }
    };

    const productId = params.id;
    if (productId) {
      setEditingMode(true);
      fetchProductDetails(productId);
    } else {
      setEditingMode(false);
      setProductDetails(initialProductDetails);
      setSelectedTags([]);
      setSelectedPromotions([]);
      setSelectedCategories([]);
      setFeatureImage(null);
      setMedia([]);
      setEditorContent({
        aboutProduct: "",
        productDetails: "",
        productInformation: "",
        description: "",
      });
    }
  }, [params.id, navigate, initialProductDetails]);

  function validate() {
    const productDetailsWithEditorContent = {
      ...productDetails,
      ...editorContent,
    };

    const { error } = schema.validate(productDetailsWithEditorContent, {
      abortEarly: false,
    });
    if (!error) return null;

    const validationErrors = {};
    for (let item of error.details)
      validationErrors[item.path[0]] = item.message;

    return validationErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", productDetails);

    const validationErrors = validate();
    if (validationErrors) {
      console.log("Validation errors:", validationErrors); // Log validation errors
      setErrors(validationErrors);
      return;
    }

    // const validationErrors = validate();
    // if (validationErrors) {
    //   setErrors(validationErrors);
    //   return;
    // }

    setIsSubmitting(true);

    const categoryNames = selectedCategories.map((category) => category.name);
    const user = getCurrentUser();
    const userId = user
      ? {
          _id: user._id,
          username: user.username,
          profileImage: user.profileImage,
        }
      : null;

    const requestBody = {
      ...productDetails,
      ...editorContent,
      category: categoryNames,
      tags: selectedTags,
      promotion: selectedPromotions,
      userId,
    };

    console.log("Request body:", requestBody);
    console.error("Request body:", requestBody);

    try {
      if (editingMode) {
        await updateProduct(productDetails._id, requestBody, userId);
        toast.success("Product updated successfully");
      } else {
        await saveProduct(requestBody);
        toast.success("Product added successfully");
      }
      console.log("Response:", requestBody);
      navigate("/admin/all-products");
    } catch (error) {
      toast.error("An error occurred while saving the product");
      console.log("An error occurred while saving the product", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  function validateProperty({ name, value }) {
    const obj = { [name]: value };
    const subSchema = schema.extract(name);
    const { error } = subSchema.validate(obj[name]);
    return error ? error.details[0].message : null;
  }

  function handleInputChange({ target: input }) {
    const errorMessage = validateProperty(input);
    const newErrors = { ...errors };
    if (errorMessage) newErrors[input.name] = errorMessage;
    else delete newErrors[input.name];

    setProductDetails({
      ...productDetails,
      [input.name]: input.value,
    });

    setErrors(newErrors);
  }

  const handleEditorChange = useCallback(
    (name, content) => {
      const newErrors = { ...errors };
      const errorMessage = validateProperty({ name, value: content });
      if (errorMessage) newErrors[name] = errorMessage;
      else delete newErrors[name];

      setEditorContent((prevState) => ({
        ...prevState,
        [name]: content,
      }));
      setProductDetails((prevState) => ({
        ...prevState,
        [name]: content,
      }));

      setErrors(newErrors);
    },
    [errors]
  );

  const handleImageChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const preview = URL.createObjectURL(file);
        const newFeatureImage = { file, preview };

        const errorMessage = validateProperty({
          name: "featureImage",
          value: newFeatureImage,
        });
        const newErrors = { ...errors };
        if (errorMessage) newErrors.featureImage = errorMessage;
        else delete newErrors.featureImage;

        setErrors(newErrors);

        setFeatureImage(newFeatureImage);
        setProductDetails((prevState) => ({
          ...prevState,
          featureImage: newFeatureImage,
        }));
      } else {
        setFeatureImage(null);
        setProductDetails((prevState) => ({
          ...prevState,
          featureImage: null,
        }));
      }
    },
    [errors]
  );

  const handleProductImagesChange = useCallback((e) => {
    const files = Array.from(e.target.files);

    setProductDetails((prevState) => ({
      ...prevState,
      media: [...(prevState.media || []), ...files],
    }));
  }, []);

  // const handleProductImagesChange = useCallback(
  //   ({ target: { files } }) => {
  //     const newMedia = Array.from(files).map((file) => ({
  //       file,
  //       preview: URL.createObjectURL(file),
  //     }));

  //     const errorMessage = validateProperty({ name: "media", value: newMedia });
  //     const newErrors = { ...errors };
  //     if (errorMessage) newErrors.media = errorMessage;
  //     else delete newErrors.media;

  //     setMedia(newMedia);
  //     setProductDetails({
  //       ...productDetails,
  //       media: newMedia,
  //     });
  //     setErrors(newErrors);
  //   },
  //   [errors, productDetails]
  // );

  return {
    productDetails,
    editorContent,
    setEditorContent,
    errors,
    setErrors,
    selectedTags,
    setSelectedTags,
    selectedCategories,
    setSelectedCategories,
    selectedPromotions,
    setSelectedPromotions,
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
  };
};

export default useProductForm;
