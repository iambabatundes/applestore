import React, { useState, useEffect } from "react";
import FormField from "./common/formField";
import "./styles/couponForm.css";
import { validateForm, validateProperty } from "./validations/couponValidation";
import SelectInput from "../promotions/common/selectInput";

export default function CouponForm({
  onAddCoupon,
  selectedCoupon,
  onEditCoupon,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountPercentage: "",
    discountValue: "",
    expirationDate: "",
    startDate: "",
    minimumOrderAmount: 0,
    maximumDiscountAmount: "",
    usageLimit: "",
    usagePerUser: 1,
    description: "",
    isActive: true,
    firstTimeUserOnly: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedCoupon) {
      const formattedCoupon = {
        code: selectedCoupon.code || "",
        discountType: selectedCoupon.discountType || "percentage",
        discountPercentage:
          selectedCoupon.discountType === "percentage"
            ? selectedCoupon.discountPercentage
            : "",
        discountValue:
          selectedCoupon.discountType === "fixed"
            ? selectedCoupon.discountValue
            : "",
        expirationDate: selectedCoupon.expirationDate
          ? new Date(selectedCoupon.expirationDate).toISOString().split("T")[0]
          : "",
        startDate: selectedCoupon.startDate
          ? new Date(selectedCoupon.startDate).toISOString().split("T")[0]
          : "",
        minimumOrderAmount: selectedCoupon.minimumOrderAmount || 0,
        maximumDiscountAmount: selectedCoupon.maximumDiscountAmount || "",
        usageLimit: selectedCoupon.usageLimit || "",
        usagePerUser: selectedCoupon.usagePerUser || 1,
        description: selectedCoupon.description || "",
        isActive:
          selectedCoupon.isActive !== undefined
            ? selectedCoupon.isActive
            : true,
        firstTimeUserOnly: selectedCoupon.firstTimeUserOnly || false,
      };
      setFormData(formattedCoupon);
      setErrors({});
    }
  }, [selectedCoupon]);

  const handleChange = ({ target: { name, value, type, checked } }) => {
    const updatedFormData = { ...formData };

    if (type === "checkbox") {
      updatedFormData[name] = checked;
    } else {
      updatedFormData[name] = value;
    }

    if (name === "discountType") {
      updatedFormData.discountPercentage = "";
      updatedFormData.discountValue = "";
      updatedFormData.maximumDiscountAmount = "";
    }

    if (
      [
        "discountPercentage",
        "discountValue",
        "minimumOrderAmount",
        "maximumDiscountAmount",
        "usageLimit",
        "usagePerUser",
      ].includes(name)
    ) {
      if (value === "") {
        updatedFormData[name] = "";
      } else {
        updatedFormData[name] = Number(value);
      }
    }

    const errorMessage = validateProperty({
      name,
      value: type === "checkbox" ? checked : value,
    });
    const updatedErrors = { ...errors, [name]: errorMessage || undefined };

    if (name === "discountType") {
      updatedErrors.discountPercentage = undefined;
      updatedErrors.discountValue = undefined;
      updatedErrors.maximumDiscountAmount = undefined;
    }

    setErrors(updatedErrors);
    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm(formData);
    setErrors(validationErrors || {});

    if (validationErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        expirationDate: formData.expirationDate,
        minimumOrderAmount: Number(formData.minimumOrderAmount) || 0,
        isActive: formData.isActive,
        firstTimeUserOnly: formData.firstTimeUserOnly,
      };

      if (formData.startDate) {
        couponData.startDate = formData.startDate;
      }

      if (formData.description) {
        couponData.description = formData.description;
      }

      if (formData.usageLimit) {
        couponData.usageLimit = Number(formData.usageLimit);
      }

      if (formData.usagePerUser) {
        couponData.usagePerUser = Number(formData.usagePerUser);
      }

      if (formData.discountType === "percentage") {
        couponData.discountPercentage = Number(formData.discountPercentage);

        if (formData.maximumDiscountAmount) {
          couponData.maximumDiscountAmount = Number(
            formData.maximumDiscountAmount
          );
        }
      } else if (formData.discountType === "fixed") {
        couponData.discountValue = Number(formData.discountValue);
      }

      if (selectedCoupon) {
        await onEditCoupon(selectedCoupon._id, couponData);
      } else {
        await onAddCoupon(couponData);
      }

      resetForm();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "percentage",
      discountPercentage: "",
      discountValue: "",
      expirationDate: "",
      startDate: "",
      minimumOrderAmount: 0,
      maximumDiscountAmount: "",
      usageLimit: "",
      usagePerUser: 1,
      description: "",
      isActive: true,
      firstTimeUserOnly: false,
    });
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  return (
    <div className="coupon-form-container">
      <h2 className="coupon__form-heading">
        {selectedCoupon ? "Edit Coupon" : "Create New Coupon"}
      </h2>
      <form onSubmit={handleSubmit} className="coupon-form">
        <div className="coupon-form-grid">
          <FormField
            handleChange={handleChange}
            name="code"
            placeholder="Coupon Code (e.g., SAVE20)"
            type="text"
            value={formData.code}
            error={errors.code}
            label="Coupon Code"
            input
          />

          <SelectInput
            options={["percentage", "fixed"]}
            name="discountType"
            onChange={handleChange}
            value={formData.discountType}
            error={errors.discountType}
            selectDropdowns="coupon__selectDropdowns"
            label="Discount Type"
          />
        </div>

        {formData.discountType === "percentage" && (
          <div className="coupon-form-grid">
            <FormField
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              placeholder="Discount Percentage (0-100)"
              handleChange={handleChange}
              error={errors.discountPercentage}
              label="Discount Percentage (%)"
              input
              min="0"
              max="100"
              step="0.01"
            />

            <FormField
              type="number"
              name="maximumDiscountAmount"
              value={formData.maximumDiscountAmount}
              placeholder="Maximum Discount Amount (optional)"
              handleChange={handleChange}
              error={errors.maximumDiscountAmount}
              label="Maximum Discount Amount (Optional)"
              input
              min="0"
              step="0.01"
            />
          </div>
        )}

        {formData.discountType === "fixed" && (
          <FormField
            type="number"
            name="discountValue"
            value={formData.discountValue}
            handleChange={handleChange}
            error={errors.discountValue}
            placeholder="Discount Value"
            label="Fixed Discount Amount"
            input
            min="0.01"
            step="0.01"
          />
        )}

        <div className="coupon-form-grid">
          <FormField
            type="date"
            name="startDate"
            value={formData.startDate}
            handleChange={handleChange}
            placeholder="Start Date"
            error={errors.startDate}
            label="Start Date (Optional)"
            input
          />

          <FormField
            type="date"
            name="expirationDate"
            value={formData.expirationDate}
            handleChange={handleChange}
            placeholder="Expiration Date"
            error={errors.expirationDate}
            label="Expiration Date"
            input
          />
        </div>

        <div className="coupon-form-grid">
          <FormField
            type="number"
            name="minimumOrderAmount"
            value={formData.minimumOrderAmount}
            handleChange={handleChange}
            placeholder="Minimum Order Amount"
            label="Minimum Order Amount"
            error={errors.minimumOrderAmount}
            input
            min="0"
            step="0.01"
          />

          <FormField
            type="number"
            name="usagePerUser"
            value={formData.usagePerUser}
            handleChange={handleChange}
            placeholder="Usage Per User"
            error={errors.usagePerUser}
            label="Usage Per User"
            input
            min="1"
            max="100"
          />
        </div>

        <FormField
          type="number"
          name="usageLimit"
          value={formData.usageLimit}
          handleChange={handleChange}
          placeholder="Usage Limit (leave empty for unlimited)"
          error={errors.usageLimit}
          label="Total Usage Limit (Optional)"
          input
          min="1"
        />

        <FormField
          type="textarea"
          name="description"
          value={formData.description}
          handleChange={handleChange}
          placeholder="Coupon Description (optional)"
          error={errors.description}
          label="Description (Optional)"
          textarea
        />

        <div className="coupon__checkbox-group">
          <label className="coupon__checkbox-label">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="coupon__checkbox"
            />
            <span>Active</span>
          </label>

          <label className="coupon__checkbox-label">
            <input
              type="checkbox"
              name="firstTimeUserOnly"
              checked={formData.firstTimeUserOnly}
              onChange={handleChange}
              className="coupon__checkbox"
            />
            <span>First-Time Users Only</span>
          </label>
        </div>

        <div className="coupon__button-group">
          <button
            className="coupon__btn coupon__btn-primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : selectedCoupon
              ? "Update Coupon"
              : "Create Coupon"}
          </button>

          {selectedCoupon && (
            <button
              type="button"
              className="coupon__btn coupon__btn-secondary"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
