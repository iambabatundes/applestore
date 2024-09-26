import React from "react";
import "../styles/promotions.css";
import TextInput from "./textInput";
import SelectInput from "./selectInput";
import { usePromotionForm } from "../hooks/usePromotionForm";

const initialState = {
  name: "",
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
};

export default function PromotionForm({ onSubmit, selectedPromotion }) {
  const { formData, errors, handleChange, handleSubmit } = usePromotionForm(
    initialState,
    onSubmit,
    selectedPromotion
  );

  return (
    <form onSubmit={handleSubmit} className="promotions__form">
      <TextInput
        name="name"
        label="Promotion Name"
        onChange={handleChange}
        value={formData.name}
        type="text"
        error={errors.name}
      />

      <TextInput
        name="description"
        label="Promotion Description"
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
          value={formData.discountPercentage}
          onChange={handleChange}
          error={errors.discountPercentage}
          type="number"
        />
      )}

      {formData.promotionType === "FlashSale" && (
        <TextInput
          label="Flash Sale Price"
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
            name="minimumQuantity"
            value={formData.minimumQuantity}
            onChange={handleChange}
            error={errors.minimumQuantity}
            type="number"
          />

          <TextInput
            label="Free Quantity"
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
