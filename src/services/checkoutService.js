// services/checkoutService.js
import {
  adminHttpService,
  userHttpService,
  publicHttpService,
} from "./http/index.js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const ENDPOINTS = {
  CHECKOUT: "/checkout",
  CHECKOUT_PREVIEW: "/checkout/preview",
  ADDRESSES: "/addresses",
  COUPONS: "/coupons/validate",
  PAYMENT_METHODS: "/payment-methods",
  ORDERS: "/orders",
};

class CheckoutService {
  constructor() {
    this.httpService = userHttpService;
    this.retryAttempts = 3;
    this.retryDelay = 1000;
    this.stripe = null;
    this.stripePromise = null;
  }

  async createCheckout(checkoutData) {
    try {
      // Validate required fields
      this.validateCheckoutData(checkoutData);

      // Generate idempotency key if not provided
      if (!checkoutData.idempotencyKey) {
        checkoutData.idempotencyKey = this.generateIdempotencyKey();
      }

      const response = await this.httpService.post(
        ENDPOINTS.CHECKOUT,
        checkoutData
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Checkout failed");
      }

      return {
        success: true,
        order: response.data.order,
        payment: response.data.payment,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Checkout error:", error);
      throw this.handleError(error);
    }
  }

  async getCheckoutPreview(previewData) {
    try {
      if (!previewData.shippingAddressId) {
        throw new Error("Shipping address ID is required");
      }

      const response = await this.httpService.post(
        ENDPOINTS.CHECKOUT_PREVIEW,
        previewData
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Preview failed");
      }

      return {
        success: true,
        preview: response.data.preview,
      };
    } catch (error) {
      console.error("Preview error:", error);
      throw this.handleError(error);
    }
  }

  async validateCoupon(couponCode) {
    try {
      if (!couponCode || typeof couponCode !== "string") {
        throw new Error("Invalid coupon code");
      }

      const response = await this.httpService.post(ENDPOINTS.COUPONS, {
        code: couponCode.trim().toUpperCase(),
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Invalid coupon code");
      }

      return {
        success: true,
        coupon: response.data.coupon,
      };
    } catch (error) {
      console.error("Coupon validation error:", error);
      throw this.handleError(error);
    }
  }

  async getAddresses() {
    try {
      const response = await this.httpService.get(ENDPOINTS.ADDRESSES);

      return {
        success: true,
        data: response.data?.addresses || [],
      };
    } catch (error) {
      console.error("Get addresses error:", error);
      throw this.handleError(error);
    }
  }

  async createAddress(addressData) {
    try {
      this.validateAddressData(addressData);

      const response = await this.httpService.post(
        ENDPOINTS.ADDRESSES,
        addressData
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to create address");
      }

      return {
        success: true,
        data: response.data.address,
      };
    } catch (error) {
      console.error("Create address error:", error);
      throw this.handleError(error);
    }
  }

  async updateAddress(addressId, addressData) {
    try {
      if (!addressId) {
        throw new Error("Address ID is required");
      }

      this.validateAddressData(addressData);

      const response = await this.httpService.put(
        `${ENDPOINTS.ADDRESSES}/${addressId}`,
        addressData
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || "Failed to update address");
      }

      return {
        success: true,
        data: response.data.address,
      };
    } catch (error) {
      console.error("Update address error:", error);
      throw this.handleError(error);
    }
  }

  async deleteAddress(addressId) {
    try {
      if (!addressId) {
        throw new Error("Address ID is required");
      }

      const response = await this.httpService.delete(
        `${ENDPOINTS.ADDRESSES}/${addressId}`
      );

      return {
        success: true,
        message: response.data?.message || "Address deleted successfully",
      };
    } catch (error) {
      console.error("Delete address error:", error);
      throw this.handleError(error);
    }
  }

  async setDefaultAddress(addressId, type = "shipping") {
    try {
      if (!addressId) {
        throw new Error("Address ID is required");
      }

      const response = await this.httpService.post(
        `${ENDPOINTS.ADDRESSES}/${addressId}/set-default`,
        { type }
      );

      return {
        success: true,
        message: response.data?.message || "Default address updated",
      };
    } catch (error) {
      console.error("Set default address error:", error);
      throw this.handleError(error);
    }
  }

  async getPaymentMethods() {
    try {
      const response = await this.httpService.get(ENDPOINTS.PAYMENT_METHODS);

      return {
        success: true,
        data: response.data?.paymentMethods || [],
      };
    } catch (error) {
      console.error("Get payment methods error:", error);
      throw this.handleError(error);
    }
  }

  async addPaymentMethod(paymentData) {
    try {
      const response = await this.httpService.post(
        ENDPOINTS.PAYMENT_METHODS,
        paymentData
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to add payment method"
        );
      }

      return {
        success: true,
        data: response.data.paymentMethod,
      };
    } catch (error) {
      console.error("Add payment method error:", error);
      throw this.handleError(error);
    }
  }

  async deletePaymentMethod(methodId) {
    try {
      const response = await this.httpService.delete(
        `ENDPOINTS.PAYMENT_METHODS/${methodId}`,
        paymentData
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to Delete payment method"
        );
      }

      return {
        success: true,
        data: response.data.paymentMethod,
      };
    } catch (error) {
      console.error("Delete payment method error:", error);
      throw this.handleError(error);
    }
  }

  async setDefaultPaymentMethod(methodId) {
    try {
      const response = await this.httpService.delete(
        `ENDPOINTS.PAYMENT_METHODS/${methodId}/default`,
        paymentData
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to set default payment method"
        );
      }

      return {
        success: true,
        data: response.data.paymentMethod,
      };
    } catch (error) {
      console.error("default payment method error:", error);
      throw this.handleError(error);
    }
  }

  async initializeStripeElements(options = {}) {
    try {
      if (!this.stripePromise) {
        this.stripePromise = loadStripe(
          process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
        );
      }

      this.stripe = await this.stripePromise;

      if (!this.stripe) {
        throw new Error("Failed to initialize Stripe");
      }

      const elements = this.stripe.elements({
        ...options,
        fonts: [
          {
            cssSrc:
              "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
          },
        ],
      });

      const cardElement = elements.create("card", {
        style: {
          base: {
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#1a1a1a",
            "::placeholder": {
              color: "#a0a0a0",
            },
          },
        },
        hidePostalCode: true,
      });

      return { elements, cardElement };
    } catch (error) {
      console.error("Stripe initialization error:", error);
      throw error;
    }
  }

  async tokenizeWithStripe(paymentMethodData) {
    try {
      if (!this.stripe) {
        await this.initializeStripeElements();
      }

      const { error, paymentMethod } = await this.stripe.createPaymentMethod(
        paymentMethodData
      );

      if (error) {
        throw new Error(error.message);
      }

      return paymentMethod;
    } catch (error) {
      console.error("Stripe tokenization error:", error);
      throw error;
    }
  }

  async tokenizeWithPaystack(paymentData) {
    try {
      // Paystack tokenization implementation
      const response = await fetch("/api/payments/paystack/tokenize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error("Paystack tokenization failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Paystack tokenization error:", error);
      throw error;
    }
  }

  async processPaymentWith3DS(paymentIntentId) {
    try {
      if (!this.stripe) {
        await this.initializeStripeElements();
      }

      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        paymentIntentId
      );

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      console.error("3DS authentication error:", error);
      throw error;
    }
  }

  // Generate idempotency key for duplicate payment prevention
  generateIdempotencyKey() {
    return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getOrder(orderId) {
    try {
      if (!orderId) {
        throw new Error("Order ID is required");
      }

      const response = await this.httpService.get(
        `${ENDPOINTS.ORDERS}/${orderId}`
      );

      return {
        success: true,
        data: response.data?.order,
      };
    } catch (error) {
      console.error("Get order error:", error);
      throw this.handleError(error);
    }
  }

  async getOrders(params = {}) {
    try {
      const response = await this.httpService.get(ENDPOINTS.ORDERS, {
        params,
      });

      return {
        success: true,
        data: response.data?.orders || [],
        pagination: response.data?.pagination,
      };
    } catch (error) {
      console.error("Get orders error:", error);
      throw this.handleError(error);
    }
  }

  validateCheckoutData(data) {
    const required = ["shippingAddressId", "paymentMethodId", "idempotencyKey"];

    for (const field of required) {
      if (!data[field]) {
        throw new Error(`${field} is required`);
      }
    }

    // Validate idempotency key format (UUID)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(data.idempotencyKey)) {
      throw new Error("Invalid idempotency key format");
    }
  }

  validateAddressData(data) {
    const required = [
      "fullName",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
    ];

    for (const field of required) {
      if (!data[field] || typeof data[field] !== "string") {
        throw new Error(`${field} is required and must be a string`);
      }
    }

    // Validate phone number if provided
    if (data.phoneNumber && !/^\+?[\d\s\-()]+$/.test(data.phoneNumber)) {
      throw new Error("Invalid phone number format");
    }

    // Validate ZIP code
    if (data.zipCode && !/^[\d\-\s]+$/.test(data.zipCode)) {
      throw new Error("Invalid ZIP code format");
    }
  }

  generateIdempotencyKey() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          return new Error(data?.message || "Invalid request data");
        case 401:
          return new Error("Please log in to continue");
        case 403:
          return new Error("You don't have permission to perform this action");
        case 404:
          return new Error(data?.message || "Resource not found");
        case 409:
          return new Error(data?.message || "Conflict - please try again");
        case 422:
          return new Error(data?.message || "Validation failed");
        case 429:
          return new Error("Too many requests - please wait and try again");
        case 500:
          return new Error(
            "Server error - please try again later or contact support"
          );
        case 503:
          return new Error("Service temporarily unavailable");
        default:
          return new Error(data?.message || "An unexpected error occurred");
      }
    } else if (error.request) {
      // Request made but no response
      return new Error(
        "Network error - please check your connection and try again"
      );
    } else {
      // Other errors
      return error;
    }
  }

  async retryRequest(requestFn, attempts = this.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === attempts - 1) throw error;

        // Wait before retry with exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, this.retryDelay * Math.pow(2, i))
        );
      }
    }
  }

  clearCache() {
    // Clear any cached checkout data
    try {
      sessionStorage.removeItem("checkout_preview");
      sessionStorage.removeItem("selected_address");
      sessionStorage.removeItem("selected_payment");
    } catch (error) {
      console.error("Clear cache error:", error);
    }
  }

  getCachedPreview() {
    try {
      const cached = sessionStorage.getItem("checkout_preview");
      if (cached) {
        const data = JSON.parse(cached);
        // Check if cache is still valid (5 minutes)
        if (Date.now() - data.timestamp < 5 * 60 * 1000) {
          return data.preview;
        }
      }
    } catch (error) {
      console.error("Get cached preview error:", error);
    }
    return null;
  }

  cachePreview(preview) {
    try {
      sessionStorage.setItem(
        "checkout_preview",
        JSON.stringify({
          preview,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Cache preview error:", error);
    }
  }
}

const checkoutService = new CheckoutService();

export default checkoutService;

export const {
  createCheckout,
  getCheckoutPreview,
  validateCoupon,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getPaymentMethods,
  addPaymentMethod,
  getOrder,
  getOrders,
  clearCache,
  getCachedPreview,
} = checkoutService;
