// PaymentMethodForm.js
import React, { useState, useRef, useEffect } from "react";
import checkoutService from "../../../services/checkoutService";
// import paymentService from "../../../services/paymentService";

export default function PaymentMethodForm({
  onSubmit,
  onCancel,
  loading,
  userId,
}) {
  const [formData, setFormData] = useState({
    type: "card",
    provider: "stripe",
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    billingAddress: {
      fullName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
    isDefault: false,
    saveCard: true,
  });

  const [errors, setErrors] = useState({});
  const [tokenizing, setTokenizing] = useState(false);
  const [cardBrand, setCardBrand] = useState("");
  const stripeElementsRef = useRef(null);
  const cardElementRef = useRef(null);

  // Initialize Stripe Elements for PCI-compliant card collection
  useEffect(() => {
    if (formData.provider === "stripe") {
      initializeStripeElements();
    }
    return () => {
      cleanupStripeElements();
    };
  }, [formData.provider]);

  const initializeStripeElements = async () => {
    try {
      const { elements, cardElement } =
        await checkoutService.initializeStripeElements({
          mode: "payment",
          appearance: {
            theme: "stripe",
            variables: {
              colorPrimary: "#0066cc",
              colorBackground: "#ffffff",
              colorText: "#1a1a1a",
            },
          },
        });

      stripeElementsRef.current = elements;
      cardElementRef.current = cardElement;

      // Mount card element
      if (cardElementRef.current) {
        cardElementRef.current.mount("#card-element");
        cardElementRef.current.on("change", handleStripeElementChange);
      }
    } catch (error) {
      console.error("Failed to initialize Stripe elements:", error);
      setErrors((prev) => ({
        ...prev,
        stripe: "Failed to initialize payment system",
      }));
    }
  };

  const cleanupStripeElements = () => {
    if (cardElementRef.current) {
      cardElementRef.current.unmount();
      cardElementRef.current = null;
    }
    stripeElementsRef.current = null;
  };

  const handleStripeElementChange = (event) => {
    if (event.error) {
      setErrors((prev) => ({ ...prev, stripe: event.error.message }));
    } else {
      setErrors((prev) => ({ ...prev, stripe: "" }));
    }

    // Detect card brand
    if (event.brand && event.brand !== "unknown") {
      setCardBrand(event.brand);
    }
  };

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

    // Basic validation
    if (!formData.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required";
    }

    if (!formData.expiryMonth) {
      newErrors.expiryMonth = "Expiry month is required";
    }

    if (!formData.expiryYear) {
      newErrors.expiryYear = "Expiry year is required";
    } else {
      // Validate expiry date
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      if (
        parseInt(formData.expiryYear) === currentYear &&
        parseInt(formData.expiryMonth) < currentMonth
      ) {
        newErrors.expiryMonth = "Card has expired";
      }
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

    // Provider-specific validation
    if (formData.provider === "stripe" && !stripeElementsRef.current) {
      newErrors.stripe = "Payment system not ready";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const tokenizeWithStripe = async () => {
    if (!stripeElementsRef.current) {
      throw new Error("Stripe not initialized");
    }

    // Create payment method with Stripe Elements
    const { error, paymentMethod } =
      await stripeElementsRef.current.createPaymentMethod({
        type: "card",
        card: cardElementRef.current,
        billing_details: {
          name: formData.cardName,
          email: userId?.email, // You might want to pass user email
          address: {
            line1: formData.billingAddress.street,
            city: formData.billingAddress.city,
            state: formData.billingAddress.state,
            postal_code: formData.billingAddress.zipCode,
            country: formData.billingAddress.country,
          },
        },
      });

    if (error) {
      throw new Error(error.message);
    }

    return paymentMethod;
  };

  const tokenizeWithPaystack = async () => {
    // Paystack tokenization would go here
    // This is a simplified version - in reality you'd use Paystack's SDK
    const paystackData = {
      email: userId?.email,
      amount: 0, // For tokenization only
      metadata: {
        custom_fields: [
          {
            display_name: "Card Name",
            variable_name: "card_name",
            value: formData.cardName,
          },
        ],
      },
    };

    // In production, you'd integrate with Paystack's charge endpoint
    const response = await checkoutService.tokenizeWithPaystack(paystackData);
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setTokenizing(true);
    setErrors({});

    try {
      let tokenizationResult;

      // Tokenize based on provider
      switch (formData.provider) {
        case "stripe":
          tokenizationResult = await tokenizeWithStripe();
          break;

        case "paystack":
          tokenizationResult = await tokenizeWithPaystack();
          break;

        default:
          throw new Error(`Unsupported provider: ${formData.provider}`);
      }

      // Prepare secure payment method data
      const securePaymentData = {
        type: formData.type,
        provider: formData.provider,
        token: tokenizationResult.id,
        displayName: `${formData.provider.toUpperCase()} •••• ${
          tokenizationResult.card?.last4 || "****"
        }`,
        isDefault: formData.isDefault,
        saveCard: formData.saveCard,
        billingAddress: formData.billingAddress,
        metadata: {
          cardBrand: tokenizationResult.card?.brand || cardBrand,
          last4: tokenizationResult.card?.last4 || "****",
          expiryMonth:
            tokenizationResult.card?.exp_month || formData.expiryMonth,
          expiryYear: tokenizationResult.card?.exp_year || formData.expiryYear,
          country: tokenizationResult.card?.country || "US",
          funding: tokenizationResult.card?.funding || "unknown",
          tokenizedAt: new Date().toISOString(),
        },
      };

      // Submit to parent component
      await onSubmit(securePaymentData);
    } catch (error) {
      console.error("Tokenization error:", error);
      setErrors((prev) => ({
        ...prev,
        tokenization: error.message || "Failed to process payment method",
      }));
    } finally {
      setTokenizing(false);
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

    if (parts.length > 0) {
      // Basic card brand detection
      const firstDigit = parts[0].charAt(0);
      if (firstDigit === "4") setCardBrand("visa");
      else if (firstDigit === "5") setCardBrand("mastercard");
      else if (firstDigit === "3") setCardBrand("amex");
      else if (firstDigit === "6") setCardBrand("discover");
    }

    return parts.length ? parts.join(" ") : value;
  };

  const getCardIcon = () => {
    switch (cardBrand) {
      case "visa":
        return "fa-cc-visa";
      case "mastercard":
        return "fa-cc-mastercard";
      case "amex":
        return "fa-cc-amex";
      case "discover":
        return "fa-cc-discover";
      default:
        return "fa-credit-card";
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <div className="alert alert-info">
        <i className="fa fa-lock"></i>
        Your payment details are secured with end-to-end encryption and never
        touch our servers.
      </div>

      {/* Provider Selection */}
      <div className="form-group">
        <label>Payment Provider</label>
        <div className="provider-options">
          {["stripe", "paystack", "paypal"].map((provider) => (
            <label key={provider} className="provider-option">
              <input
                type="radio"
                name="provider"
                value={provider}
                checked={formData.provider === provider}
                onChange={handleChange}
              />
              <span className="provider-label">
                <i
                  className={`fa fa-${
                    provider === "paypal" ? "paypal" : "credit-card"
                  }`}
                ></i>
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {formData.provider === "stripe" ? (
        /* Stripe Elements for PCI Compliance */
        <div className="stripe-elements-section">
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

          <div className="form-group">
            <label>
              Card Details <span className="required">*</span>
            </label>
            <div
              id="card-element"
              className={`stripe-card-element ${errors.stripe ? "error" : ""}`}
            ></div>
            {errors.stripe && (
              <span className="error-text">{errors.stripe}</span>
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
          </div>
        </div>
      ) : (
        /* Fallback form for other providers */
        <>
          <div className="form-group">
            <label htmlFor="cardNumber">
              Card Number <span className="required">*</span>
            </label>
            <div className="card-input-wrapper">
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
              {cardBrand && (
                <i className={`fa ${getCardIcon()} card-brand-icon`}></i>
              )}
            </div>
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
        </>
      )}

      {/* Billing Address */}
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
          {/* Add more countries as needed */}
        </select>
        {errors["billing.country"] && (
          <span className="error-text">{errors["billing.country"]}</span>
        )}
      </div>

      {/* Security Options */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="saveCard"
            checked={formData.saveCard}
            onChange={handleChange}
          />
          <span>Securely save this card for future purchases</span>
        </label>
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

      {errors.tokenization && (
        <div className="alert alert-error">
          <i className="fa fa-exclamation-circle"></i>
          {errors.tokenization}
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading || tokenizing}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || tokenizing}
        >
          {tokenizing ? (
            <>
              <i className="fa fa-spinner fa-spin"></i> Securing...
            </>
          ) : loading ? (
            <>
              <i className="fa fa-spinner fa-spin"></i> Adding...
            </>
          ) : (
            <>
              <i className="fa fa-lock"></i> Add Secure Payment Method
            </>
          )}
        </button>
      </div>

      <div className="payment-security-footer">
        <div className="security-badges">
          <i className="fa fa-lock"></i>
          <span>PCI DSS Compliant</span>
          <i className="fa fa-shield"></i>
          <span>256-bit Encryption</span>
        </div>
      </div>
    </form>
  );
}
