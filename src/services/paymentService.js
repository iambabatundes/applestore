// services/paymentService.js

import {
  adminHttpService,
  userHttpService,
  publicHttpService,
} from "./http/index.js";

const basePath = "/api/payments";

// Create payment (requires user auth)
export const createPayment = async (paymentData) => {
  try {
    const response = await userHttpService.post(basePath, paymentData);
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Get user's transactions
export const getUserTransactions = async (filters = {}) => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await userHttpService.get(`${basePath}?${queryParams}`);
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Get single transaction status (user)
export const getPaymentStatus = async (transactionId) => {
  try {
    const response = await userHttpService.get(`${basePath}/${transactionId}`);
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Retry payment (user)
export const retryPayment = async (transactionId, options = {}) => {
  try {
    const response = await userHttpService.post(
      `${basePath}/${transactionId}/retry`,
      options
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Cancel payment (user)
export const cancelPayment = async (transactionId, reason) => {
  try {
    const response = await userHttpService.post(
      `${basePath}/${transactionId}/cancel`,
      { reason }
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Get user payment stats
export const getUserPaymentStats = async (params = {}) => {
  try {
    const queryParams = buildQueryParams(params);
    const response = await userHttpService.get(
      `${basePath}/stats/user?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Get user revenue analytics
export const getUserRevenueAnalytics = async (period = "monthly") => {
  try {
    const response = await userHttpService.get(
      `${basePath}/analytics/revenue?period=${period}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Create customer in payment gateway
export const createCustomer = async (customerData) => {
  try {
    const response = await userHttpService.post(
      `${basePath}/customers`,
      customerData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Get available providers (public)
export const getAvailableProviders = async () => {
  try {
    const response = await publicHttpService.get(`${basePath}/providers`);
    const data = response.data;

    let providers = [];
    if (data?.data?.providers) {
      providers = data.data.providers;
    } else if (data?.providers) {
      providers = data.providers;
    } else if (Array.isArray(data)) {
      providers = data;
    }

    return providers.map((p) => (typeof p === "string" ? p : p.name));
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============ SUBSCRIPTION OPERATIONS (USER) ============

export const createSubscription = async (subscriptionData) => {
  try {
    const response = await userHttpService.post(
      `${basePath}/subscriptions`,
      subscriptionData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getUserSubscriptions = async () => {
  try {
    const response = await userHttpService.get(`${basePath}/subscriptions`);
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getSubscriptionDetails = async (subscriptionId) => {
  try {
    const response = await userHttpService.get(
      `${basePath}/subscriptions/${subscriptionId}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await userHttpService.post(
      `${basePath}/subscriptions/${subscriptionId}/cancel`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const pauseSubscription = async (subscriptionId) => {
  try {
    const response = await userHttpService.post(
      `${basePath}/subscriptions/${subscriptionId}/pause`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const resumeSubscription = async (subscriptionId) => {
  try {
    const response = await userHttpService.post(
      `${basePath}/subscriptions/${subscriptionId}/resume`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const changeSubscriptionPlan = async (subscriptionId, planData) => {
  try {
    const response = await userHttpService.put(
      `${basePath}/subscriptions/${subscriptionId}/plan`,
      planData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const updatePaymentMethod = async (
  subscriptionId,
  paymentMethodData
) => {
  try {
    const response = await userHttpService.put(
      `${basePath}/subscriptions/${subscriptionId}/payment-method`,
      paymentMethodData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const recordUsage = async (subscriptionId, usageData) => {
  try {
    const response = await userHttpService.post(
      `${basePath}/subscriptions/${subscriptionId}/usage`,
      usageData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getUsageStats = async (subscriptionId) => {
  try {
    const response = await userHttpService.get(
      `${basePath}/subscriptions/${subscriptionId}/usage`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const applyCoupon = async (subscriptionId, couponCode) => {
  try {
    const response = await userHttpService.post(
      `${basePath}/subscriptions/${subscriptionId}/coupon`,
      { couponCode }
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============ PUBLIC ENDPOINTS ============

export const getSubscriptionPlans = async () => {
  try {
    const response = await publicHttpService.get(
      `${basePath}/subscriptions/plans`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getPlanDetails = async (planId) => {
  try {
    const response = await publicHttpService.get(
      `${basePath}/subscriptions/plans/${planId}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============ ADMIN OPERATIONS ============

// Admin: Get all transactions
export const adminGetTransactions = async (filters = {}) => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await adminHttpService.get(
      `${basePath}/admin/payments?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Admin: Get transaction details
export const adminGetTransaction = async (transactionId) => {
  try {
    const response = await adminHttpService.get(
      `${basePath}/admin/${transactionId}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Admin: Capture payment (super_admin only)
export const adminCapturePayment = async (transactionId, amount) => {
  try {
    const response = await adminHttpService.post(
      `${basePath}/admin/${transactionId}/capture`,
      { amount }
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Admin: Refund payment
export const adminRefundPayment = async (transactionId, refundData) => {
  try {
    const response = await adminHttpService.post(
      `${basePath}/admin/${transactionId}/refund`,
      refundData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Admin: Cancel payment
export const adminCancelPayment = async (transactionId, reason) => {
  try {
    const response = await adminHttpService.post(
      `${basePath}/admin/${transactionId}/cancel`,
      { reason }
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============ ADMIN CONFIG ============

export const getPaymentConfig = async () => {
  try {
    const response = await adminHttpService.get(`${basePath}/payment-config`);
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getProviderConfig = async (provider) => {
  try {
    const response = await adminHttpService.get(
      `${basePath}/payment-config/${provider}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const updatePaymentConfig = async (provider, config) => {
  try {
    const response = await adminHttpService.put(
      `${basePath}/payment-config/${provider}`,
      config
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const testProviderConnection = async (provider) => {
  try {
    const response = await adminHttpService.post(
      `${basePath}/payment-config/${provider}/test`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const toggleProvider = async (provider) => {
  try {
    const response = await adminHttpService.patch(
      `${basePath}/payment-config/${provider}/toggle`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getProviderStatus = () => {};

// ============ ADMIN ANALYTICS ============

export const getPaymentStats = async (params = {}) => {
  try {
    const queryParams = buildQueryParams(params);
    const response = await adminHttpService.get(
      `${basePath}/payment-analytics/stats?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getRevenueAnalytics = async (period = "monthly") => {
  try {
    const response = await adminHttpService.get(
      `${basePath}/payment-analytics/revenue?period=${period}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getSuccessRateAnalytics = async (params = {}) => {
  try {
    const queryParams = buildQueryParams(params);
    const response = await adminHttpService.get(
      `${basePath}/payment-analytics/success-rate?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getTopCustomers = async (limit = 10) => {
  try {
    const response = await adminHttpService.get(
      `${basePath}/payment-analytics/top-customers?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getProviderTrends = async () => {
  try {
    const response = await adminHttpService.get(
      `${basePath}/payment-analytics/provider-trends`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============ ADMIN SUBSCRIPTIONS ============

export const adminGetSubscriptions = async (filters = {}) => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await adminHttpService.get(
      `${basePath}/admin/subscriptions?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const adminGetSubscription = async (subscriptionId) => {
  try {
    const response = await adminHttpService.get(
      `${basePath}/admin/subscriptions/${subscriptionId}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const adminForceCancelSubscription = async (subscriptionId) => {
  try {
    const response = await adminHttpService.post(
      `${basePath}/admin/subscriptions/${subscriptionId}/force-cancel`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============ ADMIN SUBSCRIPTION PLANS ============

export const createPlan = async (planData) => {
  try {
    const response = await adminHttpService.post(
      `${basePath}/admin/plans`,
      planData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const updatePlan = async (planId, planData) => {
  try {
    const response = await adminHttpService.put(
      `${basePath}/admin/plans/${planId}`,
      planData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const deletePlan = async (planId) => {
  try {
    const response = await adminHttpService.delete(
      `${basePath}/admin/plans/${planId}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const togglePlanStatus = async (planId) => {
  try {
    const response = await adminHttpService.patch(
      `${basePath}/admin/plans/${planId}/toggle`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getPlanStatistics = async (planId) => {
  try {
    const response = await adminHttpService.get(
      `${basePath}/admin/plans/${planId}/statistics`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============ ADMIN SUBSCRIPTION ANALYTICS ============

export const getSubscriptionAnalytics = async () => {
  try {
    const response = await adminHttpService.get(
      `${basePath}/admin/subscriptions/analytics/overview`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getSubscriptionRevenue = async () => {
  try {
    const response = await adminHttpService.get(
      `${basePath}/admin/subscriptions/analytics/revenue`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getChurnRate = async () => {
  try {
    const response = await adminHttpService.get(
      `${basePath}/admin/subscriptions/analytics/churn`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getMRRAnalytics = async () => {
  try {
    const response = await adminHttpService.get(
      `${basePath}/admin/subscriptions/analytics/mrr`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============ EXPORTS ============

export const exportTransactionsCSV = async (filters = {}) => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await adminHttpService.get(
      `${basePath}/export/csv?${queryParams}`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const exportSubscriptionsCSV = async (filters = {}) => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await adminHttpService.get(
      `${basePath}/admin/subscriptions/export/csv?${queryParams}`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============ WEBHOOKS ============

export const getWebhookLogs = async (filters = {}) => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await adminHttpService.get(
      `${basePath}/webhooks/logs?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const retryWebhook = async (webhookId) => {
  try {
    const response = await adminHttpService.post(
      `${basePath}/webhooks/${webhookId}/retry`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============ FRAUD ============

export const getFraudSettings = async () => {
  try {
    const response = await adminHttpService.get(`${basePath}/fraud/settings`);
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// export const getDisputes = async () => {
//   try {
//     const response = await adminHttpService.get(`${basePath}/disputes`);
//     return response.data;
//   } catch (error) {
//     throw handlePaymentError(error);
//   }
// };

export const getFlaggedTransactions = async (filters = {}) => {
  try {
    const queryParams = buildQueryParams(filters);
    const response = await adminHttpService.get(
      `${basePath}/fraud/flagged?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============ REPORTS ============

export const generateReport = async (reportConfig) => {
  try {
    const response = await adminHttpService.post(
      `${basePath}/reports/generate`,
      reportConfig
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getReport = async (reportId) => {
  try {
    const response = await adminHttpService.get(
      `${basePath}/reports/${reportId}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============ UTILITIES ============

const buildQueryParams = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });
  return params.toString();
};

const handlePaymentError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const message = data.message || data.error || "Payment operation failed";
    const customError = new Error(message);
    customError.status = status;
    customError.code = data.code;
    customError.data = data;
    return customError;
  } else if (error.request) {
    return new Error("No response from server. Check your connection.");
  }
  return new Error(error.message || "An unexpected error occurred");
};

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const validatePaymentData = (data) => {
  const errors = {};
  if (!data.amount || data.amount <= 0) errors.amount = "Invalid amount";
  if (!data.currency) errors.currency = "Currency required";
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Valid email required";
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};
