import React, { useState, useEffect } from "react";
import "../styles/promotions.css";
import TextInput from "./textInput";
import SelectInput from "./selectInput";
import {
  validateForm,
  validateProperty,
} from "../validation/promotionValidation";

export default function PromotionForm({
  onAddPromotion,
  onEditPromotion,
  selectedPromotion,
}) {
  const [formData, setFormData] = useState({
    promotionName: "",
    description: "",
    promotionType: "Discount",
    discountPercentage: 1,
    flashSalePrice: "",
    shippingDiscount: 1,
    minimumQuantity: 1,
    freeQuantity: 1,
    startDate: "",
    endDate: "",
    isActive: false,
    appliedToAll: false,
    appliedProducts: [],
    appliedCategories: [],
  });
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFormData({
      promotionName: "",
      description: "",
      promotionType: "Discount",
      discountPercentage: 1,
      flashSalePrice: "",
      shippingDiscount: 1,
      minimumQuantity: 1,
      freeQuantity: 1,
      startDate: "",
      endDate: "",
      isActive: false,
      appliedToAll: false,
      appliedProducts: [],
      appliedCategories: [],
    });
    setErrors({});
  };

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
        appliedCategories: selectedPromotion.appliedCategories || [],
        appliedProducts: selectedPromotion.appliedCategories || [],
        appliedToAll: selectedPromotion.appliedToAll || false,
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

  const handleSubmit = (e) => {
    e.preventDefault();

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

    if (selectedPromotion) {
      onEditPromotion(selectedPromotion._id, promotionData); // Make sure `selectedPromotion._id` is valid
    } else {
      onAddPromotion(promotionData);
    }
    resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="promotions__form">
      <TextInput
        name="promotionName"
        // label="Promotion Name"
        placeholder="Promotion Name"
        onChange={handleChange}
        value={formData.promotionName}
        type="text"
        error={errors.promotionName}
      />

      <TextInput
        name="description"
        // label="Promotion Description"
        placeholder="Promotion Description"
        onChange={handleChange}
        value={formData.description}
        error={errors.description}
        textarea
      />

      <SelectInput
        label="Promotion Type"
        name="promotionType"
        options={["Discount", "FlashSale", "FreeShipping", "BundleDeal"]}
        value={formData.promotionType}
        onChange={handleChange}
        error={errors.promotionType}
      />

      {/* Conditional Fields Based on Promotion Type */}
      {formData.promotionType === "Discount" && (
        <TextInput
          label="Discount Percentage"
          name="discountPercentage"
          placeholder="Discount Percentage"
          value={formData.discountPercentage}
          onChange={handleChange}
          error={errors.discountPercentage}
          type="number"
        />
      )}

      {formData.promotionType === "FlashSale" && (
        <TextInput
          label="Flash Sale Price"
          placeholder="Flash Sale Price"
          name="flashSalePrice"
          value={formData.flashSalePrice}
          onChange={handleChange}
          error={errors.flashSalePrice}
          type="number"
        />
      )}

      {formData.promotionType === "FreeShipping" && (
        <TextInput
          label="Shipping Discount"
          placeholder="Shipping Discount"
          name="shippingDiscount"
          value={formData.shippingDiscount}
          onChange={handleChange}
          error={errors.shippingDiscount}
          type="number"
        />
      )}

      {formData.promotionType === "BundleDeal" && (
        <>
          <TextInput
            label="Minimum Quantity"
            placeholder="Minimum Quantity"
            name="minimumQuantity"
            value={formData.minimumQuantity}
            onChange={handleChange}
            error={errors.minimumQuantity}
            type="number"
          />

          <TextInput
            label="Free Quantity"
            placeholder="Free Quantity"
            name="freeQuantity"
            value={formData.freeQuantity}
            onChange={handleChange}
            error={errors.freeQuantity}
            type="number"
          />
        </>
      )}

      {/* Start Date */}
      <TextInput
        type="date"
        name="startDate"
        label="Start Date"
        placeholder="Start Date"
        onChange={handleChange}
        value={formData.startDate}
      />

      {/* End Date */}
      <TextInput
        type="date"
        name="endDate"
        label="End Date"
        onChange={handleChange}
        value={formData.endDate}
      />

      {/* Active Checkbox */}
      <TextInput
        type="checkbox"
        name="isActive"
        checked={formData.isActive}
        onChange={handleChange}
        label="Active"
        className="promotions__checkbox"
      />

      <button className="promotions__btn" type="submit">
        {selectedPromotion ? "Update Promotion" : "Save Promotion"}
      </button>
    </form>
  );
}
