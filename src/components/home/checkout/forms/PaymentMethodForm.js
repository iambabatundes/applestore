// PaymentMethodForm.js

import React, { useState } from "react";

export default function PaymentMethodForm({ onSubmit, onCancel, loading }) {
  const [formData, setFormData] = useState({
    type: "card",
    provider: "stripe",
    // Card details
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    // Billing address
    billingAddress: {
      fullName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    isDefault: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("billing.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Card validation
    if (!formData.cardNumber.replace(/\s/g, "")) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{13,19}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
      newErrors.cardNumber = "Invalid card number";
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required";
    }

    if (!formData.expiryMonth) {
      newErrors.expiryMonth = "Expiry month is required";
    }

    if (!formData.expiryYear) {
      newErrors.expiryYear = "Expiry year is required";
    }

    if (!formData.cvv) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "Invalid CVV";
    }

    // Billing address validation
    if (!formData.billingAddress.street.trim()) {
      newErrors["billing.street"] = "Street address is required";
    }
    if (!formData.billingAddress.city.trim()) {
      newErrors["billing.city"] = "City is required";
    }
    if (!formData.billingAddress.zipCode.trim()) {
      newErrors["billing.zipCode"] = "ZIP code is required";
    }
    if (!formData.billingAddress.country.trim()) {
      newErrors["billing.country"] = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // In production, this would tokenize the card with Stripe, paystack and PayPal
      // and send the token instead of raw card data

      onSubmit(formData);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(" ") : value;
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="alert alert-info">
        <i className="fa fa-info-circle"></i>
        This is a demo form. In production, card details would be securely
        tokenized via Stripe/PayPal.
      </div>

      <div className="form-group">
        <label htmlFor="cardNumber">
          Card Number <span className="required">*</span>
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          className={`form-control ${errors.cardNumber ? "error" : ""}`}
          value={formData.cardNumber}
          onChange={(e) =>
            handleChange({
              target: {
                name: "cardNumber",
                value: formatCardNumber(e.target.value),
              },
            })
          }
          placeholder="1234 5678 9012 3456"
          maxLength="19"
        />
        {errors.cardNumber && (
          <span className="error-text">{errors.cardNumber}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="cardName">
          Cardholder Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="cardName"
          name="cardName"
          className={`form-control ${errors.cardName ? "error" : ""}`}
          value={formData.cardName}
          onChange={handleChange}
          placeholder="John Doe"
        />
        {errors.cardName && (
          <span className="error-text">{errors.cardName}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="expiryMonth">
            Expiry Month <span className="required">*</span>
          </label>
          <select
            id="expiryMonth"
            name="expiryMonth"
            className={`form-control ${errors.expiryMonth ? "error" : ""}`}
            value={formData.expiryMonth}
            onChange={handleChange}
          >
            <option value="">MM</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month.toString().padStart(2, "0")}>
                {month.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
          {errors.expiryMonth && (
            <span className="error-text">{errors.expiryMonth}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="expiryYear">
            Expiry Year <span className="required">*</span>
          </label>
          <select
            id="expiryYear"
            name="expiryYear"
            className={`form-control ${errors.expiryYear ? "error" : ""}`}
            value={formData.expiryYear}
            onChange={handleChange}
          >
            <option value="">YYYY</option>
            {Array.from(
              { length: 15 },
              (_, i) => new Date().getFullYear() + i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.expiryYear && (
            <span className="error-text">{errors.expiryYear}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="cvv">
            CVV <span className="required">*</span>
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            className={`form-control ${errors.cvv ? "error" : ""}`}
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength="4"
          />
          {errors.cvv && <span className="error-text">{errors.cvv}</span>}
        </div>
      </div>

      <h3 className="form-section-title">Billing Address</h3>

      <div className="form-group">
        <label htmlFor="billing.street">
          Street Address <span className="required">*</span>
        </label>
        <input
          type="text"
          id="billing.street"
          name="billing.street"
          className={`form-control ${errors["billing.street"] ? "error" : ""}`}
          value={formData.billingAddress.street}
          onChange={handleChange}
          placeholder="123 Main St"
        />
        {errors["billing.street"] && (
          <span className="error-text">{errors["billing.street"]}</span>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="billing.city">
            City <span className="required">*</span>
          </label>
          <input
            type="text"
            id="billing.city"
            name="billing.city"
            className={`form-control ${errors["billing.city"] ? "error" : ""}`}
            value={formData.billingAddress.city}
            onChange={handleChange}
            placeholder="New York"
          />
          {errors["billing.city"] && (
            <span className="error-text">{errors["billing.city"]}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="billing.zipCode">
            ZIP Code <span className="required">*</span>
          </label>
          <input
            type="text"
            id="billing.zipCode"
            name="billing.zipCode"
            className={`form-control ${
              errors["billing.zipCode"] ? "error" : ""
            }`}
            value={formData.billingAddress.zipCode}
            onChange={handleChange}
            placeholder="10001"
          />
          {errors["billing.zipCode"] && (
            <span className="error-text">{errors["billing.zipCode"]}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="billing.country">
          Country <span className="required">*</span>
        </label>
        <select
          id="billing.country"
          name="billing.country"
          className={`form-control ${errors["billing.country"] ? "error" : ""}`}
          value={formData.billingAddress.country}
          onChange={handleChange}
        >
          <option value="">Select Country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="NG">Nigeria</option>
        </select>
        {errors["billing.country"] && (
          <span className="error-text">{errors["billing.country"]}</span>
        )}
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
          />
          <span>Set as default payment method</span>
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <i className="fa fa-spinner fa-spin"></i> Adding...
            </>
          ) : (
            <>
              <i className="fa fa-check"></i> Add Payment Method
            </>
          )}
        </button>
      </div>
    </form>
  );
}
