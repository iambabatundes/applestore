import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";

// ==================== CONFIGURATION ====================
const AUTH_CONFIG = {
  // Token management
  TOKEN_REFRESH_BUFFER: 2 * 60 * 1000, // Refresh 2 minutes before expiry
  TOKEN_CHECK_INTERVAL: 30 * 1000, // Check token every 30 seconds

  // Activity tracking
  IDLE_TIMEOUT: 30 * 60 * 1000, // 30 minutes of inactivity
  ACTIVITY_THROTTLE: 5 * 1000, // Throttle activity updates to every 5 seconds
  ACTIVITY_EVENTS: [
    "mousedown",
    "keydown",
    "scroll",
    "touchstart",
    "mousemove",
  ],

  // Session management
  SESSION_WARNING_TIME: 5 * 60 * 1000, // Warn 5 minutes before idle timeout
  AUTO_EXTEND_SESSION: true, // Auto-extend on activity

  // Retry logic
  MAX_REFRESH_RETRIES: 3,
  REFRESH_RETRY_DELAY: 1000, // Start with 1 second
};

// ==================== UTILITY FUNCTIONS ====================
const calculateExpiryDate = (expiresInSeconds) =>
  Date.now() + expiresInSeconds * 1000;

const isValidJwt = (token) => {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const base64UrlRegex = /^[A-Za-z0-9_-]+$/;
  return parts.every((part) => base64UrlRegex.test(part));
};

// ==================== SECURE STORAGE ====================
const secureStorage = {
  getItem: (name) => {
    try {
      const json = localStorage.getItem(name);
      return json ? JSON.parse(json) : null;
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

// ==================== ACTIVITY TRACKER ====================
class ActivityTracker {
  constructor(config) {
    this.config = config;
    this.lastActivity = Date.now();
    this.lastUpdateSent = Date.now();
    this.listeners = new Set();
    this.boundHandleActivity = this.handleActivity.bind(this);
    this.warningShown = false;
    this.warningTimeoutId = null;
  }

  start() {
    this.config.ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, this.boundHandleActivity, {
        passive: true,
      });
    });
    console.log("Activity tracking started");
  }

  stop() {
    this.config.ACTIVITY_EVENTS.forEach((event) => {
      window.removeEventListener(event, this.boundHandleActivity);
    });
    this.clearWarning();
    console.log("Activity tracking stopped");
  }

  handleActivity() {
    const now = Date.now();
    this.lastActivity = now;
    this.warningShown = false;
    this.clearWarning();

    // Throttle activity updates
    if (now - this.lastUpdateSent >= this.config.ACTIVITY_THROTTLE) {
      this.lastUpdateSent = now;
      this.notifyListeners();
    }
  }

  getTimeSinceLastActivity() {
    return Date.now() - this.lastActivity;
  }

  isIdle() {
    return this.getTimeSinceLastActivity() >= this.config.IDLE_TIMEOUT;
  }

  shouldShowWarning() {
    const timeUntilIdle =
      this.config.IDLE_TIMEOUT - this.getTimeSinceLastActivity();
    return (
      timeUntilIdle <= this.config.SESSION_WARNING_TIME && timeUntilIdle > 0
    );
  }

  clearWarning() {
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach((listener) =>
      listener({
        lastActivity: this.lastActivity,
        isIdle: this.isIdle(),
        timeSinceLastActivity: this.getTimeSinceLastActivity(),
      })
    );
  }

  reset() {
    this.lastActivity = Date.now();
    this.lastUpdateSent = Date.now();
    this.warningShown = false;
    this.clearWarning();
  }
}

// ==================== TIMER MANAGER ====================
class TimerManager {
  constructor() {
    this.timers = new Map();
  }

  set(name, callback, delay) {
    this.clear(name);
    const id = setTimeout(() => {
      this.timers.delete(name);
      callback();
    }, delay);
    this.timers.set(name, id);
    return id;
  }

  clear(name) {
    const id = this.timers.get(name);
    if (id) {
      clearTimeout(id);
      this.timers.delete(name);
    }
  }

  clearAll() {
    this.timers.forEach((id) => clearTimeout(id));
    this.timers.clear();
  }
}

// ==================== AUTH STORE ====================
export const createAuthStore = ({
  loginApi,
  refreshTokenApi,
  logoutApi,
  getUserApi,
  userHttpService,
}) => {
  const activityTracker = new ActivityTracker(AUTH_CONFIG);
  const timerManager = new TimerManager();

  return create(
    persist(
      (set, get) => {
        // ==================== TOKEN REFRESH LOGIC ====================
        const refreshAccessToken = async (retryCount = 0) => {
          const currentState = get();

          if (currentState.isRefreshing) {
            console.log("Refresh already in progress, waiting...");
            return currentState.refreshPromise;
          }

          console.log(`Token refresh attempt ${retryCount + 1}`);

          const refreshPromise = (async () => {
            set({ isRefreshing: true });

            try {
              const response = await refreshTokenApi();
              const accessToken = response.accessToken || response.token;
              const refreshToken = response.refreshToken;
              const expiresIn = response.expiresIn || 900;
              let user = response.user || currentState.user;

              if (!isValidJwt(accessToken)) {
                throw new Error("Invalid access token received from refresh");
              }

              userHttpService.setTokens({
                accessToken,
                refreshToken,
                expiresIn,
              });

              const newExpiryDate = calculateExpiryDate(expiresIn);

              // Fetch fresh user data if not in response
              if (!user) {
                try {
                  user = await getUserApi();
                } catch (getUserError) {
                  console.warn(
                    "Failed to fetch user during refresh:",
                    getUserError
                  );
                  user = currentState.user;
                }
              }

              // Schedule next refresh
              scheduleTokenRefresh(expiresIn);

              set({
                user,
                accessToken,
                expiryDate: newExpiryDate,
                isRefreshing: false,
                refreshPromise: null,
                isAuthenticated: true,
                lastTokenRefresh: Date.now(),
              });

              console.log("Token refreshed successfully");
              return { accessToken, expiresIn };
            } catch (error) {
              console.error(
                `Token refresh failed (attempt ${retryCount + 1}):`,
                error
              );
              set({ isRefreshing: false, refreshPromise: null });

              // Retry logic with exponential backoff
              if (retryCount < AUTH_CONFIG.MAX_REFRESH_RETRIES) {
                const delay =
                  AUTH_CONFIG.REFRESH_RETRY_DELAY * Math.pow(2, retryCount);
                console.log(`Retrying token refresh in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
                return refreshAccessToken(retryCount + 1);
              }

              // If all retries failed
              if (
                error.response?.status === 401 ||
                error.response?.status === 403
              ) {
                console.log("Auth error during refresh, logging out");
                toast.error("Your session has expired. Please log in again.");
                get().logout();
              } else {
                toast.warning(
                  "Connection issue. Your session may expire soon."
                );
              }

              throw error;
            }
          })();

          set({ refreshPromise });
          return refreshPromise;
        };

        // ==================== TIMER SCHEDULING ====================
        const scheduleTokenRefresh = (expiresInSeconds) => {
          timerManager.clear("tokenRefresh");

          const refreshTime =
            expiresInSeconds * 1000 - AUTH_CONFIG.TOKEN_REFRESH_BUFFER;

          if (refreshTime > 0) {
            timerManager.set(
              "tokenRefresh",
              () => {
                console.log("Scheduled token refresh triggered");
                refreshAccessToken().catch(console.error);
              },
              refreshTime
            );

            console.log(
              `Token refresh scheduled in ${refreshTime / 1000} seconds`
            );
          } else {
            console.log("Token expiring soon, refreshing immediately");
            refreshAccessToken().catch(console.error);
          }
        };

        const scheduleIdleCheck = () => {
          timerManager.clear("idleCheck");

          if (!AUTH_CONFIG.AUTO_EXTEND_SESSION) return;

          timerManager.set(
            "idleCheck",
            () => {
              const state = get();
              if (!state.isAuthenticated) return;

              if (activityTracker.isIdle()) {
                console.log("User is idle, logging out...");
                toast.info("You've been logged out due to inactivity.");
                get().logout();
              } else if (
                activityTracker.shouldShowWarning() &&
                !activityTracker.warningShown
              ) {
                activityTracker.warningShown = true;
                const minutesLeft = Math.ceil(
                  (AUTH_CONFIG.IDLE_TIMEOUT -
                    activityTracker.getTimeSinceLastActivity()) /
                    60000
                );
                toast.warning(
                  `You'll be logged out in ${minutesLeft} minute${
                    minutesLeft !== 1 ? "s" : ""
                  } due to inactivity.`,
                  { autoClose: 10000 }
                );
              }

              scheduleIdleCheck();
            },
            AUTH_CONFIG.TOKEN_CHECK_INTERVAL
          );
        };

        // ==================== ACTIVITY HANDLING ====================
        const handleUserActivity = () => {
          const state = get();
          if (!state.isAuthenticated) return;

          // Check if token needs refresh
          if (state.expiryDate) {
            const timeUntilExpiry = state.expiryDate - Date.now();
            if (
              timeUntilExpiry < AUTH_CONFIG.TOKEN_REFRESH_BUFFER &&
              timeUntilExpiry > 0
            ) {
              console.log("User active, refreshing token proactively");
              refreshAccessToken().catch(console.error);
            }
          }
        };

        // Subscribe to activity tracker
        activityTracker.subscribe(handleUserActivity);

        // ==================== STORE STATE & METHODS ====================
        return {
          // State
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isAuthReady: false,
          expiryDate: null,
          isLoading: false,
          isRefreshing: false,
          refreshPromise: null,
          lastActivity: Date.now(),
          lastTokenRefresh: null,

          // ==================== INITIALIZE ====================
          initialize: async () => {
            console.log("Initializing auth store...");

            try {
              const storedToken =
                userHttpService.tokenManager?.getAccessToken();
              const hasValidStoredToken =
                storedToken &&
                !userHttpService.tokenManager?.isTokenExpired() &&
                isValidJwt(storedToken);

              if (hasValidStoredToken) {
                console.log("Valid token found, restoring session...");

                try {
                  const payload = JSON.parse(atob(storedToken.split(".")[1]));
                  const expiryTimestamp = payload.exp * 1000;
                  const timeToExpiry = expiryTimestamp - Date.now();

                  if (timeToExpiry > 0) {
                    const expiresIn = Math.floor(timeToExpiry / 1000);

                    let userData = null;
                    try {
                      userData = await getUserApi();
                    } catch (error) {
                      console.warn(
                        "Failed to fetch user during initialization:",
                        error
                      );
                      const currentState = get();
                      if (currentState.user) {
                        userData = currentState.user;
                      }
                    }

                    if (userData) {
                      set({
                        user: userData,
                        accessToken: storedToken,
                        expiryDate: expiryTimestamp,
                        isAuthenticated: true,
                        lastActivity: Date.now(),
                      });

                      scheduleTokenRefresh(expiresIn);
                      scheduleIdleCheck();
                      activityTracker.start();

                      console.log("Session restored successfully");
                    }
                  } else {
                    console.log("Token expired, clearing session");
                    get().logout();
                  }
                } catch (tokenError) {
                  console.error("Failed to process stored token:", tokenError);
                  userHttpService.clearTokens();
                  get().logout();
                }
              } else {
                console.log("No valid session found");
                set({
                  user: null,
                  accessToken: null,
                  isAuthenticated: false,
                  expiryDate: null,
                });
              }
            } catch (error) {
              console.error("Auth initialization error:", error);
              get().logout();
            } finally {
              set({ isAuthReady: true });
            }
          },

          // ==================== LOGIN ====================
          login: async (email, password, rememberMe = false) => {
            set({ isLoading: true });

            try {
              console.log("Starting login process...");
              const response = await loginApi(email, password);
              const accessToken = response.accessToken || response.token;
              const refreshToken = response.refreshToken;
              const expiresIn = response.expiresIn || 900;
              let user = response.user;

              if (!isValidJwt(accessToken)) {
                throw new Error("Invalid access token received");
              }

              userHttpService.setTokens({
                accessToken,
                refreshToken,
                expiresIn,
              });

              if (!user) {
                try {
                  user = await getUserApi();
                } catch (getUserError) {
                  console.warn(
                    "Failed to fetch user after login:",
                    getUserError
                  );
                  throw new Error(
                    "Login succeeded but failed to get user data"
                  );
                }
              }

              const expiryDate = calculateExpiryDate(expiresIn);

              scheduleTokenRefresh(expiresIn);
              scheduleIdleCheck();
              activityTracker.reset();
              activityTracker.start();

              set({
                user,
                accessToken,
                isAuthenticated: true,
                expiryDate,
                isLoading: false,
                isAuthReady: true,
                lastActivity: Date.now(),
                lastTokenRefresh: Date.now(),
              });

              toast.success("Welcome back!");
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

          // ==================== LOGIN WITH TOKEN ====================
          loginWithToken: async (jwt, expiresIn = 900) => {
            set({ isLoading: true });

            try {
              console.log("Starting login with token...");
              if (!isValidJwt(jwt)) throw new Error("Invalid JWT token format");

              userHttpService.setTokens({
                accessToken: jwt,
                expiresIn,
              });

              const expiryDate = calculateExpiryDate(expiresIn);

              let user = null;
              try {
                user = await getUserApi();
              } catch (getUserError) {
                console.warn(
                  "Failed to get user data during token login:",
                  getUserError
                );
                if (getUserError.code !== "ECONNABORTED") {
                  throw getUserError;
                }
              }

              scheduleTokenRefresh(expiresIn);
              scheduleIdleCheck();
              activityTracker.reset();
              activityTracker.start();

              set({
                user,
                accessToken: jwt,
                isAuthenticated: !!user,
                expiryDate,
                isLoading: false,
                isAuthReady: true,
                lastActivity: Date.now(),
                lastTokenRefresh: Date.now(),
              });

              console.log("Login with token successful");
              return user;
            } catch (error) {
              console.error("Login with token failed:", error);
              set({ isLoading: false, isAuthReady: true });

              if (!error.code?.includes("ECONNABORTED")) {
                toast.error("Authentication failed. Please log in again.");
              }
              throw error;
            }
          },

          // ==================== LOGOUT ====================
          logout: async (showMessage = true) => {
            console.log("Starting logout...");

            timerManager.clearAll();
            activityTracker.stop();
            activityTracker.reset();

            secureStorage.setItem("auth-logout", Date.now().toString());

            try {
              await logoutApi();
            } catch (error) {
              console.warn("Logout API call failed:", error);
            }

            userHttpService.clearTokens();

            set({
              user: null,
              accessToken: null,
              expiryDate: null,
              isAuthenticated: false,
              isLoading: false,
              isAuthReady: true,
              isRefreshing: false,
              refreshPromise: null,
              lastActivity: Date.now(),
              lastTokenRefresh: null,
            });

            if (showMessage) {
              toast.info("You've been logged out.");
            }

            console.log("Logout completed");
          },

          // ==================== REFRESH TOKEN ====================
          refreshAccessToken,

          // ==================== SET USER ====================
          setUser: (user) => {
            console.log("Setting user data:", user);
            set({ user });
          },

          // ==================== GET USER ====================
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

          // ==================== CHECK TOKEN EXPIRY ====================
          checkTokenExpiry: () => {
            const { expiryDate, isAuthenticated } = get();
            if (!isAuthenticated || !expiryDate) return false;

            const timeToExpiry = expiryDate - Date.now();

            if (timeToExpiry <= 0) {
              console.log("Token expired");
              get().logout();
              return false;
            }

            if (timeToExpiry < AUTH_CONFIG.TOKEN_REFRESH_BUFFER) {
              console.log("Token expiring soon, refreshing...");
              refreshAccessToken().catch(console.error);
            }

            return true;
          },

          // ==================== EXTEND SESSION ====================
          extendSession: () => {
            activityTracker.reset();
            const state = get();

            if (state.isAuthenticated && state.expiryDate) {
              const timeUntilExpiry = state.expiryDate - Date.now();
              if (timeUntilExpiry < AUTH_CONFIG.TOKEN_REFRESH_BUFFER * 2) {
                console.log("Extending session with token refresh");
                refreshAccessToken().catch(console.error);
              }
            }
          },

          // ==================== GET ACTIVITY INFO ====================
          getActivityInfo: () => ({
            lastActivity: activityTracker.lastActivity,
            timeSinceLastActivity: activityTracker.getTimeSinceLastActivity(),
            isIdle: activityTracker.isIdle(),
            idleTimeout: AUTH_CONFIG.IDLE_TIMEOUT,
          }),
        };
      },
      {
        name: "auth-store",
        storage: secureStorage,
        partialize: (state) => ({
          accessToken: state.accessToken,
          isAuthenticated: state.isAuthenticated,
          expiryDate: state.expiryDate,
          user: state.user,
          lastActivity: state.lastActivity,
          lastTokenRefresh: state.lastTokenRefresh,
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

          state.isAuthReady = false;
          state.isLoading = false;
          state.isRefreshing = false;
          state.refreshPromise = null;

          console.log("Auth store rehydration completed");
        },
      }
    )
  );
};

export { AUTH_CONFIG };
