import { jwtDecode } from "jwt-decode";
import { loginApi, refreshTokenApi, logoutApi, getUserApi } from "./apiService";
import { createAuthStore } from "../components/home/store/useAuthStore";
import { userHttpService } from "./http/index";

export const authStore = createAuthStore({
  loginApi,
  refreshTokenApi,
  logoutApi,
  getUserApi,
  userHttpService,
});

export const initializeAuth = async () => {
  console.log("Initializing authentication...");
  try {
    // Call the initialize method
    await authStore.getState().initialize();
    console.log("Authentication initialization completed");
  } catch (error) {
    console.error("Authentication initialization failed:", error);
    // Ensure auth is marked as ready even if initialization fails
    authStore.setState({ isAuthReady: true });
  }
};

// Login function
export async function login(email, password) {
  return authStore.getState().login(email, password);
}

// Refresh token function
export async function refreshAccessToken() {
  return authStore.getState().refreshAccessToken();
}

// Get user profile
export async function getUser() {
  return authStore.getState().getUser();
}

// Get current user from token
export function getCurrentUser() {
  try {
    const { accessToken } = authStore.getState();
    return accessToken ? jwtDecode(accessToken) : null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// Login with JWT - CORRECTED
export async function loginWithJwt(jwt, expiresIn) {
  try {
    if (!expiresIn) {
      try {
        const decoded = jwtDecode(jwt);
        const now = Math.floor(Date.now() / 1000);
        expiresIn = decoded.exp ? decoded.exp - now : 900;
      } catch (decodeError) {
        console.warn(
          "Could not decode JWT for expiry, using default:",
          decodeError
        );
        expiresIn = 900;
      }
    }

    console.log("Logging in with JWT, expiresIn:", expiresIn);

    // The auth store will handle setting tokens in the service
    return await authStore.getState().loginWithToken(jwt, expiresIn);
  } catch (error) {
    console.error("loginWithJwt failed:", error);
    throw error;
  }
}

// Logout function
export async function logout() {
  return authStore.getState().logout();
}

// Check if user is authenticated
export function isAuthenticated() {
  const { isAuthenticated, expiryDate } = authStore.getState();
  return isAuthenticated && expiryDate && Date.now() < expiryDate;
}

// Get access token - CORRECTED to use userHttpService
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

// Multi-tab sync - Enhanced error handling
let isHandlingLogout = false;

const handleLogoutEvent = () => {
  if (isHandlingLogout) return;
  isHandlingLogout = true;

  try {
    const { logout, isAuthenticated } = authStore.getState();
    if (isAuthenticated) {
      logout().finally(() => {
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

  // Periodic token check
  let tokenCheckInterval = null;

  const startTokenCheck = () => {
    if (tokenCheckInterval) clearInterval(tokenCheckInterval);
    tokenCheckInterval = setInterval(() => {
      if (document.visibilityState === "visible") {
        const { isAuthenticated, checkTokenExpiry } = authStore.getState();
        if (isAuthenticated && typeof checkTokenExpiry === "function") {
          checkTokenExpiry();
        }
      }
    }, 30000);
  };

  const stopTokenCheck = () => {
    if (tokenCheckInterval) {
      clearInterval(tokenCheckInterval);
      tokenCheckInterval = null;
    }
  };

  // Subscribe to auth state changes
  authStore.subscribe((state) => {
    if (state.isAuthenticated && state.isAuthReady) {
      startTokenCheck();
    } else {
      stopTokenCheck();
    }
  });

  window.addEventListener("beforeunload", () => {
    stopTokenCheck();
  });
}

// Export token manager for backward compatibility if needed
export const tokenManager = userHttpService.tokenManager;
