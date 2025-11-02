// services/subscriptionService.js
import {
  adminHttpService,
  userHttpService,
  publicHttpService,
} from "./http/index.js";

const subscriptionsPath = "/api/subscriptions";
const plansPath = "/api/subscriptions/plans";
const analyticsPath = "/api/subscriptions/analytics";

export const getAllPlans = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...(filters.active !== undefined && { active: filters.active }),
      ...(filters.provider && { provider: filters.provider }),
      ...(filters.search && { search: filters.search }),
    });

    const response = await publicHttpService.get(`${plansPath}?${queryParams}`);
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const getPlanDetails = async (planId) => {
  try {
    const response = await publicHttpService.get(`${plansPath}/${planId}`);
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const createPlan = async (planData) => {
  try {
    const response = await adminHttpService.post(
      `${subscriptionsPath}/admin/plans`,
      planData
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const updatePlan = async (planId, planData) => {
  try {
    const response = await adminHttpService.put(
      `${subscriptionsPath}/admin/plans/${planId}`,
      planData
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const deletePlan = async (planId) => {
  try {
    const response = await adminHttpService.delete(
      `${subscriptionsPath}/admin/plans/${planId}`
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const togglePlanStatus = async (planId) => {
  try {
    const response = await adminHttpService.patch(
      `${subscriptionsPath}/admin/plans/${planId}/toggle`
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

// ===== USER SUBSCRIPTIONS =====

export const createSubscription = async (subscriptionData) => {
  try {
    const response = await userHttpService.post(
      subscriptionsPath,
      subscriptionData
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const getUserSubscriptions = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...(filters.status && { status: filters.status }),
      ...(filters.planId && { planId: filters.planId }),
    });

    const response = await userHttpService.get(
      `${subscriptionsPath}?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const getSubscriptionDetails = async (subscriptionId) => {
  try {
    const response = await userHttpService.get(
      `${subscriptionsPath}/${subscriptionId}`
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const cancelSubscription = async (subscriptionId, reason) => {
  try {
    const response = await userHttpService.post(
      `${subscriptionsPath}/${subscriptionId}/cancel`,
      { reason }
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const pauseSubscription = async (subscriptionId, resumeDate) => {
  try {
    const response = await userHttpService.post(
      `${subscriptionsPath}/${subscriptionId}/pause`,
      { resumeDate }
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const resumeSubscription = async (subscriptionId) => {
  try {
    const response = await userHttpService.post(
      `${subscriptionsPath}/${subscriptionId}/resume`
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const changeSubscriptionPlan = async (subscriptionId, newPlanId) => {
  try {
    const response = await userHttpService.put(
      `${subscriptionsPath}/${subscriptionId}/plan`,
      { newPlanId }
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const updatePaymentMethod = async (
  subscriptionId,
  paymentMethodData
) => {
  try {
    const response = await userHttpService.put(
      `${subscriptionsPath}/${subscriptionId}/payment-method`,
      paymentMethodData
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

// ===== USAGE TRACKING =====

export const recordUsage = async (subscriptionId, quantity, idempotencyKey) => {
  try {
    const response = await userHttpService.post(
      `${subscriptionsPath}/${subscriptionId}/usage`,
      { quantity, idempotencyKey }
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const getUsageStats = async (subscriptionId) => {
  try {
    const response = await userHttpService.get(
      `${subscriptionsPath}/${subscriptionId}/usage`
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const getSubscriptionHistory = async (subscriptionId) => {
  try {
    const response = await userHttpService.get(
      `${subscriptionsPath}/${subscriptionId}/history`
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

// ===== COUPONS =====

export const applyCoupon = async (subscriptionId, couponCode) => {
  try {
    const response = await userHttpService.post(
      `${subscriptionsPath}/${subscriptionId}/coupon`,
      { couponCode }
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

// ===== ANALYTICS =====

export const getSubscriptionAnalytics = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...(params.dateFrom && { dateFrom: params.dateFrom }),
      ...(params.dateTo && { dateTo: params.dateTo }),
    });

    const response = await userHttpService.get(
      `${analyticsPath}/overview?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

// ===== ADMIN ROUTES =====

export const getAllSubscriptions = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      page: filters.page || 1,
      limit: filters.limit || 20,
      ...(filters.status && { status: filters.status }),
      ...(filters.provider && { provider: filters.provider }),
      ...(filters.planId && { planId: filters.planId }),
      ...(filters.search && { search: filters.search }),
    });

    const response = await adminHttpService.get(
      `${subscriptionsPath}/admin/subscriptions?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const getSubscriptionById = async (subscriptionId) => {
  try {
    const response = await adminHttpService.get(
      `${subscriptionsPath}/admin/subscriptions/${subscriptionId}`
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const forceCancelSubscription = async (
  subscriptionId,
  reason,
  refund = false
) => {
  try {
    const response = await adminHttpService.post(
      `${subscriptionsPath}/admin/subscriptions/${subscriptionId}/force-cancel`,
      { reason, refund }
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const getAdminAnalytics = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...(params.dateFrom && { dateFrom: params.dateFrom }),
      ...(params.dateTo && { dateTo: params.dateTo }),
    });

    const response = await adminHttpService.get(
      `${subscriptionsPath}/admin/subscriptions/analytics/overview?${queryParams}`
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const getRevenueMetrics = async (period = "monthly") => {
  try {
    const response = await adminHttpService.get(
      `${subscriptionsPath}/admin/subscriptions/analytics/revenue?period=${period}`
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

export const exportSubscriptionsCSV = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams({
      ...(filters.status && { status: filters.status }),
      ...(filters.provider && { provider: filters.provider }),
      ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters.dateTo && { dateTo: filters.dateTo }),
    });

    const response = await adminHttpService.get(
      `${subscriptionsPath}/admin/subscriptions/export/csv?${queryParams}`,
      { responseType: "blob" }
    );
    return response.data;
  } catch (error) {
    throw handleSubscriptionError(error);
  }
};

// ===== UTILITY FUNCTIONS =====

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

export const formatSubscriptionPrice = (amount, currency, interval) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);

  return `${formatted}/${interval}`;
};

export const calculateProration = (
  currentAmount,
  newAmount,
  daysUsed,
  totalDays
) => {
  const unusedDays = totalDays - daysUsed;
  const refund = (currentAmount / totalDays) * unusedDays;
  const charge = (newAmount / totalDays) * unusedDays;
  const difference = charge - refund;

  return {
    refund: Math.max(0, refund),
    charge: Math.max(0, charge),
    difference,
    immediateCharge: Math.max(0, difference),
  };
};

export const getSubscriptionStatus = (subscription) => {
  const now = new Date();
  const endDate = new Date(subscription.currentPeriodEnd);

  if (subscription.status === "canceled") {
    return {
      status: "canceled",
      label: "Canceled",
      color: "red",
      canRenew: false,
    };
  }

  if (subscription.status === "paused") {
    return {
      status: "paused",
      label: "Paused",
      color: "yellow",
      canResume: true,
    };
  }

  if (subscription.status === "past_due") {
    return {
      status: "past_due",
      label: "Past Due",
      color: "orange",
      actionRequired: true,
    };
  }

  if (subscription.status === "trialing") {
    return {
      status: "trialing",
      label: "Trial Period",
      color: "blue",
      daysLeft: Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)),
    };
  }

  if (subscription.status === "active") {
    const daysUntilRenewal = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

    return {
      status: "active",
      label: "Active",
      color: "green",
      daysUntilRenewal,
      renewalDate: endDate,
    };
  }

  return {
    status: subscription.status,
    label: subscription.status,
    color: "gray",
  };
};

export const validateSubscriptionData = (data) => {
  const errors = {};

  if (!data.planId) {
    errors.planId = "Plan is required";
  }

  if (!data.provider) {
    errors.provider = "Payment provider is required";
  }

  if (data.customAmount && data.customAmount <= 0) {
    errors.customAmount = "Amount must be greater than 0";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const handleSubscriptionError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    const message =
      data.message || data.error || "Subscription operation failed";

    const customError = new Error(message);
    customError.status = status;
    customError.data = data;

    return customError;
  } else if (error.request) {
    return new Error(
      "No response from subscription server. Please check your connection."
    );
  } else {
    return new Error(error.message || "An unexpected error occurred");
  }
};

// Export all functions as default object
export default {
  // Plans
  getAllPlans,
  getPlanDetails,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,

  // User Subscriptions
  createSubscription,
  getUserSubscriptions,
  getSubscriptionDetails,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
  changeSubscriptionPlan,
  updatePaymentMethod,

  // Usage
  recordUsage,
  getUsageStats,
  getSubscriptionHistory,

  // Coupons
  applyCoupon,

  // Analytics
  getSubscriptionAnalytics,

  // Admin
  getAllSubscriptions,
  getSubscriptionById,
  forceCancelSubscription,
  getAdminAnalytics,
  getRevenueMetrics,
  exportSubscriptionsCSV,

  // Utilities
  downloadFile,
  formatSubscriptionPrice,
  calculateProration,
  getSubscriptionStatus,
  validateSubscriptionData,
};
