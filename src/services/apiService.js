import { publicHttpService, userHttpService } from "./http/index.js";

const apiEndPoint = `/api/auth`;

function authUrl(path) {
  return `${apiEndPoint}/${path}`;
}

// ==================== CONFIGURATION ====================
const API_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  TIMEOUT: 10000,
};

// ==================== UTILITY FUNCTIONS ====================
const retryWithBackoff = async (fn, retries = API_CONFIG.MAX_RETRIES) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = i === retries - 1;
      const isNetworkError = !error.response || error.code === "ECONNABORTED";

      if (isLastAttempt || !isNetworkError) {
        throw error;
      }

      const delay = API_CONFIG.RETRY_DELAY * Math.pow(2, i);
      console.log(`Retry attempt ${i + 1} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// ==================== REFRESH TOKEN FUNCTION ====================
const refreshTokenFunction = async (refreshToken) => {
  try {
    console.log("Refreshing access token...");

    const { data } = await publicHttpService.post(
      authUrl("refresh-token"),
      refreshToken ? { refreshToken } : {},
      {
        timeout: API_CONFIG.TIMEOUT,
        withCredentials: true, // Important for cookie-based refresh tokens
      }
    );

    console.log("Token refresh successful");

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn || 1800, // 30 minutes default
    };
  } catch (err) {
    console.error("Token refresh failed:", err);

    // Clear tokens on 401/403
    if (err.response?.status === 401 || err.response?.status === 403) {
      console.log("Refresh token invalid, clearing tokens");
      userHttpService.clearTokens();
    }

    throw err;
  }
};

// Configure the refresh function
userHttpService.setRefreshFunction(refreshTokenFunction);

// ==================== AUTH API FUNCTIONS ====================

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @param {boolean} rememberMe
 * @returns {Promise<Object>}
 */
export async function loginApi(email, password, rememberMe = false) {
  try {
    console.log("Login API called");

    const { data } = await retryWithBackoff(() =>
      publicHttpService.post(
        apiEndPoint,
        { email, password, rememberMe },
        {
          timeout: API_CONFIG.TIMEOUT,
          withCredentials: true,
        }
      )
    );

    // Set tokens using the service's token management
    if (data.accessToken) {
      userHttpService.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn || 1800,
      });

      console.log("Tokens set successfully");
    }

    return data;
  } catch (err) {
    console.error("Login failed:", err);

    // Enhance error message
    const errorMessage =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Login failed. Please try again.";

    throw new Error(errorMessage);
  }
}

/**
 * Refresh access token
 * @returns {Promise<Object>}
 */
export async function refreshTokenApi() {
  try {
    console.log("Refresh token API called");

    const refreshToken = userHttpService.tokenManager?.getRefreshToken();

    if (!refreshToken) {
      console.warn("No refresh token available");
      // Don't throw - let the HTTP service handle it with cookies
    }

    const newTokens = await retryWithBackoff(() =>
      refreshTokenFunction(refreshToken)
    );

    // Update tokens in the service
    userHttpService.setTokens(newTokens);

    console.log("Tokens refreshed and updated");

    return newTokens;
  } catch (err) {
    console.error("Token refresh API failed:", err);

    // Clear tokens on failure
    userHttpService.clearTokens();

    throw err;
  }
}

/**
 * Logout user
 * @returns {Promise<void>}
 */
export async function logoutApi() {
  try {
    console.log("Logout API called");

    // Call logout endpoint
    await userHttpService.post(
      authUrl("logout"),
      {},
      {
        timeout: 5000,
        withCredentials: true,
      }
    );

    console.log("Logout successful");
  } catch (err) {
    console.error("Logout API failed:", err);
    // Don't throw - we still want to clear local tokens
  } finally {
    // Always clear tokens locally
    userHttpService.clearTokens();
  }
}

/**
 * Logout from all devices
 * @returns {Promise<void>}
 */
export async function logoutAllApi() {
  try {
    console.log("Logout all devices API called");

    await userHttpService.post(
      authUrl("logout-all"),
      {},
      {
        timeout: 5000,
        withCredentials: true,
      }
    );

    console.log("Logged out from all devices");
  } catch (err) {
    console.error("Logout all API failed:", err);
    throw err;
  } finally {
    userHttpService.clearTokens();
  }
}

/**
 * Get current user data
 * @returns {Promise<Object>}
 */
export async function getUserApi() {
  try {
    console.log("Get user API called");

    const { data } = await retryWithBackoff(() =>
      userHttpService.get(authUrl("me"), {
        timeout: API_CONFIG.TIMEOUT,
      })
    );

    // Handle different response structures
    if (data && data.user) {
      return data.user;
    }

    // Fallback if structure is different
    console.warn("Unexpected user data structure:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    throw err;
  }
}

/**
 * Extend current session
 * @param {boolean} rememberMe
 * @returns {Promise<Object>}
 */
export async function extendSessionApi(rememberMe = false) {
  try {
    console.log("Extend session API called");

    const { data } = await userHttpService.post(
      authUrl("extend-session"),
      { rememberMe },
      {
        timeout: API_CONFIG.TIMEOUT,
        withCredentials: true,
      }
    );

    // Update tokens
    if (data.accessToken) {
      userHttpService.setTokens({
        accessToken: data.accessToken,
        expiresIn: data.expiresIn || 1800,
      });
    }

    return data;
  } catch (err) {
    console.error("Extend session failed:", err);
    throw err;
  }
}

/**
 * Check if session is still valid
 * @returns {Promise<Object>}
 */
export async function checkSessionApi() {
  try {
    const { data } = await userHttpService.get(authUrl("check-session"), {
      timeout: 5000,
    });

    return data;
  } catch (err) {
    console.error("Check session failed:", err);
    return { valid: false, authenticated: false };
  }
}

// ==================== PASSWORD MANAGEMENT ====================

/**
 * Request password reset
 * @param {string} email
 * @returns {Promise<Object>}
 */
export async function requestPasswordResetApi(email) {
  try {
    const { data } = await publicHttpService.post(
      authUrl("forgot-password"),
      { email },
      { timeout: API_CONFIG.TIMEOUT }
    );
    return data;
  } catch (err) {
    console.error("Password reset request failed:", err);
    throw err;
  }
}

/**
 * Reset password with token
 * @param {string} token
 * @param {string} newPassword
 * @returns {Promise<Object>}
 */
export async function resetPasswordApi(token, newPassword) {
  try {
    const { data } = await publicHttpService.post(
      authUrl("reset-password"),
      { token, password: newPassword },
      { timeout: API_CONFIG.TIMEOUT }
    );
    return data;
  } catch (err) {
    console.error("Password reset failed:", err);
    throw err;
  }
}

// ==================== EMAIL VERIFICATION ====================

/**
 * Verify email with token
 * @param {string} token
 * @returns {Promise<Object>}
 */
export async function verifyEmailApi(token) {
  try {
    const { data } = await publicHttpService.post(
      authUrl("verify-email"),
      { token },
      { timeout: API_CONFIG.TIMEOUT }
    );
    return data;
  } catch (err) {
    console.error("Email verification failed:", err);
    throw err;
  }
}

/**
 * Resend verification email
 * @param {string} email
 * @returns {Promise<Object>}
 */
export async function resendVerificationEmailApi(email) {
  try {
    const { data } = await publicHttpService.post(
      authUrl("resend-verification"),
      { email },
      { timeout: API_CONFIG.TIMEOUT }
    );
    return data;
  } catch (err) {
    console.error("Resend verification failed:", err);
    throw err;
  }
}

// ==================== EXPORTS ====================
export default {
  loginApi,
  refreshTokenApi,
  logoutApi,
  logoutAllApi,
  getUserApi,
  extendSessionApi,
  checkSessionApi,
  requestPasswordResetApi,
  resetPasswordApi,
  verifyEmailApi,
  resendVerificationEmailApi,
};
