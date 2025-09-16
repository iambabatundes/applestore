import { BaseHttpService, ClientType } from "./httpService.js";

class UserHttpService extends BaseHttpService {
  constructor(config = {}) {
    super(ClientType.USER, config);
  }

  // Override base URL for user-specific endpoints
  getClientSpecificBaseURL(base) {
    return `${base}/user`;
  }

  // Override headers for user requests
  getClientSpecificHeaders(headers) {
    return {
      ...headers,
      "X-Client-Type": "user",
      "X-API-Version": "v1",
    };
  }

  // Override request interceptor for user-specific logic
  async onRequestIntercept(config) {
    config.headers = config.headers || {};
    config.headers["X-Request-Source"] = "user-client";

    // Add user context if available
    const userId = this.getCurrentUserId();
    if (userId) {
      config.headers["X-User-ID"] = userId;
    }

    return config;
  }

  // Override error handling for user endpoints
  async onErrorIntercept(error) {
    const response = error.response;

    // Handle specific user API errors
    if (response?.status === 403) {
      // User might not have sufficient permissions
      console.warn("User access denied - insufficient permissions");
    } else if (response?.status === 402) {
      // Payment required - subscription or credits exhausted
      console.warn("Payment required - subscription may be expired");
    }
  }

  // Get current user ID from token or storage
  getCurrentUserId() {
    // const token = this.getToken();
    const token = this.tokenManager.getAccessToken();
    if (!token) return null;

    try {
      // Decode JWT token to get user ID (basic decode, not verification)
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || payload.userId || payload.id;
    } catch (error) {
      console.warn("Failed to extract user ID from token:", error);
      return null;
    }
  }

  // User Profile Management
  async getProfile() {
    return this.get("/profile");
  }

  async updateProfile(profileData) {
    return this.put("/profile", profileData);
  }

  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);

    return this.post("/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async deleteAvatar() {
    return this.delete("/profile/avatar");
  }

  async changePassword(currentPassword, newPassword) {
    return this.post("/profile/change-password", {
      currentPassword,
      newPassword,
    });
  }

  async updateEmail(newEmail, password) {
    return this.post("/profile/change-email", {
      newEmail,
      password,
    });
  }

  async verifyNewEmail(token) {
    return this.post("/profile/verify-email", { token });
  }

  // Account Management
  async getAccountSettings() {
    return this.get("/account/settings");
  }

  async updateAccountSettings(settings) {
    return this.put("/account/settings", settings);
  }

  async getNotificationPreferences() {
    return this.get("/account/notifications");
  }

  async updateNotificationPreferences(preferences) {
    return this.put("/account/notifications", preferences);
  }

  async getPrivacySettings() {
    return this.get("/account/privacy");
  }

  async updatePrivacySettings(settings) {
    return this.put("/account/privacy", settings);
  }

  async deleteAccount(password, reason = null) {
    return this.delete("/account", {
      data: { password, reason },
    });
  }

  async exportAccountData() {
    return this.get("/account/export");
  }

  // Shopping Cart & Orders
  async getCart() {
    return this.get("/cart");
  }

  async addToCart(productId, quantity = 1, options = {}) {
    return this.post("/cart/add", {
      productId,
      quantity,
      options,
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.put(`/cart/items/${itemId}`, { quantity });
  }

  async removeFromCart(itemId) {
    return this.delete(`/cart/items/${itemId}`);
  }

  async clearCart() {
    return this.delete("/cart");
  }

  async applyCoupon(couponCode) {
    return this.post("/cart/coupon", { code: couponCode });
  }

  async removeCoupon() {
    return this.delete("/cart/coupon");
  }

  async getShippingOptions() {
    return this.get("/cart/shipping-options");
  }

  async selectShippingOption(shippingId) {
    return this.post("/cart/shipping", { shippingId });
  }

  // Orders
  async getOrders(params = {}) {
    return this.get("/orders", { params });
  }

  async getOrder(orderId) {
    return this.get(`/orders/${orderId}`);
  }

  async createOrder(orderData) {
    return this.post("/orders", orderData);
  }

  async cancelOrder(orderId, reason = null) {
    return this.post(`/orders/${orderId}/cancel`, { reason });
  }

  async getOrderTracking(orderId) {
    return this.get(`/orders/${orderId}/tracking`);
  }

  async downloadOrderInvoice(orderId) {
    return this.get(`/orders/${orderId}/invoice`, {
      responseType: "blob",
    });
  }

  // Returns & Exchanges
  async createReturn(orderId, items, reason) {
    return this.post(`/orders/${orderId}/return`, {
      items,
      reason,
    });
  }

  async getReturns(params = {}) {
    return this.get("/returns", { params });
  }

  async getReturn(returnId) {
    return this.get(`/returns/${returnId}`);
  }

  // Wishlist
  async getWishlist() {
    return this.get("/wishlist");
  }

  async addToWishlist(productId) {
    return this.post("/wishlist", { productId });
  }

  async removeFromWishlist(productId) {
    return this.delete(`/wishlist/${productId}`);
  }

  async clearWishlist() {
    return this.delete("/wishlist");
  }

  async moveWishlistToCart(productId, quantity = 1) {
    return this.post(`/wishlist/${productId}/move-to-cart`, { quantity });
  }

  // Reviews & Ratings
  async createReview(productId, rating, review, title = null) {
    return this.post(`/products/${productId}/reviews`, {
      rating,
      review,
      title,
    });
  }

  async updateReview(reviewId, data) {
    return this.put(`/reviews/${reviewId}`, data);
  }

  async deleteReview(reviewId) {
    return this.delete(`/reviews/${reviewId}`);
  }

  async getMyReviews(params = {}) {
    return this.get("/reviews/mine", { params });
  }

  async uploadReviewImages(reviewId, images) {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    return this.post(`/reviews/${reviewId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  // Addresses
  async getAddresses() {
    return this.get("/addresses");
  }

  async createAddress(addressData) {
    return this.post("/addresses", addressData);
  }

  async updateAddress(addressId, addressData) {
    return this.put(`/addresses/${addressId}`, addressData);
  }

  async deleteAddress(addressId) {
    return this.delete(`/addresses/${addressId}`);
  }

  async setDefaultAddress(addressId, type = "shipping") {
    return this.post(`/addresses/${addressId}/set-default`, { type });
  }

  // Payment Methods
  async getPaymentMethods() {
    return this.get("/payment-methods");
  }

  async addPaymentMethod(paymentData) {
    return this.post("/payment-methods", paymentData);
  }

  async updatePaymentMethod(methodId, paymentData) {
    return this.put(`/payment-methods/${methodId}`, paymentData);
  }

  async deletePaymentMethod(methodId) {
    return this.delete(`/payment-methods/${methodId}`);
  }

  async setDefaultPaymentMethod(methodId) {
    return this.post(`/payment-methods/${methodId}/set-default`);
  }

  // Subscriptions
  async getSubscriptions() {
    return this.get("/subscriptions");
  }

  async getSubscription(subscriptionId) {
    return this.get(`/subscriptions/${subscriptionId}`);
  }

  async createSubscription(subscriptionData) {
    return this.post("/subscriptions", subscriptionData);
  }

  async updateSubscription(subscriptionId, data) {
    return this.put(`/subscriptions/${subscriptionId}`, data);
  }

  async cancelSubscription(subscriptionId, reason = null) {
    return this.post(`/subscriptions/${subscriptionId}/cancel`, { reason });
  }

  async pauseSubscription(subscriptionId, duration = null) {
    return this.post(`/subscriptions/${subscriptionId}/pause`, { duration });
  }

  async resumeSubscription(subscriptionId) {
    return this.post(`/subscriptions/${subscriptionId}/resume`);
  }

  // Notifications
  async getNotifications(params = {}) {
    return this.get("/notifications", { params });
  }

  async markNotificationAsRead(notificationId) {
    return this.put(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead() {
    return this.put("/notifications/read-all");
  }

  async deleteNotification(notificationId) {
    return this.delete(`/notifications/${notificationId}`);
  }

  async getUnreadNotificationCount() {
    return this.get("/notifications/unread-count");
  }

  // Support & Help
  async createSupportTicket(
    subject,
    message,
    category = null,
    attachments = []
  ) {
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("message", message);
    if (category) formData.append("category", category);

    attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    return this.post("/support/tickets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async getSupportTickets(params = {}) {
    return this.get("/support/tickets", { params });
  }

  async getSupportTicket(ticketId) {
    return this.get(`/support/tickets/${ticketId}`);
  }

  async replyToSupportTicket(ticketId, message, attachments = []) {
    const formData = new FormData();
    formData.append("message", message);

    attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });

    return this.post(`/support/tickets/${ticketId}/reply`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async closeSupportTicket(ticketId) {
    return this.post(`/support/tickets/${ticketId}/close`);
  }

  // Loyalty & Rewards
  async getLoyaltyPoints() {
    return this.get("/loyalty/points");
  }

  async getLoyaltyHistory(params = {}) {
    return this.get("/loyalty/history", { params });
  }

  async redeemPoints(rewardId, pointsToRedeem) {
    return this.post("/loyalty/redeem", {
      rewardId,
      points: pointsToRedeem,
    });
  }

  async getAvailableRewards() {
    return this.get("/loyalty/rewards");
  }

  // Social Features
  async followUser(userId) {
    return this.post(`/social/follow/${userId}`);
  }

  async unfollowUser(userId) {
    return this.delete(`/social/follow/${userId}`);
  }

  async getFollowing(params = {}) {
    return this.get("/social/following", { params });
  }

  async getFollowers(params = {}) {
    return this.get("/social/followers", { params });
  }

  async shareProduct(productId, platform, message = null) {
    return this.post("/social/share", {
      productId,
      platform,
      message,
    });
  }

  // Analytics & Insights (user-level)
  async getPersonalAnalytics(period = "30d") {
    return this.get("/analytics/personal", { params: { period } });
  }

  async getSpendingAnalytics(period = "12m") {
    return this.get("/analytics/spending", { params: { period } });
  }

  // File Uploads (general)
  async uploadFile(file, category = "general") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    return this.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        // Emit upload progress event if needed
        this.onUploadProgress?.(percentCompleted);
      },
    });
  }

  async deleteFile(fileId) {
    return this.delete(`/uploads/${fileId}`);
  }

  // Batch operations
  async batchUpdateCartItems(items) {
    return this.put("/cart/batch", { items });
  }

  async batchAddToWishlist(productIds) {
    return this.post("/wishlist/batch", { productIds });
  }

  // User-specific caching
  async getCachedUserData(endpoint, ttl = 5 * 60 * 1000) {
    const userId = this.getCurrentUserId();
    const cacheKey = this.cache.generateKey({
      method: "GET",
      url: endpoint,
      userId,
    });

    const cached = this.cache.get(cacheKey);
    if (cached) return cached;

    const response = await this.get(endpoint);
    this.cache.set(cacheKey, response, ttl);

    return response;
  }

  // Invalidate user-specific cache
  invalidateUserCache(pattern = null) {
    const userId = this.getCurrentUserId();
    if (!userId) return;

    // If pattern provided, only clear matching entries
    if (pattern) {
      // Implementation would depend on cache structure
      console.log(`Invalidating user cache for pattern: ${pattern}`);
    } else {
      // Clear all user cache
      this.clearCache();
    }
  }

  // Event hooks for upload progress
  onUploadProgress = null;

  setUploadProgressHandler(handler) {
    this.onUploadProgress = handler;
  }
}

// Create and export singleton instance
const userHttpService = new UserHttpService();

export { UserHttpService };
export default userHttpService;

// ===== ENHANCED USER HTTP SERVICE =====
// class UserHttpService extends BaseHttpService {
//   constructor(config = {}) {
//     const userConfig = {
//       timeout: 20000,
//       retryAttempts: 2,
//       cacheConfig: {
//         maxSize: 150,
//         defaultTTL: 5 * 60 * 1000, // 5 minutes for user data
//       },
//       securityConfig: {
//         enableCSRF: true,
//         tokenRefreshThreshold: 5 * 60 * 1000,
//         maxConcurrentRequests: 8,
//       },
//       ...config,
//     };

//     super(ClientType.USER, userConfig);
//   }

//   getClientSpecificBaseURL(base) {
//     const apiVersion = this.config.apiVersion || "v1";
//     return `${base}/user/${apiVersion}`;
//   }

//   getClientSpecificHeaders(headers) {
//     return {
//       ...headers,
//       "X-Client-Type": "user",
//       "X-API-Version": this.config.apiVersion || "v1",
//       "X-User-Agent": this.getUserAgent(),
//     };
//   }

//   onRequestIntercept(config) {
//     config.headers = config.headers || {};
//     config.headers["X-Request-Source"] = "user-client";

//     // Add user context if available
//     const userContext = this.getUserContext();
//     if (userContext) {
//       config.headers["X-User-Context"] = JSON.stringify(userContext);
//     }

//     return config;
//   }

//   getUserAgent() {
//     if (typeof navigator !== "undefined") {
//       return navigator.userAgent;
//     }
//     return "UserHttpService/1.0";
//   }

//   getUserContext() {
//     // Extract user context from token or storage
//     try {
//       const token = this.tokenManager.getAccessToken();
//       if (token) {
//         const payload = JSON.parse(atob(token.split(".")[1]));
//         return {
//           userId: payload.userId,
//           roles: payload.roles,
//           preferences: payload.preferences,
//         };
//       }
//     } catch (error) {
//       this.logger?.warn?.("Failed to extract user context", error);
//     }
//     return null;
//   }

//   async onErrorIntercept(error) {
//     const response = error.response;

//     if (response?.status === 402) {
//       // Handle payment required errors
//       this.logger?.info?.("Payment required for user operation", {
//         url: error.config?.url,
//         planRequired: response.data?.planRequired,
//       });
//     }

//     if (response?.status === 423) {
//       // Handle account locked errors
//       this.logger?.warn?.("User account locked", {
//         reason: response.data?.reason,
//         unlockAt: response.data?.unlockAt,
//       });
//     }
//   }
// }
