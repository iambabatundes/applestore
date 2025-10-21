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
import useSizes from "./useSizes";
import useCapacity from "./useCapacity";
import useMaterial from "./useMaterial";
import useColors from "./useColors";

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
      featureImage: null,
      category: [],
      tags: [],
      promotion: [],
      attributes: [],
      colors: [],
      sizes: [],
      capacity: [],
      materials: [],
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
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [featureImage, setFeatureImage] = useState(null);
  const [media, setMedia] = useState([]);
  const [errors, setErrors] = useState({});

  const params = useParams();
  const navigate = useNavigate();

  const {
    sizes,
    setSizes,
    handleAddSize,
    handleSizeChange,
    handleRemoveSize,
    validateSizes,
    toggleDefaultSize,
  } = useSizes({ setErrors });

  const {
    capacity,
    setCapacity,
    handleAddCapacity,
    handleCapacityChange,
    handleRemoveCapacity,
    validateCapacity,
    toggleDefaultCapacity,
  } = useCapacity({ setErrors });

  const {
    materials,
    setMaterials,
    handleAddMaterials,
    handleMaterialsChange,
    handleRemoveMaterials,
    validateMaterials,
    toggleDefaultMaterials,
  } = useMaterial({ setErrors });

  const {
    colors,
    setColor,
    handleAddColor,
    handleColorChange,
    handleColorImageUpload,
    handleRemoveColor,
    toggleDefaultColor,
    getColorImageUrl,
  } = useColors({ setErrors });

  const getImageUrl = useCallback((uploadRef) => {
    if (!uploadRef) return null;

    // If it's already a populated Upload object with url
    if (uploadRef.url) return uploadRef.url;

    // If it has cloudUrl (Cloudinary)
    if (uploadRef.cloudUrl) return uploadRef.cloudUrl;

    // If it has publicUrl (local storage)
    if (uploadRef.publicUrl) return uploadRef.publicUrl;

    // Fallback to legacy filename-based URL
    if (uploadRef.filename) {
      return `${config.mediaUrl}/uploads/${uploadRef.filename}`;
    }

    return null;
  }, []);

  useEffect(() => {
    const fetchProductDetails = async (productId) => {
      try {
        const { data: product } = await getProduct(productId);
        console.log("Fetched Product:", product);

        // Populate feature image
        const featureImageUrl = getImageUrl(product.featureImage);
        const featureImageData = featureImageUrl
          ? {
              preview: featureImageUrl,
              _id: product.featureImage?._id,
              filename: product.featureImage?.filename,
              url: featureImageUrl,
            }
          : null;

        const mediaData = Array.isArray(product.media)
          ? product.media.map((mediaItem) => ({
              preview: getImageUrl(mediaItem),
              _id: mediaItem?._id, // Keep the Upload document ID
              filename: mediaItem?.filename,
              mimeType: mediaItem?.mimeType,
              type: mediaItem?.mimeType,
              url: getImageUrl(mediaItem),
              isNew: false, // Mark as existing media
              cloudUrl: mediaItem?.cloudUrl,
              publicUrl: mediaItem?.publicUrl,
            }))
          : [];

        // Populate colors with image URLs
        const colorsData = Array.isArray(product.colors)
          ? product.colors.map((color) => ({
              ...color,
              colorImages: color.colorImageRef
                ? {
                    preview: getImageUrl(color.colorImageRef),
                    _id: color.colorImageRef?._id,
                    url: getImageUrl(color.colorImageRef),
                  }
                : null,
              // Keep the ref for backend
              colorImageRef: color.colorImageRef?._id || color.colorImageRef,
            }))
          : [];

        setProductDetails({
          ...product,
          salePrice: product.salePrice ? parseFloat(product.salePrice) : null,
          saleStartDate: product.saleStartDate
            ? formatDate(product.saleStartDate)
            : "",
          saleEndDate: product.saleEndDate
            ? formatDate(product.saleEndDate)
            : "",
          featureImage: featureImageData,
          media: mediaData,
          colors: colorsData,
        });

        setSelectedTags(product.tags?.map((tag) => tag.name) || []);
        setSelectedCategories(product.category || []);
        setSelectedPromotions(product.promotion || []);
        setFeatureImage(featureImageData);
        setMedia(mediaData);
        setColor(colorsData);
        setSizes(product.sizes || []);
        setCapacity(product.capacity || []);
        setMaterials(product.materials || []);

        setAttributes(
          product.attributes && Array.isArray(product.attributes)
            ? product.attributes.map((attr) => ({
                key: attr.key || "",
                value: attr.value || "",
              }))
            : [{ key: "", value: "" }]
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
        } else {
          toast.error("Failed to load product details");
          console.error("Error fetching product:", ex);
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
      setAttributes([{ key: "", value: "" }]);
      setColor([]);
      setSizes([]);
      setCapacity([]);
      setMaterials([]);
    }
  }, [
    params.id,
    navigate,
    initialProductDetails,
    getImageUrl,
    setColor,
    setSizes,
    setCapacity,
    setMaterials,
  ]);

  function validate() {
    const productDetailsWithEditorContent = {
      ...productDetails,
      ...editorContent,
      attributes,
      colors,
      sizes,
      capacity,
      materials,
    };

    const { error } = schema.validate(productDetailsWithEditorContent, {
      abortEarly: false,
    });

    const sizeErrors = validateSizes(sizes);
    const capacityErrors = validateCapacity(capacity);
    const materialErrors = validateMaterials(materials);

    if (!error && !sizeErrors && !capacityErrors && !materialErrors)
      return null;

    const validationErrors = {};
    if (error) {
      for (let item of error.details)
        validationErrors[item.path[0]] = item.message;
    }

    if (sizeErrors) validationErrors.sizes = sizeErrors;
    if (capacityErrors) validationErrors.capacity = capacityErrors;
    if (materialErrors) validationErrors.materials = materialErrors;

    return validationErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", productDetails);

    const sanitizedProductDetails = {
      ...productDetails,
      colors,
      sizes,
      capacity,
      materials,
      salePrice:
        productDetails.salePrice === "" ? null : productDetails.salePrice,
    };

    const validationErrors = validate(sanitizedProductDetails);
    if (validationErrors) {
      console.log("Validation errors:", validationErrors);
      setErrors(validationErrors);
      toast.error("Please fix validation errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
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
        attributes: attributes
          .filter((attr) => attr.key && attr.value)
          .map((attr) => ({
            key: attr.key,
            value: attr.value,
          })),
        colors,
        sizes,
        capacity,
        materials,
        category: categoryNames,
        tags: selectedTags,
        promotion: promotionNames,
        userId,
      };

      console.log("Request body:", requestBody);

      if (editingMode) {
        await updateProduct(productDetails._id, requestBody, userId);
        toast.success("Product updated successfully");
      } else {
        await saveProduct(requestBody);
        toast.success("Product created successfully");
      }

      navigate("/admin/all-products");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while saving the product";
      toast.error(errorMessage);
      console.error("Error saving product:", error);
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

    if (productDetails.salePrice) {
      if (!productDetails.saleStartDate) {
        newErrors.saleStartDate =
          "Sale Start Date is required when Sale Price is set.";
      }
      if (!productDetails.saleEndDate) {
        newErrors.saleEndDate =
          "Sale End Date is required when Sale Price is set.";
      }
    }

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

    const newMediaItems = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      isNew: true,
    }));

    // setMedia((prevMedia) => [...prevMedia, ...newMediaItems]);

    setProductDetails((prevState) => ({
      ...prevState,
      media: [...(prevState.media || []), ...newMediaItems],
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
    handleRemoveColor,
    toggleDefaultColor,
    handleAddColor,
    handleColorImageUpload,
    getColorImageUrl,

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

    handleAddSize,
    handleRemoveSize,
    handleSizeChange,
    toggleDefaultSize,
    sizes,
    setSizes,

    handleAddCapacity,
    handleCapacityChange,
    handleRemoveCapacity,
    toggleDefaultCapacity,
    capacity,
    setCapacity,

    materials,
    setMaterials,
    handleAddMaterials,
    handleMaterialsChange,
    handleRemoveMaterials,
    validateMaterials,
    toggleDefaultMaterials,
  };
};

export default useProductForm;
