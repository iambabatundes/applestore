import { useState, useEffect } from "react";
import {
  validateForm,
  validateProperty,
} from "../validation/promotionValidation";
export const usePromotionForm = (
  initialData,
  onEditPromotion,
  onAddPromotion,
  selectedPromotion
) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (selectedPromotion) {
      const formattedPromotion = {
        promotionName: selectedPromotion.promotionName || "",
        description: selectedPromotion.description || "",
        promotionType: selectedPromotion.promotionType || "Discount",
        discountPercentage:
          selectedPromotion.promotionType === "Discount"
            ? selectedPromotion.discountPercentage || 1
            : "",
        flashSalePrice:
          selectedPromotion.promotionType === "FlashSale"
            ? selectedPromotion.flashSalePrice || 1
            : "",

        shippingDiscount:
          selectedPromotion.promotionType === "FreeShipping"
            ? selectedPromotion.shippingDiscount || 1
            : "",

        minimumQuantity:
          selectedPromotion.promotionType === "BundleDeal"
            ? selectedPromotion.minimumQuantity || 1
            : "",

        freeQuantity:
          selectedPromotion.promotionType === "BundleDeal"
            ? selectedPromotion.freeQuantity || 1
            : "",

        startDate: formatDate(selectedPromotion.startDate),
        endDate: formatDate(selectedPromotion.endDate),
        isActive: selectedPromotion.isActive || true,
      };
      setFormData(formattedPromotion);
    } else {
      resetForm();
    }
  }, [selectedPromotion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedFormData = { ...formData };

    // Reset fields based on promotionType
    if (name === "promotionType") {
      updatedFormData.discountPercentage = value === "Discount" ? 1 : "";
      updatedFormData.flashSalePrice = value === "FlashSale" ? 1 : "";
      updatedFormData.shippingDiscount = value === "FreeShipping" ? 1 : "";
      updatedFormData.minimumQuantity = value === "BundleDeal" ? 1 : "";
      updatedFormData.freeQuantity = value === "BundleDeal" ? 1 : "";
    }

    // Handle checkbox state
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Validation
    const errorMessage = validateProperty({ name, value });
    setErrors({ ...errors, [name]: errorMessage || undefined });
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Submitting data:", formData);
  //   // const validationErrors = validateForm();
  //   // if (validationErrors) return;

  //   const validationErrors = validateForm();
  //   if (validationErrors) {
  //     console.log(validationErrors);
  //     return;
  //   }

  //   let promotionData = {
  //     promotionName: formData.promotionName,
  //     description: formData.description,
  //     promotionType: formData.promotionType,
  //     startDate: new Date(formData.startDate).toISOString(),
  //     endDate: new Date(formData.endDate).toISOString(),
  //     isActive: formData.isActive,
  //   };

  //   // Add fields based on promotionType
  //   if (formData.promotionType === "Discount") {
  //     promotionData.discountPercentage = Number(formData.discountPercentage);
  //   } else if (formData.promotionType === "FlashSale") {
  //     promotionData.flashSalePrice = Number(formData.flashSalePrice);
  //   } else if (formData.promotionType === "FreeShipping") {
  //     promotionData.shippingDiscount = Number(formData.shippingDiscount);
  //   } else if (formData.promotionType === "BundleDeal") {
  //     promotionData.minimumQuantity = Number(formData.minimumQuantity);
  //     promotionData.freeQuantity = Number(formData.freeQuantity);
  //   }

  //   console.log("Submitting data:", promotionData);

  //   if (selectedPromotion) {
  //     onEditPromotion(selectedPromotion._id, promotionData);
  //   } else {
  //     onAddPromotion(promotionData);
  //   }

  //   // onSubmit(promotionData, resetForm);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Initial Form Data:", formData);

    const validationErrors = validateForm();
    if (validationErrors) {
      console.log("Validation Errors:", validationErrors);
      return;
    }

    const promotionData = {
      promotionName: formData.promotionName,
      description: formData.description,
      promotionType: formData.promotionType,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      isActive: formData.isActive,
    };

    // Add fields based on promotionType
    if (formData.promotionType === "Discount") {
      promotionData.discountPercentage = Number(formData.discountPercentage);
    } else if (formData.promotionType === "FlashSale") {
      promotionData.flashSalePrice = Number(formData.flashSalePrice);
    } else if (formData.promotionType === "FreeShipping") {
      promotionData.shippingDiscount = Number(formData.shippingDiscount);
    } else if (formData.promotionType === "BundleDeal") {
      promotionData.minimumQuantity = Number(formData.minimumQuantity);
      promotionData.freeQuantity = Number(formData.freeQuantity);
    }

    console.log("Final Submission Data:", promotionData);

    if (selectedPromotion) {
      onEditPromotion(selectedPromotion._id, promotionData); // Make sure `selectedPromotion._id` is valid
    } else {
      onAddPromotion(promotionData);
    }
  };

  return { formData, errors, handleChange, handleSubmit, resetForm };
};
