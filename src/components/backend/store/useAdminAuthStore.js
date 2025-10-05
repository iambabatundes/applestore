import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { toast } from "react-toastify";
import {
  adminLoginApi,
  adminRefreshTokenApi,
  adminLogoutApi,
  getAdminUserApi,
  checkAdminAuthStatusApi,
  clearAdminTokens,
} from "../../backend/store/adminApiService";

const createSecureStorage = () => {
  const storage = {
    getItem: (name) => {
      try {
        const item = localStorage.getItem(name);
        if (!item) return null;

        // Try to parse as JSON first
        let parsed;
        try {
          parsed = JSON.parse(item);
        } catch (parseError) {
          // If parsing fails, return as-is (for backward compatibility)
          return item;
        }

        // Handle new format with expiration
        if (
          parsed &&
          typeof parsed === "object" &&
          parsed.value !== undefined
        ) {
          // Check for expiration
          if (parsed.expires && Date.now() > parsed.expires) {
            console.log(`Storage item ${name} expired, removing`);
            localStorage.removeItem(name);
            return null;
          }
          return parsed.value;
        }

        // Handle legacy format or plain objects
        return parsed;
      } catch (error) {
        console.error("Error reading from secure storage:", error);
        // Don't return null immediately, try to recover
        try {
          const rawItem = localStorage.getItem(name);
          return rawItem;
        } catch (recoveryError) {
          console.error("Recovery failed:", recoveryError);
          return null;
        }
      }
    },

    setItem: (name, value) => {
      try {
        // Only add expiration wrapper for new storage
        const item = {
          value,
          expires: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days max
          timestamp: Date.now(),
        };

        localStorage.setItem(name, JSON.stringify(item));

        // Dispatch event for cross-tab sync
        try {
          window.dispatchEvent(
            new CustomEvent("adminAuthUpdate", {
              detail: { key: name, value },
            })
          );
        } catch (eventError) {
          console.warn("Failed to dispatch storage event:", eventError);
        }
      } catch (error) {
        console.error("Error writing to secure storage:", error);
        // Try fallback storage without expiration wrapper
        try {
          localStorage.setItem(name, JSON.stringify(value));
        } catch (fallbackError) {
          console.error("Fallback storage failed:", fallbackError);
        }
      }
    },

    removeItem: (name) => {
      try {
        localStorage.removeItem(name);
        try {
          window.dispatchEvent(
            new CustomEvent("adminAuthUpdate", {
              detail: { key: name, value: null },
            })
          );
        } catch (eventError) {
          console.warn("Failed to dispatch removal event:", eventError);
        }
      } catch (error) {
        console.error("Error removing from secure storage:", error);
      }
    },
  };

  return storage;
};

// Token expiry calculation
const calculateExpiryDate = (expiresInSeconds) => {
  if (!expiresInSeconds || expiresInSeconds <= 0) return null;
  return Date.now() + expiresInSeconds * 1000;
};

// JWT validation
const isValidJwt = (token) => {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    // Check if it's properly base64 encoded
    const payload = JSON.parse(atob(parts[1]));
    return payload && payload.exp && payload.iat;
  } catch {
    return false;
  }
};

// Enhanced timer management
class TokenTimerManager {
  constructor() {
    this.logoutTimer = null;
    this.refreshTimer = null;
    this.activityTimer = null;
  }

  clearAll() {
    [this.logoutTimer, this.refreshTimer, this.activityTimer].forEach(
      (timer) => {
        if (timer) clearTimeout(timer);
      }
    );
    this.logoutTimer = this.refreshTimer = this.activityTimer = null;
  }

  scheduleLogout(expiresInSeconds, logoutFn) {
    this.clearLogout();
    if (expiresInSeconds <= 0) {
      logoutFn();
      return;
    }

    this.logoutTimer = setTimeout(() => {
      toast.warning("Your admin session has expired");
      logoutFn();
    }, expiresInSeconds * 1000);
  }

  scheduleRefresh(expiresInSeconds, refreshFn) {
    this.clearRefresh();
    // Refresh 2 minutes before expiry or immediately if less than 2 minutes
    const refreshTime = Math.max(0, (expiresInSeconds - 120) * 1000);

    this.refreshTimer = setTimeout(() => {
      refreshFn().catch(console.error);
    }, refreshTime);
  }

  clearLogout() {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }
  }

  clearRefresh() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}

// Create timer manager instance
const timerManager = new TokenTimerManager();

// Enhanced Admin Auth Store
export const useAdminAuthStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => {
        // Enhanced refreshAccessToken function for useAdminAuthStore.js
        // Replace your refreshAccessToken function with this version:

        const refreshAccessToken = async () => {
          const currentState = get();

          // Prevent multiple simultaneous refresh attempts
          if (currentState.isRefreshing) {
            console.log("Admin refresh already in progress");
            return currentState.refreshPromise;
          }

          const refreshPromise = (async () => {
            set({ isRefreshing: true });

            try {
              console.log("Starting admin token refresh...");

              const response = await adminRefreshTokenApi();
              const { accessToken, refreshToken, expiresIn = 3600 } = response;

              if (!isValidJwt(accessToken)) {
                throw new Error("Invalid access token received from refresh");
              }

              const newExpiryDate = calculateExpiryDate(expiresIn);
              let adminUser = currentState.adminUser;

              // Fetch fresh user data if needed
              if (!adminUser) {
                try {
                  adminUser = await getAdminUserApi();
                } catch (getUserError) {
                  console.warn(
                    "Failed to fetch admin user during refresh:",
                    getUserError
                  );
                  // Keep existing user if fetch fails
                }
              }

              // IMPORTANT: Update localStorage with new tokens
              localStorage.setItem("adminAccessToken", accessToken);
              localStorage.setItem(
                "adminTokenExpiry",
                newExpiryDate.toString()
              );
              if (refreshToken) {
                localStorage.setItem("adminRefreshToken", refreshToken);
              }

              // Update timers
              timerManager.scheduleLogout(expiresIn, get().logout);
              timerManager.scheduleRefresh(expiresIn, refreshAccessToken);

              // Update state
              set({
                adminUser,
                accessToken,
                expiryDate: newExpiryDate,
                isRefreshing: false,
                refreshPromise: null,
                isAuthenticated: true,
                lastRefreshedAt: Date.now(),
              });

              console.log(
                "Admin token refreshed successfully - tokens synchronized"
              );
              return { accessToken, expiresIn };
            } catch (error) {
              console.error("Admin token refresh failed:", error);
              set({ isRefreshing: false, refreshPromise: null });

              // Handle auth errors by clearing everything
              if ([401, 403].includes(error.response?.status)) {
                console.log("Auth error during refresh, clearing all tokens");

                // Clear localStorage tokens
                localStorage.removeItem("adminAccessToken");
                localStorage.removeItem("adminTokenExpiry");
                localStorage.removeItem("adminRefreshToken");

                toast.error(
                  "Your admin session has expired. Please log in again."
                );
                get().logout();
              }

              throw error;
            }
          })();

          set({ refreshPromise });
          return refreshPromise;
        };

        return {
          // State
          adminUser: null,
          accessToken: null,
          isAuthenticated: false,
          initialized: false,
          expiryDate: null,
          loading: false,
          isRefreshing: false,
          refreshPromise: null,
          fetchingUser: false,
          rememberMe: false,
          lastRefreshedAt: null,
          sessionId: null,

          initialize: async () => {
            const state = get();
            if (state.initialized) return;

            console.log("🔐 Initializing admin auth store...");
            set({ loading: true });

            try {
              // Step 1: Import HTTP service first
              const { adminHttpService } = await import(
                "../../../services/http/index"
              );

              // Step 2: Check for tokens in multiple locations with fallback recovery
              console.log("🔍 Checking token sources...");

              // Priority 1: Check Zustand persisted state first
              const storedToken = state.accessToken;
              const storedExpiry = state.expiryDate;
              const storedUser = state.adminUser;

              // Priority 2: Check localStorage directly
              const directToken = localStorage.getItem("adminAccessToken");
              const directExpiry = localStorage.getItem("adminTokenExpiry");

              // Priority 3: Check HTTP service token manager
              const httpServiceToken =
                adminHttpService.tokenManager?.getAccessToken();
              const httpServiceExpiry =
                adminHttpService.tokenManager?.getTokenExpiryDate();

              console.log("💾 Token sources found:", {
                storedToken: !!storedToken,
                storedExpiry: !!storedExpiry,
                directToken: !!directToken,
                directExpiry: !!directExpiry,
                httpServiceToken: !!httpServiceToken,
                httpServiceExpiry: !!httpServiceExpiry,
                storedUser: !!storedUser,
              });

              // Step 3: Determine the best token source and sync all locations
              let workingToken = null;
              let workingExpiry = null;

              // Use the most reliable source with valid expiry
              if (storedToken && storedExpiry && storedExpiry > Date.now()) {
                console.log("✅ Using Zustand stored tokens");
                workingToken = storedToken;
                workingExpiry = storedExpiry;
              } else if (directToken && directExpiry) {
                const expiryTime = parseInt(directExpiry);
                if (expiryTime > Date.now()) {
                  console.log("✅ Using localStorage tokens");
                  workingToken = directToken;
                  workingExpiry = expiryTime;

                  // Sync to Zustand state
                  set({
                    accessToken: directToken,
                    expiryDate: expiryTime,
                  });
                }
              } else if (
                httpServiceToken &&
                httpServiceExpiry &&
                httpServiceExpiry > Date.now()
              ) {
                console.log("✅ Using HTTP service tokens");
                workingToken = httpServiceToken;
                workingExpiry = httpServiceExpiry;

                // Sync to Zustand state
                set({
                  accessToken: httpServiceToken,
                  expiryDate: httpServiceExpiry,
                });
              }

              // Step 4: Clean up expired tokens from all locations
              if (!workingToken) {
                console.log("🧹 Cleaning up expired tokens from all sources");
                localStorage.removeItem("adminAccessToken");
                localStorage.removeItem("adminTokenExpiry");
                localStorage.removeItem("adminRefreshToken");
                adminHttpService.clearTokens();
              }

              // Step 5: If we have working tokens, sync them everywhere and verify
              if (workingToken && workingExpiry) {
                console.log(
                  "🔄 Synchronizing tokens across all storage locations"
                );

                // Sync to localStorage
                localStorage.setItem("adminAccessToken", workingToken);
                localStorage.setItem(
                  "adminTokenExpiry",
                  workingExpiry.toString()
                );

                // Sync to HTTP service with proper expiration
                const expiresIn = Math.floor(
                  (workingExpiry - Date.now()) / 1000
                );
                adminHttpService.setTokens({
                  accessToken: workingToken,
                  expiresIn: Math.max(1, expiresIn), // Ensure at least 1 second
                });

                // Step 6: Verify tokens with server (but don't fail completely if it fails)
                try {
                  console.log("🌐 Verifying tokens with server...");
                  const { isAuthenticated, user } =
                    await checkAdminAuthStatusApi();

                  if (isAuthenticated && user) {
                    console.log("✅ Server verification successful");

                    // Get potentially refreshed tokens
                    const currentToken =
                      adminHttpService.tokenManager?.getAccessToken();
                    const currentExpiry =
                      adminHttpService.tokenManager?.getTokenExpiryDate();

                    if (currentToken && currentExpiry) {
                      const expiresIn = Math.floor(
                        (currentExpiry - Date.now()) / 1000
                      );

                      // Set up timers
                      timerManager.scheduleLogout(expiresIn, get().logout);
                      timerManager.scheduleRefresh(
                        expiresIn,
                        refreshAccessToken
                      );

                      // Update state with verified data
                      set({
                        adminUser: user,
                        accessToken: currentToken,
                        expiryDate: currentExpiry,
                        isAuthenticated: true,
                        sessionId: crypto.randomUUID(),
                        lastRefreshedAt: Date.now(),
                      });

                      // Ensure localStorage is synchronized
                      localStorage.setItem("adminAccessToken", currentToken);
                      localStorage.setItem(
                        "adminTokenExpiry",
                        currentExpiry.toString()
                      );

                      console.log(
                        "✅ Admin auth initialized successfully with valid session"
                      );
                      return;
                    }
                  }

                  // If verification fails but we had tokens, keep them but mark as potentially invalid
                  console.log(
                    "⚠️ Server verification failed, keeping existing tokens for now"
                  );
                  set({
                    adminUser: storedUser, // Keep existing user if we had one
                    accessToken: workingToken,
                    expiryDate: workingExpiry,
                    isAuthenticated: !!storedUser, // Only authenticated if we have user data
                    sessionId: state.sessionId || crypto.randomUUID(),
                    lastRefreshedAt: state.lastRefreshedAt,
                  });
                } catch (verificationError) {
                  console.warn(
                    "⚠️ Token verification failed, but keeping tokens for retry:",
                    verificationError
                  );

                  // Keep tokens but mark as not authenticated until verified
                  set({
                    adminUser: storedUser,
                    accessToken: workingToken,
                    expiryDate: workingExpiry,
                    isAuthenticated: false, // Will be set to true on successful operation
                    sessionId: state.sessionId,
                    lastRefreshedAt: state.lastRefreshedAt,
                  });
                }
              } else {
                console.log("ℹ️ No valid tokens found - user needs to login");

                // Clear all state but don't remove persisted user info unnecessarily
                set({
                  adminUser: null,
                  accessToken: null,
                  isAuthenticated: false,
                  expiryDate: null,
                  sessionId: null,
                  lastRefreshedAt: null,
                });
              }
            } catch (error) {
              console.error("❌ Admin auth initialization failed:", error);

              // Don't clear everything on init failure - might be network issue
              console.log(
                "🔄 Initialization failed, will retry on next operation"
              );
            } finally {
              set({
                initialized: true,
                loading: false,
              });
            }
          },

          login: async (
            email,
            password,
            navigate,
            totpCode = null,
            backupCode = null,
            rememberMe = false
          ) => {
            set({ loading: true });

            try {
              console.log("Starting admin login...");

              const response = await adminLoginApi(
                email,
                password,
                totpCode,
                backupCode,
                rememberMe
              );

              // Handle 2FA requirement
              if (response.requires2FA) {
                set({ loading: false });
                return {
                  success: false,
                  requires2FA: true,
                  message: response.message,
                  errorCode: response.errorCode,
                };
              }

              const {
                accessToken,
                refreshToken,
                expiresIn = 3600,
                user,
              } = response;

              if (!isValidJwt(accessToken)) {
                throw new Error("Invalid access token received from login");
              }

              // Ensure user data is available
              let adminUser = user;
              if (!adminUser) {
                try {
                  console.log("📡 Fetching admin user data after login...");
                  adminUser = await getAdminUserApi();
                } catch (getUserError) {
                  console.error(
                    "Failed to fetch user data after login:",
                    getUserError
                  );
                  throw new Error(
                    "Login succeeded but failed to get user data"
                  );
                }
              }

              const expiryDate = calculateExpiryDate(expiresIn);
              const sessionId = crypto.randomUUID();

              // CRITICAL: Synchronize tokens to ALL storage locations
              console.log("🔄 Synchronizing tokens to all storage locations");

              // 1. localStorage (primary source of truth)
              localStorage.setItem("adminAccessToken", accessToken);
              localStorage.setItem("adminTokenExpiry", expiryDate.toString());
              if (refreshToken) {
                localStorage.setItem("adminRefreshToken", refreshToken);
              }

              // 2. HTTP Service (already done in adminLoginApi, but verify)
              const { adminHttpService } = await import(
                "../../../services/http/index"
              );

              const currentToken =
                adminHttpService.tokenManager?.getAccessToken();
              if (!currentToken || currentToken !== accessToken) {
                console.log("🔧 Re-syncing tokens to HTTP service");
                adminHttpService.setTokens({
                  accessToken,
                  refreshToken,
                  expiresIn,
                });
              }

              // Verify synchronization
              const verifyToken =
                adminHttpService.tokenManager?.getAccessToken();
              const verifyLocalStorage =
                localStorage.getItem("adminAccessToken");

              console.log("✅ Token synchronization verified:", {
                httpService: verifyToken === accessToken,
                localStorage: verifyLocalStorage === accessToken,
                zustandState: true, // Will be set below
              });

              if (verifyToken !== accessToken) {
                console.error("❌ HTTP Service token mismatch!");
                throw new Error("Token synchronization failed");
              }

              // Set up timers
              timerManager.scheduleLogout(expiresIn, get().logout);
              timerManager.scheduleRefresh(expiresIn, refreshAccessToken);

              // 3. Update Zustand state LAST (after all other storage is confirmed)
              set({
                adminUser,
                accessToken,
                isAuthenticated: true,
                expiryDate,
                loading: false,
                initialized: true,
                rememberMe,
                sessionId,
                lastRefreshedAt: Date.now(),
              });

              console.log(
                "✅ Admin login successful - all tokens synchronized"
              );
              toast.success("Login successful!");

              // Navigate after successful login
              if (navigate) {
                navigate("/admin/home", { replace: true });
              }

              return { success: true, user: adminUser };
            } catch (error) {
              console.error("Admin login failed:", error);

              // Clear any partial state from ALL locations
              localStorage.removeItem("adminAccessToken");
              localStorage.removeItem("adminTokenExpiry");
              localStorage.removeItem("adminRefreshToken");

              try {
                const { adminHttpService } = await import(
                  "../../../services/http/index"
                );
                adminHttpService.clearTokens();
              } catch (clearError) {
                console.warn(
                  "Failed to clear HTTP service tokens:",
                  clearError
                );
              }

              set({ loading: false, initialized: true });

              const errorMessage =
                error.message || "Login failed. Please try again.";
              toast.error(errorMessage);

              return {
                success: false,
                error: errorMessage,
                errorCode: error.code || "ADMIN_LOGIN_FAILED",
                status: error.response?.status,
              };
            }
          },

          logout: async (navigate = null, isManual = true) => {
            console.log("Starting admin logout...");

            timerManager.clearAll();

            try {
              await adminLogoutApi();
            } catch (error) {
              console.warn("Admin logout API call failed:", error);
            }

            clearAdminTokens();

            try {
              localStorage.removeItem("adminAccessToken");
              localStorage.removeItem("adminTokenExpiry");
              localStorage.removeItem("adminRefreshToken");
              console.log("Cleared localStorage admin tokens");
            } catch (error) {
              console.error("Failed to clear localStorage tokens:", error);
            }

            try {
              const storage = createSecureStorage();
              storage.removeItem("admin-auth-store");
              console.log("Cleared Zustand persisted storage");
            } catch (error) {
              console.error("Failed to clear Zustand storage:", error);
            }

            set({
              adminUser: null,
              accessToken: null,
              expiryDate: null,
              isAuthenticated: false,
              loading: false,
              initialized: true,
              isRefreshing: false,
              refreshPromise: null,
              rememberMe: false,
              sessionId: null,
              lastRefreshedAt: null,
            });

            const message = isManual
              ? "You have been successfully logged out."
              : "Your session has expired. Please log in again.";

            localStorage.setItem("adminLogoutMessage", message);
            localStorage.setItem(
              "adminLogoutType",
              isManual ? "manual" : "automatic"
            );

            // Dispatch cross-tab logout event
            try {
              window.dispatchEvent(
                new CustomEvent("adminAuthUpdate", {
                  detail: { key: "admin-auth-store", value: null },
                })
              );
            } catch (eventError) {
              console.warn("Failed to dispatch logout event:", eventError);
            }

            console.log("Admin logout completed - all tokens cleared");

            // Handle navigation safely
            if (navigate && typeof navigate === "function") {
              navigate("/admin/login", { replace: true });
            } else if (typeof window !== "undefined") {
              // Fallback to window.location when navigate is not available
              window.location.href = "/admin/login";
            }
          },

          // Token refresh
          refreshAccessToken,

          // Enhanced user fetching
          fetchAdminUser: async () => {
            const state = get();
            if (state.fetchingUser || state.loading) {
              return state.adminUser;
            }

            set({ fetchingUser: true });

            try {
              const user = await getAdminUserApi();

              if (user) {
                set({
                  adminUser: user,
                  isAuthenticated: true,
                  fetchingUser: false,
                });
                return user;
              } else {
                set({
                  adminUser: null,
                  isAuthenticated: false,
                  fetchingUser: false,
                });
                return null;
              }
            } catch (error) {
              console.error("Fetch admin user failed:", error);
              set({
                adminUser: null,
                isAuthenticated: false,
                fetchingUser: false,
              });
              return null;
            }
          },

          // Enhanced token expiry check
          checkTokenExpiry: () => {
            const { expiryDate, isAuthenticated } = get();
            if (!isAuthenticated || !expiryDate) return false;

            const timeToExpiry = expiryDate - Date.now();

            // Auto-refresh if expiring soon
            if (timeToExpiry < 120000 && timeToExpiry > 0) {
              console.log("Token expiring soon, refreshing...");
              refreshAccessToken().catch(console.error);
            }

            return timeToExpiry > 0;
          },

          // Utility methods
          shouldRedirectToLogin: () => {
            const state = get();
            return (
              !state.isAuthenticated &&
              !state.loading &&
              !state.fetchingUser &&
              state.initialized
            );
          },

          setUser: (adminUser) => {
            set({ adminUser });
          },

          reset: () => {
            timerManager.clearAll();
            set({
              adminUser: null,
              isAuthenticated: false,
              loading: false,
              accessToken: null,
              expiryDate: null,
              initialized: false,
              fetchingUser: false,
              rememberMe: false,
              isRefreshing: false,
              refreshPromise: null,
              sessionId: null,
              lastRefreshedAt: null,
            });
            clearAdminTokens();
          },
        };
      },
      {
        name: "admin-auth-store",
        storage: createSecureStorage(),
        partialize: (state) => ({
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
          expiryDate: state.expiryDate,
          rememberMe: state.rememberMe,
          adminUser: state.adminUser,
          sessionId: state.sessionId,
          lastRefreshedAt: state.lastRefreshedAt,
        }),
        onRehydrateStorage: () => (state, error) => {
          console.log("🔄 Rehydrating admin auth store...");

          if (error) {
            console.error("❌ Admin auth store rehydration error:", error);
            // Don't completely fail - try to recover
            return;
          }

          if (state) {
            console.log("💾 Rehydrated state:", {
              hasToken: !!state.accessToken,
              hasUser: !!state.adminUser,
              isAuthenticated: state.isAuthenticated,
              expiryDate: state.expiryDate,
            });

            // Reset transient state
            state.initialized = false;
            state.loading = false;
            state.isRefreshing = false;
            state.refreshPromise = null;
            state.fetchingUser = false;

            // CRITICAL: Don't clear valid tokens during rehydration
            // Only clear if tokens are clearly expired
            if (state.accessToken && state.expiryDate) {
              const timeUntilExpiry = state.expiryDate - Date.now();

              if (timeUntilExpiry > 0) {
                console.log("✅ Valid tokens found during rehydration");

                // Ensure localStorage and HTTP service are synced
                try {
                  if (
                    !localStorage.getItem("adminAccessToken") &&
                    state.accessToken
                  ) {
                    console.log(
                      "🔄 Syncing tokens to localStorage during rehydration"
                    );
                    localStorage.setItem("adminAccessToken", state.accessToken);
                    localStorage.setItem(
                      "adminTokenExpiry",
                      state.expiryDate.toString()
                    );
                  }

                  // Import and sync to HTTP service
                  import("../../../services/http/index")
                    .then(({ adminHttpService }) => {
                      if (
                        adminHttpService &&
                        !adminHttpService.tokenManager?.getAccessToken()
                      ) {
                        console.log(
                          "🔄 Syncing tokens to HTTP service during rehydration"
                        );
                        const expiresIn = Math.floor(timeUntilExpiry / 1000);
                        adminHttpService.setTokens({
                          accessToken: state.accessToken,
                          expiresIn: Math.max(1, expiresIn),
                        });
                      }
                    })
                    .catch(console.error);
                } catch (syncError) {
                  console.warn(
                    "⚠️ Token sync failed during rehydration:",
                    syncError
                  );
                }
              } else {
                console.log("🧹 Clearing expired tokens during rehydration");
                // Only clear expired tokens
                state.accessToken = null;
                state.expiryDate = null;
                state.isAuthenticated = false;
                state.sessionId = null;
                state.lastRefreshedAt = null;

                // Clean localStorage
                localStorage.removeItem("adminAccessToken");
                localStorage.removeItem("adminTokenExpiry");
              }
            } else if (state.isAuthenticated && !state.accessToken) {
              // Fix inconsistent state
              console.log(
                "🔧 Fixing inconsistent auth state during rehydration"
              );
              state.isAuthenticated = false;
            }

            console.log("✅ Admin auth store rehydrated successfully");
          } else {
            console.log("⚠️ No state to rehydrate");
          }
        },

        recoverFromFailedInit: () => {
          const state = get();

          console.log("🔧 Attempting to recover from failed initialization");

          // Check if we have any valid tokens in localStorage
          const directToken = localStorage.getItem("adminAccessToken");
          const directExpiry = localStorage.getItem("adminTokenExpiry");

          if (directToken && directExpiry) {
            const expiryTime = parseInt(directExpiry);
            if (expiryTime > Date.now()) {
              console.log("🔄 Recovering tokens from localStorage");

              set({
                accessToken: directToken,
                expiryDate: expiryTime,
                // Don't set isAuthenticated=true until we verify
                initialized: true,
                loading: false,
              });

              // Try to sync to HTTP service
              import("../../../services/http/index")
                .then(({ adminHttpService }) => {
                  const expiresIn = Math.floor(
                    (expiryTime - Date.now()) / 1000
                  );
                  adminHttpService.setTokens({
                    accessToken: directToken,
                    expiresIn: Math.max(1, expiresIn),
                  });
                })
                .catch(console.error);

              return true;
            }
          }

          return false;
        },
      }
    )
  )
);

// Cross-tab synchronization
if (typeof window !== "undefined") {
  let isHandlingLogout = false;

  // Handle logout events from other tabs
  window.addEventListener("adminAuthUpdate", (e) => {
    const { key, value } = e.detail || {};

    if (key === "admin-auth-store" && !value) {
      // Store was cleared in another tab
      if (!isHandlingLogout) {
        isHandlingLogout = true;
        const { logout, isAuthenticated } = useAdminAuthStore.getState();

        if (isAuthenticated) {
          logout().finally(() => {
            isHandlingLogout = false;
          });
        } else {
          isHandlingLogout = false;
        }
      }
    }
  });

  // Cleanup on page unload
  window.addEventListener("beforeunload", () => {
    timerManager.clearAll();
  });

  // Handle visibility changes for token refresh
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      const { isAuthenticated, checkTokenExpiry, initialized } =
        useAdminAuthStore.getState();

      if (isAuthenticated && initialized) {
        checkTokenExpiry();
      }
    }
  });
}
