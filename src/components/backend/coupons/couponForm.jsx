import React, { useState } from "react";
import Joi from "joi";
import FormField from "./common/formField";
import "./styles/couponForm.css";

export default function CouponForm({ onAddCoupon }) {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountPercentage: 1,
    discountValue: 1,
    expirationDate: "",
    minimumOrderAmount: 0,
    usageLimit: 1,
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  if (successMessage) {
    return <p>{successMessage}</p>;
  }

  const schema = Joi.object({
    code: Joi.string().required(),
    discountType: Joi.string().valid("percentage", "fixed").required(),
    discountPercentage: Joi.when("discountType", {
      is: "percentage",
      then: Joi.number().min(1).max(100).required(),
      otherwise: Joi.forbidden(),
    }),
    discountValue: Joi.when("discountType", {
      is: "fixed",
      then: Joi.number().min(1).required(),
      otherwise: Joi.forbidden(),
    }),

    expirationDate: Joi.date().required(),
    minimumOrderAmount: Joi.number().min(0),
    usageLimit: Joi.number().min(1),
    // isActive: Joi.boolean(),
    createdAt: Joi.date(),
  });

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

  const handleChange = ({ target: { name, value } }) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors) return;

    const couponData = {
      code: formData.code,
      discountType: formData.discountType,
      expirationDate: new Date(formData.expirationDate).toISOString(),
      minimumOrderAmount: formData.minimumOrderAmount,
      usageLimit: formData.usageLimit,
      isActive: formData.isActive,
    };

    if (formData.discountType === "percentage") {
      couponData.discountPercentage = Number(formData.discountPercentage);
    } else if (formData.discountType === "fixed") {
      couponData.discountValue = Number(formData.discountValue);
    }

    onAddCoupon(couponData);
    setErrors({});
    setSuccessMessage("Coupon added successfully!");
    setFormData({
      code: "",
      discountType: "percentage",
      discountPercentage: 1,
      discountValue: 1,
      expirationDate: "",
      minimumOrderAmount: 0,
      usageLimit: 1,
      //   isActive: true,
    });
  };

  return (
    <div className="coupon-form-container">
      <h2 className="coupon__form-heading">Create New Coupon</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <FormField
          handleChange={handleChange}
          name="code"
          placeholder="Code"
          type="text"
          value={formData.code}
          error={errors.code}
          label="Coupon Code"
        />

        <div className="coupon__formContainer">
          <label>Discount Type</label>
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
          {errors.discountType && (
            <p className="coupon__error">{errors.discountType}</p>
          )}
        </div>

        {formData.discountType === "percentage" ? (
          <>
            <FormField
              type="number"
              name="discountPercentage"
              value={formData.discountPercentage}
              placeholder="Discount Percentage"
              handleChange={handleChange}
              error={errors.discountPercentage}
              label="Discount Percentage"
            />
          </>
        ) : (
          <>
            <FormField
              type="number"
              name="discountValue"
              value={formData.discountValue}
              handleChange={handleChange}
              error={errors.discountValue}
              placeholder="Discount Value"
              label="Discount Value"
            />
          </>
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
          error={errors.minimumOrderAmount}
          label="Minimum Order Amount"
        />

        <FormField
          type="number"
          name="usageLimit"
          value={formData.usageLimit}
          handleChange={handleChange}
          placeholder="Usage Limit"
          error={errors.usageLimit}
          label="Usage Limit"
        />

        <button
          className="coupon__btn"
          type="submit"
          disabled={Object.keys(errors).length > 0}
        >
          Add Coupon
        </button>
      </form>
    </div>
  );
}
