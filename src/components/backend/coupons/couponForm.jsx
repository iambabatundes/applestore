import React, { useState, useEffect } from "react";
import FormField from "./common/formField";
import "./styles/couponForm.css";
import { validateForm, validateProperty } from "./validations/couponValidation";
import SelectInput from "../promotions/common/selectInput";

export default function CouponForm({
  onAddCoupon,
  selectedCoupon,
  onEditCoupon,
}) {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "Percentage",
    discountPercentage: 1,
    discountValue: "",
    expirationDate: "",
    minimumOrderAmount: 0,
    usageLimit: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedCoupon) {
      const formattedCoupon = {
        code: selectedCoupon.code || "",
        discountType: selectedCoupon.discountType || "Percentage",
        discountPercentage:
          selectedCoupon.discountType === "Percentage"
            ? selectedCoupon.discountPercentage || 1
            : "",
        discountValue:
          selectedCoupon.discountType === "Fixed"
            ? selectedCoupon.discountValue || 1
            : "",
        expirationDate: selectedCoupon.expirationDate
          ? new Date(selectedCoupon.expirationDate).toISOString().split("T")[0]
          : "",
        minimumOrderAmount: selectedCoupon.minimumOrderAmount || 0,
        usageLimit: selectedCoupon.usageLimit || "",
        isActive: selectedCoupon.isActive || true,
      };
      setFormData(formattedCoupon);
    }
  }, [selectedCoupon]);

  const handleChange = ({ target: { name, value } }) => {
    const updatedFormData = { ...formData, [name]: value };

    // Reset fields when discountType changes
    if (name === "discountType") {
      updatedFormData.discountPercentage = value === "Percentage" ? 1 : "";
      updatedFormData.discountValue = value === "Fixed" ? 1 : "";
    }

    // Convert discountPercentage and discountValue to numbers when applicable
    if (name === "discountPercentage") {
      updatedFormData.discountPercentage = value ? Number(value) : "";
    } else if (name === "discountValue") {
      updatedFormData.discountValue = value ? Number(value) : "";
    }

    // Validate fields
    const errorMessage = validateProperty({ name, value });
    const updatedErrors = { ...errors, [name]: errorMessage || undefined };

    // If discountType changes, clear errors for discountPercentage and discountValue
    if (name === "discountType") {
      updatedErrors.discountPercentage = undefined;
      updatedErrors.discountValue = undefined;
    }

    setErrors(updatedErrors);
    setFormData(updatedFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    setErrors(validationErrors || {});

    if (validationErrors) {
      console.log(validationErrors);
      return;
    }

    // Prepare coupon data
    const couponData = {
      code: formData.code,
      discountType: formData.discountType,
      expirationDate: formData.expirationDate,
      minimumOrderAmount: formData.minimumOrderAmount,
      usageLimit: formData.usageLimit,
      isActive: formData.isActive,
    };

    // If discountType is "Percentage", ensure discountPercentage is applied
    if (formData.discountType === "Percentage") {
      couponData.discountPercentage = Number(formData.discountPercentage || 1);
    }

    // If discountType is "Fixed", ensure discountValue is applied
    if (formData.discountType === "Fixed") {
      couponData.discountValue = Number(formData.discountValue || 1);
    }

    if (selectedCoupon) {
      onEditCoupon(selectedCoupon._id, couponData);
    } else {
      onAddCoupon(couponData);
    }

    // Reset form
    setFormData({
      code: "",
      discountType: "Percentage",
      discountPercentage: 1,
      discountValue: "",
      expirationDate: "",
      minimumOrderAmount: 0,
      usageLimit: "",
      isActive: true,
    });

    setErrors({});
  };

  return (
    <div className="coupon-form-container">
      <h2 className="coupon__form-heading">
        {selectedCoupon ? "Edit Coupon" : "Create New Coupon"}
      </h2>
      <form onSubmit={handleSubmit}>
        <FormField
          handleChange={handleChange}
          name="code"
          placeholder="Coupon Code"
          type="text"
          value={formData.code}
          error={errors.code}
        />

        <SelectInput
          options={["Percentage", "Fixed"]}
          // label="Discount Type"
          name="discountType"
          onChange={handleChange}
          value={formData.discountType}
          error={errors.discountType}
          selectDropdowns="coupon__selectDropdowns"
        />

        {formData.discountType === "Percentage" && (
          <FormField
            type="number"
            name="discountPercentage"
            value={formData.discountPercentage}
            placeholder="Discount Percentage"
            handleChange={handleChange}
            error={errors.discountPercentage}
            label="Discount Percentage"
          />
        )}

        {formData.discountType === "Fixed" && (
          <FormField
            type="number"
            name="discountValue"
            value={formData.discountValue}
            handleChange={handleChange}
            error={errors.discountValue}
            placeholder="Discount Value"
            label="Discount Value"
          />
        )}

        <FormField
          type="date"
          name="expirationDate"
          value={formData.expirationDate}
          handleChange={handleChange}
          placeholder="Expiration Date"
          error={errors.expirationDate}
          label="Expiration Date"
        />

        <FormField
          type="number"
          name="minimumOrderAmount"
          value={formData.minimumOrderAmount}
          handleChange={handleChange}
          placeholder="Minimum Order Amount"
          label="Minimum Order Amount"
          error={errors.minimumOrderAmount}
        />

        <FormField
          type="number"
          name="usageLimit"
          value={formData.usageLimit}
          handleChange={handleChange}
          placeholder="Usage Limit"
          error={errors.usageLimit}
        />

        <button className="coupon__btn" type="submit">
          {selectedCoupon ? "Update Coupon" : "Add Coupon"}
        </button>
      </form>
    </div>
  );
}
