import { jwtDecode } from "jwt-decode";
import {
  loginApi,
  refreshTokenApi,
  logoutApi,
  logoutAllApi,
  getUserApi,
  extendSessionApi,
  checkSessionApi,
} from "./apiService";
import { createAuthStore } from "../components/home/store/useAuthStore";
import { userHttpService } from "./http/index";

// ==================== CREATE AUTH STORE ====================
export const authStore = createAuthStore({
  loginApi,
  refreshTokenApi,
  logoutApi,
  getUserApi,
  userHttpService,
});

// ==================== INITIALIZATION ====================
export const initializeAuth = async () => {
  console.log("Initializing authentication...");
  try {
    await authStore.getState().initialize();
    console.log("Authentication initialization completed");
  } catch (error) {
    console.error("Authentication initialization failed:", error);
    authStore.setState({ isAuthReady: true });
  }
};

// ==================== AUTH FUNCTIONS ====================

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @param {boolean} rememberMe
 */
export async function login(email, password, rememberMe = false) {
  return authStore.getState().login(email, password, rememberMe);
}

/**
 * Refresh access token
 */
export async function refreshAccessToken() {
  return authStore.getState().refreshAccessToken();
}

/**
 * Get user profile
 */
export async function getUser() {
  return authStore.getState().getUser();
}

/**
 * Get current user from token
 */
export function getCurrentUser() {
  try {
    const { accessToken } = authStore.getState();
    return accessToken ? jwtDecode(accessToken) : null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

/**
 * Login with JWT token
 * @param {string} jwt
 * @param {number} expiresIn
 */
export async function loginWithJwt(jwt, expiresIn) {
  try {
    if (!expiresIn) {
      try {
        const decoded = jwtDecode(jwt);
        const now = Math.floor(Date.now() / 1000);
        expiresIn = decoded.exp ? decoded.exp - now : 1800; // 30 min default
      } catch (decodeError) {
        console.warn(
          "Could not decode JWT for expiry, using default:",
          decodeError
        );
        expiresIn = 1800;
      }
    }

    console.log("Logging in with JWT, expiresIn:", expiresIn);
    return await authStore.getState().loginWithToken(jwt, expiresIn);
  } catch (error) {
    console.error("loginWithJwt failed:", error);
    throw error;
  }
}

/**
 * Logout current session
 * @param {boolean} showMessage
 */
export async function logout(showMessage = true) {
  return authStore.getState().logout(showMessage);
}

/**
 * Logout from all devices
 */
export async function logoutAll() {
  try {
    await logoutAllApi();
    await authStore.getState().logout(false);
    return true;
  } catch (error) {
    console.error("Logout all failed:", error);
    throw error;
  }
}

/**
 * Extend current session
 */
export async function extendSession() {
  try {
    const result = await extendSessionApi();
    authStore.getState().extendSession();
    return result;
  } catch (error) {
    console.error("Extend session failed:", error);
    throw error;
  }
}

/**
 * Check if session is valid
 */
export async function checkSession() {
  try {
    return await checkSessionApi();
  } catch (error) {
    console.error("Check session failed:", error);
    return { valid: false, authenticated: false };
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  const { isAuthenticated, expiryDate } = authStore.getState();
  return isAuthenticated && expiryDate && Date.now() < expiryDate;
}

/**
 * Get access token
 */
export function getAccessToken() {
  // Try userHttpService first (most current)
  const httpServiceToken = userHttpService.tokenManager?.getAccessToken();
  if (httpServiceToken && !userHttpService.tokenManager?.isTokenExpired()) {
    return httpServiceToken;
  }

  // Fallback to auth store
  const { accessToken, expiryDate } = authStore.getState();
  if (!accessToken || !expiryDate || Date.now() >= expiryDate) {
    return null;
  }
  return accessToken;
}

/**
 * Get activity information
 */
export function getActivityInfo() {
  return authStore.getState().getActivityInfo();
}

// ==================== MULTI-TAB SYNC ====================
let isHandlingLogout = false;

const handleLogoutEvent = () => {
  if (isHandlingLogout) return;
  isHandlingLogout = true;

  try {
    const { logout, isAuthenticated } = authStore.getState();
    if (isAuthenticated) {
      logout(false).finally(() => {
        setTimeout(() => {
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          isHandlingLogout = false;
        }, 100);
      });
    } else {
      isHandlingLogout = false;
    }
  } catch (error) {
    console.error("Error handling logout event:", error);
    isHandlingLogout = false;
  }
};

// Storage event listener for cross-tab logout
if (typeof window !== "undefined") {
  // Cross-tab storage sync
  window.addEventListener("storage", (e) => {
    if (e.key === "auth-logout" && e.newValue) {
      handleLogoutEvent();
    }
  });

  window.addEventListener("authStorage", (e) => {
    const { name, value } = e.detail || {};
    if (name === "auth-logout" && value) {
      handleLogoutEvent();
    }
  });

  // Enhanced page visibility handling
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      const { expiryDate, isAuthenticated, checkTokenExpiry } =
        authStore.getState();

      if (isAuthenticated) {
        if (!expiryDate || Date.now() > expiryDate) {
          console.log("Token expired while page was hidden, logging out");
          authStore.getState().logout();
        } else {
          if (typeof checkTokenExpiry === "function") {
            checkTokenExpiry();
          }
        }
      }
    }
  });

  // Periodic session validation (every 5 minutes when visible)
  let sessionCheckInterval = null;

  const startSessionCheck = () => {
    if (sessionCheckInterval) clearInterval(sessionCheckInterval);

    sessionCheckInterval = setInterval(async () => {
      if (document.visibilityState === "visible") {
        const { isAuthenticated } = authStore.getState();

        if (isAuthenticated) {
          try {
            const sessionStatus = await checkSession();
            if (!sessionStatus.valid || !sessionStatus.authenticated) {
              console.log("Session no longer valid, logging out");
              authStore.getState().logout();
            }
          } catch (error) {
            console.error("Session check failed:", error);
          }
        }
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  };

  const stopSessionCheck = () => {
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
      sessionCheckInterval = null;
    }
  };

  // Subscribe to auth state changes
  authStore.subscribe((state) => {
    if (state.isAuthenticated && state.isAuthReady) {
      startSessionCheck();
    } else {
      stopSessionCheck();
    }
  });

  window.addEventListener("beforeunload", () => {
    stopSessionCheck();
  });
}

// ==================== EXPORTS ====================
export const tokenManager = userHttpService.tokenManager;

export default {
  login,
  logout,
  logoutAll,
  refreshAccessToken,
  getUser,
  getCurrentUser,
  loginWithJwt,
  isAuthenticated,
  getAccessToken,
  extendSession,
  checkSession,
  getActivityInfo,
  initializeAuth,
};
