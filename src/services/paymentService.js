import {
  adminHttpService,
  userHttpService,
  publicHttpService,
} from "./http/index.js";

const paymentsPath = "/api/payments";
const configPath = "/api/payment-config";
const webhooksPath = "/api/webhooks";
const analyticsPath = "/api/payment-analytics";

export const createPayment = async (paymentData) => {
  try {
    const response = await publicHttpService.post(paymentsPath, paymentData);
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getTransactions = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.status && { status: filters.status }),
      ...(filters.provider && { provider: filters.provider }),
      ...(filters.search && { search: filters.search }),
      ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters.dateTo && { dateTo: filters.dateTo }),
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.minAmount && { minAmount: filters.minAmount }),
      ...(filters.maxAmount && { maxAmount: filters.maxAmount }),
      ...(filters.currency && { currency: filters.currency }),
    });

    const response = await adminHttpService.get(
      `${paymentsPath}?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getTransaction = async (transactionId) => {
  try {
    const response = await adminHttpService.get(
      `${paymentsPath}/${transactionId}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const capturePayment = async (transactionId) => {
  try {
    const response = await adminHttpService.post(
      `${paymentsPath}/${transactionId}/capture`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const refundPayment = async (transactionId, refundData) => {
  try {
    const response = await adminHttpService.post(
      `${paymentsPath}/${transactionId}/refund`,
      refundData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const cancelPayment = async (transactionId, reason) => {
  try {
    const response = await adminHttpService.post(
      `${paymentsPath}/${transactionId}/cancel`,
      { reason }
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const retryPayment = async (transactionId) => {
  try {
    const response = await userHttpService.post(
      `${paymentsPath}/${transactionId}/retry`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getPaymentConfig = async () => {
  try {
    const response = await adminHttpService.get(configPath);
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

//  Get configuration for a specific provider

export const getProviderConfig = async (provider) => {
  try {
    const response = await adminHttpService.get(`${configPath}/${provider}`);
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Update payment gateway configuration

export const updatePaymentConfig = async (provider, config) => {
  try {
    const response = await adminHttpService.put(
      `${configPath}/${provider}`,
      config
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Test payment gateway connection

export const testProviderConnection = async (provider) => {
  try {
    const response = await adminHttpService.post(
      `${configPath}/${provider}/test`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Enable/disable a payment provider

export const toggleProvider = async (provider, enabled) => {
  try {
    const response = await adminHttpService.patch(
      `${configPath}/${provider}/toggle`,
      { enabled }
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

//  Get available payment providers
export const getAvailableProviders = async () => {
  try {
    const response = await userHttpService.get(`${paymentsPath}/providers`);
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Create a customer in payment gateway

export const createCustomer = async (customerData) => {
  try {
    const response = await adminHttpService.post(
      `${paymentsPath}/customers`,
      customerData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Get customer payment methods
export const getCustomerPaymentMethods = async (customerId) => {
  try {
    const response = await adminHttpService.get(
      `${paymentsPath}/customers/${customerId}/payment-methods`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

//  Save payment method for future use
export const savePaymentMethod = async (customerId, paymentMethodData) => {
  try {
    const response = await adminHttpService.post(
      `${paymentsPath}/customers/${customerId}/payment-methods`,
      paymentMethodData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Delete a saved payment method
export const deletePaymentMethod = async (customerId, paymentMethodId) => {
  try {
    const response = await adminHttpService.delete(
      `${paymentsPath}/customers/${customerId}/payment-methods/${paymentMethodId}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

//  Get payment dashboard statistics
export const getPaymentStats = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...(params.dateFrom && { dateFrom: params.dateFrom }),
      ...(params.dateTo && { dateTo: params.dateTo }),
      ...(params.provider && { provider: params.provider }),
    });

    const response = await adminHttpService.get(
      `${analyticsPath}/stats?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getRevenueAnalytics = async (period = "monthly") => {
  try {
    const response = await adminHttpService.get(
      `${analyticsPath}/revenue?period=${period}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

export const getSuccessRateAnalytics = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await adminHttpService.get(
      `${analyticsPath}/success-rate?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Get top customers by transaction volume

export const getTopCustomers = async (limit = 10) => {
  try {
    const response = await adminHttpService.get(
      `${analyticsPath}/top-customers?limit=${limit}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Get payment trends by provider

export const getProviderTrends = async () => {
  try {
    const response = await adminHttpService.get(
      `${analyticsPath}/provider-trends`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Export transactions to CSV
export const exportTransactionsCSV = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await adminHttpService.get(
      `${paymentsPath}/export/csv?${queryParams}`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

//  Export transactions to Excel
export const exportTransactionsExcel = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await adminHttpService.get(
      `${paymentsPath}/export/excel?${queryParams}`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// Generate payment report
export const generatePaymentReport = async (reportConfig) => {
  try {
    const response = await adminHttpService.post(
      `${analyticsPath}/reports`,
      reportConfig
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Get webhook logs
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} Webhook logs
 */
export const getWebhookLogs = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await adminHttpService.get(
      `${webhooksPath}/logs?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Retry a failed webhook
 * @param {string} webhookId - Webhook log ID
 * @returns {Promise<Object>} Retry response
 */
export const retryWebhook = async (webhookId) => {
  try {
    const response = await adminHttpService.post(
      `${webhooksPath}/${webhookId}/retry`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============================================
// SUBSCRIPTIONS & RECURRING PAYMENTS
// ============================================

/**
 * Create a subscription
 * @param {Object} subscriptionData - Subscription details
 * @returns {Promise<Object>} Subscription response
 */
export const createSubscription = async (subscriptionData) => {
  try {
    const response = await adminHttpService.post(
      `${paymentsPath}/subscriptions`,
      subscriptionData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Get all subscriptions
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} Subscriptions
 */
export const getSubscriptions = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await adminHttpService.get(
      `${paymentsPath}/subscriptions?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Cancel a subscription
 * @param {string} subscriptionId - Subscription ID
 * @param {Object} cancellationData - Cancellation details
 * @returns {Promise<Object>} Cancellation response
 */
export const cancelSubscription = async (subscriptionId, cancellationData) => {
  try {
    const response = await adminHttpService.post(
      `${paymentsPath}/subscriptions/${subscriptionId}/cancel`,
      cancellationData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============================================
// DISPUTE MANAGEMENT
// ============================================

/**
 * Get all disputes/chargebacks
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} Disputes
 */
export const getDisputes = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await adminHttpService.get(
      `${paymentsPath}/disputes?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Respond to a dispute
 * @param {string} disputeId - Dispute ID
 * @param {Object} responseData - Dispute response data
 * @returns {Promise<Object>} Response result
 */
export const respondToDispute = async (disputeId, responseData) => {
  try {
    const response = await adminHttpService.post(
      `${paymentsPath}/disputes/${disputeId}/respond`,
      responseData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============================================
// FRAUD DETECTION
// ============================================

/**
 * Get fraud detection settings
 * @returns {Promise<Object>} Fraud settings
 */
export const getFraudSettings = async () => {
  try {
    const response = await adminHttpService.get(
      `${paymentsPath}/fraud/settings`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Update fraud detection rules
 * @param {Object} rules - Fraud rules
 * @returns {Promise<Object>} Update response
 */
export const updateFraudRules = async (rules) => {
  try {
    const response = await adminHttpService.put(
      `${paymentsPath}/fraud/rules`,
      rules
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Get flagged transactions
 * @param {Object} filters - Filter parameters
 * @returns {Promise<Object>} Flagged transactions
 */
export const getFlaggedTransactions = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters);
    const response = await adminHttpService.get(
      `${paymentsPath}/fraud/flagged?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

/**
 * Review a flagged transaction
 * @param {string} transactionId - Transaction ID
 * @param {Object} reviewData - Review decision
 * @returns {Promise<Object>} Review response
 */
export const reviewFlaggedTransaction = async (transactionId, reviewData) => {
  try {
    const response = await adminHttpService.post(
      `${paymentsPath}/fraud/${transactionId}/review`,
      reviewData
    );
    return response.data;
  } catch (error) {
    throw handlePaymentError(error);
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Download file from blob
 * @param {Blob} blob - File blob
 * @param {string} filename - File name
 */
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

// Handle payment service errors
const handlePaymentError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;
    const message = data.message || data.error || "Payment operation failed";

    const customError = new Error(message);
    customError.status = status;
    customError.data = data;

    return customError;
  } else if (error.request) {
    // Request made but no response
    return new Error(
      "No response from payment server. Please check your connection."
    );
  } else {
    // Other errors
    return new Error(error.message || "An unexpected error occurred");
  }
};

// Format currency amount
export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

// Validate payment data before submission

export const validatePaymentData = (paymentData) => {
  const errors = {};

  if (!paymentData.provider) {
    errors.provider = "Payment provider is required";
  }

  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.amount = "Amount must be greater than 0";
  }

  if (!paymentData.currency) {
    errors.currency = "Currency is required";
  }

  if (
    !paymentData.email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)
  ) {
    errors.email = "Valid email is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Export all functions as default object
export default {
  // Transactions
  createPayment,
  getTransactions,
  getTransaction,
  capturePayment,
  refundPayment,
  cancelPayment,
  retryPayment,

  // Configuration
  getPaymentConfig,
  getProviderConfig,
  updatePaymentConfig,
  testProviderConnection,
  toggleProvider,
  getAvailableProviders,

  // Customers
  createCustomer,
  getCustomerPaymentMethods,
  savePaymentMethod,
  deletePaymentMethod,

  // Analytics
  getPaymentStats,
  getRevenueAnalytics,
  getSuccessRateAnalytics,
  getTopCustomers,
  getProviderTrends,

  // Exports
  exportTransactionsCSV,
  exportTransactionsExcel,
  generatePaymentReport,

  // Webhooks
  getWebhookLogs,
  retryWebhook,

  // Subscriptions
  createSubscription,
  getSubscriptions,
  cancelSubscription,

  // Disputes
  getDisputes,
  respondToDispute,

  // Fraud
  getFraudSettings,
  updateFraudRules,
  getFlaggedTransactions,
  reviewFlaggedTransaction,

  // Utilities
  downloadFile,
  formatCurrency,
  validatePaymentData,
};
