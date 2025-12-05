import React, { useState } from "react";

// AddressForm.js
export default function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}) {
  const [formData, setFormData] = useState(
    initialData || {
      fullName: "",
      address: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      phoneNumber: "",
      isDefault: false,
    }
  );

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State/Province is required";
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP/Postal code is required";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    // Phone number validation (optional but must be valid if provided)
    if (
      formData.phoneNumber &&
      !/^\+?[\d\s\-()]+$/.test(formData.phoneNumber)
    ) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="fullName">
          Full Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          className={`form-control ${errors.fullName ? "error" : ""}`}
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
        />
        {errors.fullName && (
          <span className="error-text">{errors.fullName}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="address">
          Street Address <span className="required">*</span>
        </label>
        <input
          type="text"
          id="address"
          name="address"
          className={`form-control ${errors.address ? "error" : ""}`}
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main Street"
        />
        {errors.address && <span className="error-text">{errors.address}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="address2">Apartment, Suite, etc. (Optional)</label>
        <input
          type="text"
          id="address2"
          name="address2"
          className="form-control"
          value={formData.address2}
          onChange={handleChange}
          placeholder="Apt 4B"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">
            City <span className="required">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className={`form-control ${errors.city ? "error" : ""}`}
            value={formData.city}
            onChange={handleChange}
            placeholder="New York"
          />
          {errors.city && <span className="error-text">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="state">
            State/Province <span className="required">*</span>
          </label>
          <input
            type="text"
            id="state"
            name="state"
            className={`form-control ${errors.state ? "error" : ""}`}
            value={formData.state}
            onChange={handleChange}
            placeholder="NY"
          />
          {errors.state && <span className="error-text">{errors.state}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="zipCode">
            ZIP/Postal Code <span className="required">*</span>
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            className={`form-control ${errors.zipCode ? "error" : ""}`}
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="10001"
          />
          {errors.zipCode && (
            <span className="error-text">{errors.zipCode}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="country">
            Country <span className="required">*</span>
          </label>
          <select
            id="country"
            name="country"
            className={`form-control ${errors.country ? "error" : ""}`}
            value={formData.country}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="NG">Nigeria</option>
            {/* Add more countries as needed */}
          </select>
          {errors.country && (
            <span className="error-text">{errors.country}</span>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number (Optional)</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          className={`form-control ${errors.phoneNumber ? "error" : ""}`}
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="+1 (555) 123-4567"
        />
        {errors.phoneNumber && (
          <span className="error-text">{errors.phoneNumber}</span>
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
          <span>Set as default address</span>
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
              <i className="fa fa-spinner fa-spin"></i> Saving...
            </>
          ) : (
            <>
              <i className="fa fa-check"></i>{" "}
              {initialData ? "Update Address" : "Add Address"}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
