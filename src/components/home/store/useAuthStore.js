import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import { httpService, ClientType } from "../../../services/httpService";

// === Utility functions ===
const calculateExpiryDate = (expiresInSeconds) =>
  Date.now() + expiresInSeconds * 1000;

// JWT validation function (since we can't import it)
const isValidJwt = (token) => {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
  return parts.every((part) => base64UrlRegex.test(part));
};

// === Secure localStorage wrapper ===
const secureStorage = {
  getItem: (name) => {
    try {
      const json = localStorage.getItem(name);
      return json ? JSON.parse(json) : null; // ✅ parse back to object
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return null;
    }
  },

  setItem: (name, value) => {
    try {
      const str = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(name, str);
      window.dispatchEvent(
        new CustomEvent("authStorage", { detail: { name, value: str } })
      );
    } catch (error) {
      console.error("Error writing to localStorage:", error);
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
      window.dispatchEvent(
        new CustomEvent("authStorage", { detail: { name, value: null } })
      );
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  },
};

// === Timers ===
let logoutTimer = null;
let refreshTimer = null;

const clearLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
};

const clearRefreshTimer = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

const scheduleAutoLogout = (expiresInSeconds, logout) => {
  clearLogoutTimer();
  if (expiresInSeconds <= 0) {
    logout();
    return;
  }
  logoutTimer = setTimeout(() => {
    toast.info("Your session has expired. You've been logged out.");
    logout();
    window.location.href = "/login";
  }, expiresInSeconds * 1000);
};

const scheduleAutoRefresh = (expiresInSeconds, refreshFn) => {
  clearRefreshTimer();
  if (expiresInSeconds <= 120) {
    // Refresh immediately if less than 2 minutes left
    refreshFn().catch(console.error);
    return;
  }
  refreshTimer = setTimeout(() => {
    refreshFn().catch(console.error);
  }, (expiresInSeconds - 120) * 1000); // Refresh 2 minutes before expiry
};

// === Auth Store ===
export const createAuthStore = ({
  loginApi,
  refreshTokenApi,
  logoutApi,
  getUserApi,
}) =>
  create(
    persist(
      (set, get) => {
        const userRefreshAccessToken = async () => {
          const currentState = get();
          if (currentState.isRefreshing) {
            console.log("Refresh already in progress, skipping...");
            return currentState.refreshPromise;
          }

          console.log("Starting token refresh...");

          const refreshPromise = (async () => {
            set({ isRefreshing: true });

            try {
              const response = await refreshTokenApi();
              const accessToken = response.accessToken || response.token;
              const expiresIn = response.expiresIn || 900;
              const user = response.user || currentState.user;

              if (!isValidJwt(accessToken)) {
                throw new Error("Invalid access token received from refresh");
              }

              // Set tokens in httpService
              httpService.setTokens(ClientType.USER, {
                accessToken,
                refreshToken: response.refreshToken,
                expiresIn,
              });

              const newExpiryDate = calculateExpiryDate(expiresIn);

              scheduleAutoLogout(expiresIn, get().logout);
              scheduleAutoRefresh(expiresIn, userRefreshAccessToken);

              set({
                user,
                accessToken,
                expiryDate: newExpiryDate,
                isRefreshing: false,
                refreshPromise: null,
                isAuthenticated: true,
              });

              console.log("Token refreshed successfully");
              return { accessToken, expiresIn };
            } catch (error) {
              console.error("Token refresh failed:", error);
              set({ isRefreshing: false, refreshPromise: null });

              if (
                error.response?.status === 401 ||
                error.response?.status === 403
              ) {
                console.log("Auth error during refresh, logging out");
                toast.error("Session expired. Please log in again.");
                get().logout();
              } else {
                console.warn("Network error during token refresh");
              }
              throw error;
            }
          })();

          set({ refreshPromise });
          return refreshPromise;
        };

        return {
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isAuthReady: false,
          expiryDate: null,
          isLoading: false,
          isRefreshing: false,
          refreshPromise: null,

          // Initialize method
          initialize: async () => {
            console.log("Initializing auth store...");

            try {
              const currentState = get();

              // If already authenticated and user exists, we're good
              if (
                currentState.isAuthenticated &&
                currentState.user &&
                currentState.accessToken
              ) {
                const timeToExpiry = currentState.expiryDate - Date.now();
                if (timeToExpiry > 0) {
                  const expiresIn = Math.floor(timeToExpiry / 1000);
                  scheduleAutoLogout(expiresIn, get().logout);
                  scheduleAutoRefresh(expiresIn, userRefreshAccessToken);
                  set({ isAuthReady: true });
                  return;
                }
              }

              // Check httpService for stored tokens
              const storedToken = httpService.tokenManager?.getAccessToken(
                ClientType.USER
              );

              if (
                storedToken &&
                !httpService.tokenManager?.isTokenExpired(ClientType.USER)
              ) {
                if (isValidJwt(storedToken)) {
                  // Get expiry from token
                  try {
                    const payload = JSON.parse(atob(storedToken.split(".")[1]));
                    const expiryTimestamp = payload.exp * 1000; // Convert to milliseconds
                    const timeToExpiry = expiryTimestamp - Date.now();

                    if (timeToExpiry > 0) {
                      const expiresIn = Math.floor(timeToExpiry / 1000);

                      set({
                        accessToken: storedToken,
                        expiryDate: expiryTimestamp,
                        isAuthenticated: true,
                      });

                      // Fetch user data if we don't have it
                      if (!currentState.user) {
                        try {
                          const userData = await getUserApi();
                          set({ user: userData });
                        } catch (error) {
                          console.warn(
                            "Failed to fetch user during initialization:",
                            error
                          );
                        }
                      }

                      scheduleAutoLogout(expiresIn, get().logout);
                      scheduleAutoRefresh(expiresIn, userRefreshAccessToken);
                    }
                  } catch (tokenError) {
                    console.error("Failed to decode stored token:", tokenError);
                    httpService.clearTokens(ClientType.USER);
                  }
                }
              }
            } catch (error) {
              console.error("Auth initialization error:", error);
              get().logout();
            } finally {
              set({ isAuthReady: true });
            }
          },

          login: async (email, password) => {
            set({ isLoading: true });
            try {
              console.log("Starting login process...");
              const response = await loginApi(email, password);
              const accessToken = response.accessToken || response.token;
              const expiresIn = response.expiresIn || 900;
              const user = response.user;

              if (!isValidJwt(accessToken)) {
                throw new Error("Invalid access token received");
              }

              // Set tokens in httpService
              httpService.setTokens(ClientType.USER, {
                accessToken,
                refreshToken: response.refreshToken,
                expiresIn,
              });

              const expiryDate = calculateExpiryDate(expiresIn);

              scheduleAutoLogout(expiresIn, get().logout);
              scheduleAutoRefresh(expiresIn, userRefreshAccessToken);

              set({
                user,
                accessToken,
                isAuthenticated: true,
                expiryDate,
                isLoading: false,
                isAuthReady: true,
              });

              console.log("Login successful");
              return user;
            } catch (error) {
              console.error("Login failed:", error);
              set({ isLoading: false, isAuthReady: true });
              toast.error(
                error.response?.data?.error ||
                  error.response?.data?.message ||
                  error.message ||
                  "Login failed. Please try again."
              );
              throw error;
            }
          },

          loginWithToken: async (jwt, expiresIn = 900) => {
            set({ isLoading: true });
            try {
              console.log("Starting login with token...");
              if (!isValidJwt(jwt)) throw new Error("Invalid JWT token format");

              // Set tokens in httpService
              httpService.setTokens(ClientType.USER, {
                accessToken: jwt,
                expiresIn,
              });

              const expiryDate = calculateExpiryDate(expiresIn);

              scheduleAutoLogout(expiresIn, get().logout);
              scheduleAutoRefresh(expiresIn, userRefreshAccessToken);

              let user = null;
              try {
                user = await getUserApi();
              } catch (getUserError) {
                console.warn(
                  "Failed to get user data during token login:",
                  getUserError
                );
              }

              set({
                user,
                accessToken: jwt,
                isAuthenticated: true,
                expiryDate,
                isLoading: false,
                isAuthReady: true,
              });

              console.log("Login with token successful");
              return user;
            } catch (error) {
              console.error("Login with token failed:", error);
              set({ isLoading: false, isAuthReady: true });
              toast.error("Authentication failed. Please log in again.");
              throw error;
            }
          },

          logout: async () => {
            console.log("Starting logout...");
            clearLogoutTimer();
            clearRefreshTimer();

            secureStorage.setItem("auth-logout", Date.now().toString());

            try {
              await logoutApi();
            } catch (error) {
              console.warn("Logout API call failed:", error);
            }

            // Clear tokens from httpService
            httpService.clearTokens(ClientType.USER);

            set({
              user: null,
              accessToken: null,
              expiryDate: null,
              isAuthenticated: false,
              isLoading: false,
              isAuthReady: true,
              isRefreshing: false,
              refreshPromise: null,
            });

            console.log("Logout completed");
          },

          refreshAccessToken: userRefreshAccessToken,

          setUser: (user) => set({ user }),

          getUser: async () => {
            const currentState = get();
            if (currentState.isLoading) return currentState.user;

            set({ isLoading: true });
            try {
              const user = await getUserApi();
              set({ user, isLoading: false });
              return user;
            } catch (error) {
              console.error("Failed to get user:", error);
              set({ isLoading: false });

              if (error.response?.status !== 401) {
                toast.error("Failed to load user data.");
              }
              throw error;
            }
          },

          checkTokenExpiry: () => {
            const { expiryDate, isAuthenticated } = get();
            if (!isAuthenticated || !expiryDate) return false;

            const timeToExpiry = expiryDate - Date.now();
            const shouldRefresh = timeToExpiry < 120000;

            if (shouldRefresh && timeToExpiry > 0) {
              console.log("Token expiring soon, refreshing...");
              userRefreshAccessToken().catch(console.error);
            }

            return timeToExpiry > 0;
          },
        };
      },
      {
        name: "auth-store",
        storage: secureStorage,
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
          expiryDate: state.expiryDate,
        }),
        onRehydrateStorage: () => (state, error) => {
          console.log("Rehydrating auth store...");

          if (error) {
            console.error("Auth store rehydration error:", error);
            if (state) {
              state.isAuthReady = false;
              state.user = null;
              state.accessToken = null;
              state.isAuthenticated = false;
              state.expiryDate = null;
            }
            return;
          }

          if (!state) {
            console.warn("No state to rehydrate");
            return;
          }

          // Don't set isAuthReady here - let initialize() handle it
          state.isAuthReady = false;
          state.isLoading = false;
          state.isRefreshing = false;
          state.refreshPromise = null;

          console.log("Auth store rehydration completed, state:", {
            hasUser: !!state.user,
            hasToken: !!state.accessToken,
            isAuthenticated: state.isAuthenticated,
            expiryDate: state.expiryDate
              ? new Date(state.expiryDate).toISOString()
              : null,
          });
        },
      }
    )
  );

// === Multi-tab sync ===
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "auth-logout") {
      console.log("Logout event detected from another tab");
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      const state = authStore.getState();
      if (!state.checkTokenExpiry()) {
        state.refreshAccessToken().catch(console.error);
      }
    }
  });
}
