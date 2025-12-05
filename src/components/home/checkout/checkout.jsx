import React, { useState, useEffect, useCallback } from "react";
import "./styles/checkout.css";
import checkoutService from "../../../services/checkoutService";
import { validateCoupon, applyCoupon } from "../../../services/couponService";
import AddressStep from "./addressStep";
import PaymentStep from "./paymentStep";
import ReviewStep from "./reviewStep";
import OrderSummary from "./orderSummary";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "./common/errorBoundary";
import LoadingOverlay from "./common/loadingOverlay";
import CheckoutProgress from "./utility/checkoutProgress";
CheckoutProgress;

const CHECKOUT_STEPS = {
  ADDRESS: 1,
  PAYMENT: 2,
  REVIEW: 3,
};

export default function Checkout() {
  const navigate = useNavigate();

  // State management
  const [currentStep, setCurrentStep] = useState(CHECKOUT_STEPS.ADDRESS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [useSameAddress, setUseSameAddress] = useState(true);

  // Payment state
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);

  // Order preview state
  const [orderPreview, setOrderPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Generate idempotency key once
  const [idempotencyKey] = useState(() =>
    checkoutService.generateIdempotencyKey()
  );

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [addressesRes, paymentMethodsRes] = await Promise.all([
        checkoutService.getAddresses(),
        checkoutService.getPaymentMethods(),
      ]);

      if (addressesRes.success) {
        setAddresses(addressesRes.data);

        // Auto-select default address
        const defaultAddr = addressesRes.data.find((addr) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr);
        }
      }

      if (paymentMethodsRes.success) {
        setPaymentMethods(paymentMethodsRes.data);

        // Auto-select default payment method
        const defaultPM = paymentMethodsRes.data.find((pm) => pm.isDefault);
        if (defaultPM) {
          setSelectedPaymentMethod(defaultPM);
        }
      }

      // Load cart items from localStorage or API
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(savedCart);
    } catch (err) {
      setError("Failed to load checkout data. Please try again.");
      console.error("Load initial data error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update preview when dependencies change
  useEffect(() => {
    if (selectedAddress) {
      updateOrderPreview();
    }
  }, [selectedAddress, appliedCoupon, selectedPaymentMethod]);

  const updateOrderPreview = useCallback(async () => {
    if (!selectedAddress) return;

    setPreviewLoading(true);
    try {
      const previewData = {
        shippingAddressId: selectedAddress._id,
        paymentMethodId: selectedPaymentMethod?._id,
        couponCode: appliedCoupon?.code,
      };

      const result = await checkoutService.getCheckoutPreview(previewData);

      if (result.success) {
        setOrderPreview(result.preview);
        checkoutService.cachePreview(result.preview);
      }
    } catch (err) {
      console.error("Preview error:", err);
      setError("Failed to calculate order total");
    } finally {
      setPreviewLoading(false);
    }
  }, [selectedAddress, appliedCoupon, selectedPaymentMethod]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const result = await validateCoupon(
        couponCode.trim().toUpperCase(),
        orderPreview?.subtotal || 0,
        cartItems
      );

      if (result.success) {
        setAppliedCoupon(result.coupon);
        setCouponCode("");
        setCouponError("");
      } else {
        setCouponError(result.message || "Invalid coupon code");
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError(err.message || "Failed to apply coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setError(null);
  };

  const handleAddressChange = () => {
    setCurrentStep(CHECKOUT_STEPS.ADDRESS);
  };

  const handlePaymentSelect = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setError(null);
  };

  const handleStepComplete = (step) => {
    setError(null);

    switch (step) {
      case CHECKOUT_STEPS.ADDRESS:
        if (!selectedAddress) {
          setError("Please select a shipping address");
          return;
        }
        setCurrentStep(CHECKOUT_STEPS.PAYMENT);
        break;

      case CHECKOUT_STEPS.PAYMENT:
        if (!selectedPaymentMethod) {
          setError("Please select a payment method");
          return;
        }
        setCurrentStep(CHECKOUT_STEPS.REVIEW);
        break;

      case CHECKOUT_STEPS.REVIEW:
        handlePlaceOrder();
        break;

      default:
        break;
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const checkoutData = {
        shippingAddressId: selectedAddress._id,
        billingAddressId: useSameAddress
          ? selectedAddress._id
          : billingAddress?._id,
        paymentMethodId: selectedPaymentMethod._id,
        paymentProvider: selectedPaymentMethod.provider,
        couponCode: appliedCoupon?.code,
        idempotencyKey,
        notes: "",
      };

      const result = await checkoutService.createCheckout(checkoutData);

      if (result.success) {
        // Clear cart
        localStorage.removeItem("cart");
        checkoutService.clearCache();

        // Navigate to success page
        navigate(`/order-confirmation/${result.order.id}`, {
          state: { order: result.order, payment: result.payment },
        });
      } else {
        setError(result.message || "Failed to place order");
      }
    } catch (err) {
      setError(err.message || "An error occurred while placing your order");
      console.error("Place order error:", err);
    } finally {
      setLoading(false);
    }
  };

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case CHECKOUT_STEPS.ADDRESS:
        return selectedAddress !== null;
      case CHECKOUT_STEPS.PAYMENT:
        return selectedPaymentMethod !== null;
      case CHECKOUT_STEPS.REVIEW:
        return true;
      default:
        return false;
    }
  };

  return (
    <ErrorBoundary>
      <div className="checkout-container">
        {loading && <LoadingOverlay message="Processing..." />}

        <div className="checkout-content">
          <div className="checkout-main">
            <h1 className="checkout-title">Checkout</h1>

            <CheckoutProgress currentStep={currentStep} />

            {error && (
              <div className="checkout-error" role="alert">
                <i className="fa fa-exclamation-circle"></i>
                <span>{error}</span>
                <button
                  className="error-close"
                  onClick={() => setError(null)}
                  aria-label="Dismiss error"
                >
                  ×
                </button>
              </div>
            )}

            <div className="checkout-steps">
              {currentStep === CHECKOUT_STEPS.ADDRESS && (
                <AddressStep
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  onAddressSelect={handleAddressSelect}
                  onAddAddress={(newAddress) => {
                    setAddresses([...addresses, newAddress]);
                    setSelectedAddress(newAddress);
                  }}
                  onUpdateAddress={(updatedAddress) => {
                    setAddresses(
                      addresses.map((addr) =>
                        addr._id === updatedAddress._id ? updatedAddress : addr
                      )
                    );
                    if (selectedAddress?._id === updatedAddress._id) {
                      setSelectedAddress(updatedAddress);
                    }
                  }}
                  onDeleteAddress={(addressId) => {
                    setAddresses(
                      addresses.filter((addr) => addr._id !== addressId)
                    );
                    if (selectedAddress?._id === addressId) {
                      setSelectedAddress(null);
                    }
                  }}
                />
              )}

              {currentStep === CHECKOUT_STEPS.PAYMENT && (
                <PaymentStep
                  paymentMethods={paymentMethods}
                  selectedPaymentMethod={selectedPaymentMethod}
                  onPaymentSelect={handlePaymentSelect}
                  onAddPaymentMethod={(newMethod) => {
                    setPaymentMethods([...paymentMethods, newMethod]);
                    setSelectedPaymentMethod(newMethod);
                  }}
                  onUpdatePaymentMethod={(updatedMethod) => {
                    setPaymentMethods(
                      paymentMethods.map((pm) =>
                        pm._id === updatedMethod._id ? updatedMethod : pm
                      )
                    );
                    if (selectedPaymentMethod?._id === updatedMethod._id) {
                      setSelectedPaymentMethod(updatedMethod);
                    }
                  }}
                  onDeletePaymentMethod={(methodId) => {
                    setPaymentMethods(
                      paymentMethods.filter((pm) => pm._id !== methodId)
                    );
                    if (selectedPaymentMethod?._id === methodId) {
                      setSelectedPaymentMethod(null);
                    }
                  }}
                />
              )}

              {currentStep === CHECKOUT_STEPS.REVIEW && (
                <ReviewStep
                  selectedAddress={selectedAddress}
                  selectedPaymentMethod={selectedPaymentMethod}
                  orderPreview={orderPreview}
                  appliedCoupon={appliedCoupon}
                  onAddressChange={handleAddressChange}
                  onPaymentChange={() => setCurrentStep(CHECKOUT_STEPS.PAYMENT)}
                />
              )}
            </div>

            <div className="checkout-actions">
              {currentStep > CHECKOUT_STEPS.ADDRESS && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={loading}
                >
                  <i className="fa fa-arrow-left"></i> Back
                </button>
              )}

              <button
                className="btn btn-primary"
                onClick={() => handleStepComplete(currentStep)}
                disabled={!canProceedToNextStep() || loading || previewLoading}
              >
                {currentStep === CHECKOUT_STEPS.REVIEW ? (
                  <>
                    <i className="fa fa-check"></i> Place Order
                  </>
                ) : (
                  <>
                    Continue <i className="fa fa-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="checkout-sidebar">
            <OrderSummary
              orderPreview={orderPreview}
              loading={previewLoading}
              couponCode={couponCode}
              appliedCoupon={appliedCoupon}
              couponError={couponError}
              couponLoading={couponLoading}
              onCouponChange={setCouponCode}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
