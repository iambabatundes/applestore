import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import config from "../../../../config.json";

const useColors = ({ setErrors }) => {
  const [colors, setColors] = useState([]);

  /**
   * Add new color variant
   */
  const handleAddColor = useCallback(() => {
    const newColor = {
      colorName: "",
      colorPrice: "",
      stock: "",
      colorSalePrice: null,
      colorSaleStartDate: null,
      colorSaleEndDate: null,
      isAvailable: true,
      isDefault: false,
      colorImages: null,
      colorImageRef: null,
    };

    setColors((prevColors) => [...prevColors, newColor]);

    // Initialize error state for new color
    setErrors((prevErrors) => ({
      ...prevErrors,
      colors: [...(prevErrors.colors || []), {}],
    }));
  }, [setErrors]);

  /**
   * Handle color field changes with validation
   */
  const handleColorChange = useCallback(
    (index, field, value) => {
      setColors((prevColors) => {
        const updatedColors = [...prevColors];

        // Handle boolean fields
        if (field === "isAvailable" || field === "isDefault") {
          const boolValue = value === "true" || value === true;
          updatedColors[index][field] = boolValue;

          // Ensure only one default color
          if (field === "isDefault" && boolValue) {
            updatedColors.forEach((color, i) => {
              if (i !== index) {
                color.isDefault = false;
              }
            });
          }
        }
        // Handle numeric fields
        else if (
          field === "colorPrice" ||
          field === "stock" ||
          field === "colorSalePrice"
        ) {
          updatedColors[index][field] =
            value === "" ? "" : parseFloat(value) || 0;
        }
        // Handle date fields
        else if (
          field === "colorSaleStartDate" ||
          field === "colorSaleEndDate"
        ) {
          updatedColors[index][field] = value === "" ? null : value;
        }
        // Handle other fields
        else {
          updatedColors[index][field] = value;
        }

        return updatedColors;
      });

      // Clear field-specific errors
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        if (newErrors.colors?.[index]?.[field]) {
          delete newErrors.colors[index][field];
        }
        return newErrors;
      });
    },
    [setErrors]
  );

  /**
   * Handle color image upload with validation
   */
  const handleColorImageUpload = useCallback(
    (index, file) => {
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          colors: {
            ...prev.colors,
            [index]: {
              ...prev.colors?.[index],
              colorImages: "Only image files are allowed.",
            },
          },
        }));
        toast.error("Only image files are allowed.");
        return;
      }

      // Validate file size (10 MB)
      const maxFileSize = 10 * 1024 * 1024;
      if (file.size > maxFileSize) {
        setErrors((prev) => ({
          ...prev,
          colors: {
            ...prev.colors,
            [index]: {
              ...prev.colors?.[index],
              colorImages: "File size should not exceed 10 MB.",
            },
          },
        }));
        toast.error("File size should not exceed 10 MB.");
        return;
      }

      // Clear errors for this field
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (newErrors.colors?.[index]?.colorImages) {
          delete newErrors.colors[index].colorImages;
        }
        return newErrors;
      });

      // Create preview URL for new upload
      const preview = URL.createObjectURL(file);
      console.log(`✅ Created blob URL for color ${index}:`, preview);

      setColors((prevColors) => {
        const updatedColors = [...prevColors];
        updatedColors[index].colorImages = {
          file,
          preview,
        };
        return updatedColors;
      });

      toast.success("Color image uploaded successfully!");
    },
    [setErrors]
  );

  const handleRemoveColor = useCallback(
    (index) => {
      if (window.confirm("Are you sure you want to remove this color?")) {
        setColors((prevColors) => {
          // NOTE: Blob URL cleanup is now handled in ColorsForm component
          // We don't revoke here to avoid premature cleanup
          return prevColors.filter((_, i) => i !== index);
        });

        // Clear errors for this color
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          if (newErrors.colors?.[index]) {
            const updatedColorErrors = { ...newErrors.colors };
            delete updatedColorErrors[index];

            // Reindex remaining errors
            const reindexedErrors = [];
            Object.keys(updatedColorErrors).forEach((key) => {
              const keyIndex = parseInt(key);
              if (keyIndex > index) {
                reindexedErrors[keyIndex - 1] = updatedColorErrors[key];
              } else if (keyIndex < index) {
                reindexedErrors[keyIndex] = updatedColorErrors[key];
              }
            });

            return { ...newErrors, colors: reindexedErrors };
          }
          return newErrors;
        });

        toast.success("Color removed successfully!");
      }
    },
    [setErrors]
  );

  /**
   * Toggle default color (only one can be default)
   */
  const toggleDefaultColor = useCallback((index) => {
    setColors((prevColors) => {
      const updatedColors = prevColors.map((color, i) => ({
        ...color,
        isDefault: i === index,
      }));
      return updatedColors;
    });

    toast.success("Default color updated!");
  }, []);

  /**
   * Get color image URL from various possible sources
   */
  const getColorImageUrl = useCallback((colorImages) => {
    if (!colorImages) {
      console.log("🔴 getColorImageUrl: colorImages is null/undefined");
      return null;
    }

    console.log("🔍 getColorImageUrl input:", colorImages);

    // New file upload (has File object and preview)
    if (colorImages.file && colorImages.preview) {
      console.log("✅ Returning preview URL:", colorImages.preview);
      return colorImages.preview;
    }

    // Existing image from backend (Upload model)
    if (colorImages.url) {
      console.log("✅ Returning url:", colorImages.url);
      return colorImages.url;
    }
    if (colorImages.cloudUrl) {
      console.log("✅ Returning cloudUrl:", colorImages.cloudUrl);
      return colorImages.cloudUrl;
    }
    if (colorImages.publicUrl) {
      console.log("✅ Returning publicUrl:", colorImages.publicUrl);
      return colorImages.publicUrl;
    }

    // Legacy filename-based URL
    if (colorImages.filename) {
      const url = `${config.mediaUrl}/uploads/${colorImages.filename}`;
      console.log("✅ Returning filename-based URL:", url);
      return url;
    }

    // Direct preview URL (from editing mode)
    if (colorImages.preview) {
      console.log("✅ Returning direct preview:", colorImages.preview);
      return colorImages.preview;
    }

    // If it's just a string URL
    if (typeof colorImages === "string") {
      if (
        colorImages.startsWith("http") ||
        colorImages.startsWith("/uploads/")
      ) {
        console.log("✅ Returning string URL:", colorImages);
        return colorImages;
      }
      const url = `${config.mediaUrl}/uploads/${colorImages}`;
      console.log("✅ Returning constructed URL:", url);
      return url;
    }

    console.log("🔴 No valid URL found");
    return null;
  }, []);

  /**
   * Comprehensive validation for all colors
   */
  const validateColors = useCallback((colorsToValidate) => {
    const errors = [];

    colorsToValidate.forEach((color, index) => {
      const colorErrors = {};

      // Validate color name
      if (!color.colorName || color.colorName.trim() === "") {
        colorErrors.colorName = "Color name is required";
      } else if (color.colorName.trim().length < 3) {
        colorErrors.colorName = "Color name must be at least 3 characters long";
      }

      // Validate color price
      const priceValue = parseFloat(color.colorPrice);
      if (!color.colorPrice || isNaN(priceValue)) {
        colorErrors.colorPrice = "Price is required and must be a valid number";
      } else if (priceValue < 0 || priceValue > 900000) {
        colorErrors.colorPrice = "Price must be between 0 and 900,000";
      }

      // Validate stock
      const stockValue = parseInt(color.stock, 10);
      if (color.stock === "" || isNaN(stockValue) || stockValue < 0) {
        colorErrors.stock = "Stock must be a non-negative number";
      }

      // Validate sale price against regular price
      if (color.colorSalePrice) {
        const salePriceValue = parseFloat(color.colorSalePrice);

        if (isNaN(salePriceValue)) {
          colorErrors.colorSalePrice = "Sale price must be a valid number";
        } else if (salePriceValue > priceValue) {
          colorErrors.colorSalePrice = "Sale price cannot exceed regular price";
        }

        // Validate sale dates when sale price is set
        if (!color.colorSaleStartDate) {
          colorErrors.colorSaleStartDate =
            "Sale start date required when sale price is set";
        }
        if (!color.colorSaleEndDate) {
          colorErrors.colorSaleEndDate =
            "Sale end date required when sale price is set";
        }
      }

      // Validate sale date range
      if (color.colorSaleStartDate && color.colorSaleEndDate) {
        const startDate = new Date(color.colorSaleStartDate);
        const endDate = new Date(color.colorSaleEndDate);

        if (endDate < startDate) {
          colorErrors.colorSaleEndDate = "End date must be after start date";
        }
      }

      // Only add to errors array if there are validation errors
      if (Object.keys(colorErrors).length > 0) {
        errors[index] = colorErrors;
      }
    });

    return errors.length > 0 ? errors : null;
  }, []);

  /**
   * Batch update colors (useful for form reset or bulk operations)
   */
  const setColor = useCallback((newColors) => {
    setColors(newColors);
  }, []);

  return {
    colors,
    setColor,
    handleAddColor,
    handleColorChange,
    handleColorImageUpload,
    handleRemoveColor,
    toggleDefaultColor,
    getColorImageUrl,
    validateColors,
  };
};

export default useColors;
