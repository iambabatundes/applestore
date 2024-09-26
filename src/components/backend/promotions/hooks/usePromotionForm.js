import { useState, useEffect } from "react";
import Joi from "joi";

export const usePromotionForm = (initialData, onSubmit, selectedPromotion) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const schema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    description: Joi.string().min(3).required(),
    promotionType: Joi.string()
      .valid("Discount", "FlashSale", "FreeShipping", "BundleDeal")
      .required(),
    discountPercentage: Joi.number()
      .min(1)
      .max(100)
      .when("promotionType", { is: "Discount", then: Joi.required() }),
    flashSalePrice: Joi.number().when("promotionType", {
      is: "FlashSale",
      then: Joi.required(),
    }),
    shippingDiscount: Joi.number()
      .min(0)
      .max(100)
      .when("promotionType", { is: "FreeShipping", then: Joi.required() }),
    minimumQuantity: Joi.number()
      .min(1)
      .when("promotionType", { is: "BundleDeal", then: Joi.required() }),
    freeQuantity: Joi.number()
      .min(1)
      .when("promotionType", { is: "BundleDeal", then: Joi.required() }),
    startDate: Joi.date(),
    endDate: Joi.date().min(Joi.ref("startDate")),
    isActive: Joi.boolean(),
  });

  // Format the date to "YYYY-MM-DD" for input fields
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (selectedPromotion) {
      setFormData({
        ...selectedPromotion,
        startDate: formatDate(selectedPromotion.startDate),
        endDate: formatDate(selectedPromotion.endDate),
      });
    } else {
      resetForm();
    }
  }, [selectedPromotion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const { error } = schema.validate(formData, { abortEarly: false });
    if (!error) return null;

    const errorObj = {};
    error.details.forEach((err) => {
      errorObj[err.path[0]] = err.message;
    });
    setErrors(errorObj);
    return errorObj;
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (validationErrors) return;

    let promotionData = {
      name: formData.name,
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

    onSubmit(promotionData, resetForm);
  };

  return { formData, errors, handleChange, handleSubmit, resetForm };
};
