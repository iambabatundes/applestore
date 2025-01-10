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
import config from "../../../../config.json";
import { formatDate } from "../../utils/dateUtils";

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
      salePrice: null,
      saleStartDate: null,
      saleEndDate: null,
      media: [],
      featureImage: {},
      category: [],
      tags: [],
      promotion: [],
      attributes: [],
      colors: [],
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
  const [attributes, setAttributes] = useState([{ key: "", value: "" }]);
  const [colors, setColor] = useState([]);
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
          salePrice: product.salePrice ? parseFloat(product.salePrice) : null,
          saleStartDate: product.saleStartDate
            ? formatDate(product.saleStartDate)
            : "",
          saleEndDate: product.saleEndDate
            ? formatDate(product.saleEndDate)
            : "",
          media: product.media || [],
          featureImage: product.featureImage,
          // salePrice: product.salePrice || null,
        });
        setSelectedTags(product.tags.map((tag) => tag.name));
        setSelectedCategories(product.category || []);
        setSelectedPromotions(product.promotion);

        setFeatureImage(product.featureImage);
        setMedia(product.media || []);
        // setAttributes([{ key: product.key, value: product.value }]);
        setAttributes(
          product.attributes && Array.isArray(product.attributes)
            ? product.attributes.map((attr) => ({
                key: attr.key || "",
                value: attr.value || "",
              }))
            : [{ key: "", value: "" }]
        );

        setColor(
          product.colors.map((color) => ({
            ...color,

            colorImages:
              color.colorImages instanceof Object
                ? `${config.mediaUrl}/uploads/${color.colorImages.filename}`
                : color.colorImages || "",
          }))
        );

        setEditorContent({
          aboutProduct: product.aboutProduct || "",
          productDetails: product.productDetails || "",
          description: product.description || "",
          productInformation: product.productInformation || "",
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
      setAttributes([]);
      setColor([]);
    }
  }, [params.id, navigate, initialProductDetails]);

  function validate() {
    const productDetailsWithEditorContent = {
      ...productDetails,
      ...editorContent,
      attributes,
      colors,
    };

    const { error } = schema.validate(productDetailsWithEditorContent, {
      abortEarly: false,
    });

    if (!error) return null;

    // const validationErrors = {};
    // if (error) {
    //   for (let item of error.details)
    //     validationErrors[item.path[0]] = item.message;
    // }

    // return validationErrors;

    const validationErrors = {};
    for (let item of error.details)
      validationErrors[item.path[0]] = item.message;

    return validationErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", productDetails);

    const sanitizedProductDetails = {
      ...productDetails,
      salePrice:
        productDetails.salePrice === "" ? null : productDetails.salePrice,
    };

    const validationErrors = validate(sanitizedProductDetails);
    if (validationErrors) {
      console.log("Validation errors:", validationErrors);
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    const categoryNames = selectedCategories.map((category) => category.name);
    const promotionNames = selectedPromotions.map(
      (promo) => promo.name || promo
    );

    const user = getCurrentUser();
    const userId = user
      ? {
          _id: user._id,
          username: user.username,
          profileImage: user.profileImage,
        }
      : null;

    const requestBody = {
      ...sanitizedProductDetails,
      ...editorContent,
      attributes: attributes.map((attr) => ({
        key: attr.key,
        value: attr.value,
      })),
      colors,
      category: categoryNames,
      tags: selectedTags,
      promotion: promotionNames,
      userId,
    };

    console.log("Request body:", requestBody);

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
    let errorMessage = error ? error.details[0].message : null;

    // Custom logic for salePrice, saleStartDate, and saleEndDate validation
    if (name === "salePrice" && value) {
      if (!productDetails.saleStartDate || !productDetails.saleEndDate) {
        errorMessage =
          "Both Sale Start Date and Sale End Date are required when Sale Price is set.";
      }
    }

    return errorMessage;
  }

  function handleInputChange({ target: input }) {
    const errorMessage = validateProperty(input);

    const newErrors = { ...errors };
    if (errorMessage) newErrors[input.name] = errorMessage;
    else delete newErrors[input.name];

    // Ensure `salePrice` validation against `price`
    if (input.name === "price" || input.name === "salePrice") {
      const salePrice =
        input.name === "salePrice" ? input.value : productDetails.salePrice;
      const price = input.name === "price" ? input.value : productDetails.price;

      if (salePrice && price && parseFloat(salePrice) > parseFloat(price)) {
        newErrors.salePrice = "Sale Price must not exceed Price.";
      } else {
        delete newErrors.salePrice;
      }
    }

    // Revalidate saleEndDate if saleStartDate changes
    if (input.name === "saleStartDate" || input.name === "saleEndDate") {
      const saleStartDate =
        input.name === "saleStartDate"
          ? input.value
          : productDetails.saleStartDate;
      const saleEndDate =
        input.name === "saleEndDate" ? input.value : productDetails.saleEndDate;

      if (
        saleStartDate &&
        saleEndDate &&
        new Date(saleEndDate) < new Date(saleStartDate)
      ) {
        newErrors.saleEndDate =
          "Sale End Date must not be earlier than Sale Start Date.";
      } else {
        delete newErrors.saleEndDate;
      }
    }

    setProductDetails({
      ...productDetails,
      [input.name]: input.value,
    });

    setErrors(newErrors);
  }

  const handleAttributesChange = (updatedAttributes) => {
    const formattedAttributes = updatedAttributes.map((attr) => ({
      key: attr.key || "",
      value: attr.value || "",
    }));
    setAttributes(formattedAttributes);
  };

  const handleColorChange = (updatedColors) => {
    // Allow only one default color
    const defaultColors = updatedColors.filter((color) => color.isDefault);
    if (defaultColors.length > 1) {
      toast.error("Only one color can be marked as default.");
      return;
    }

    const sanitizedColors = updatedColors.map((color) => ({
      ...color,
      colorImages:
        color.colorImages && typeof color.colorImages === "object"
          ? color.colorImages
          : {},
    }));

    setColor(sanitizedColors);

    setErrors((prevErrors) => ({
      ...prevErrors,
    }));
  };

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

  return {
    productDetails,
    editorContent,
    setEditorContent,
    attributes,
    handleAttributesChange,
    colors,
    handleColorChange,
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
