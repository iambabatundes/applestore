import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import {
  adminlogin,
  adminlogout,
  getCurrentUser,
  adminRefreshTokenApi,
  checkAuthStatus,
  clearAdminTokens,
} from "../../../services/adminAuthService";

const calculateExpiryDate = (expiresInSeconds) =>
  Date.now() + expiresInSeconds * 1000;

// Custom storage for multi-tab synchronization
const secureStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(name, value);
    window.dispatchEvent(
      new CustomEvent("adminAuthStorage", { detail: { name, value } })
    );
  },
  removeItem: (name) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(name);
    window.dispatchEvent(
      new CustomEvent("adminAuthStorage", { detail: { name, value: null } })
    );
  },
};

export const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      adminUser: null,
      isAuthenticated: false,
      loading: false,
      accessToken: null,
      expiryDate: null,
      initialized: false,
      fetchingUser: false, // NEW: Track if user fetch is in progress

      // Initialize the store
      initialize: async () => {
        if (get().initialized) return;

        set({ loading: true });

        try {
          const { isAuthenticated, user } = await checkAuthStatus();

          set({
            adminUser: user,
            isAuthenticated,
            initialized: true,
            loading: false,
          });
        } catch (error) {
          console.error("Store initialization error:", error);
          set({
            adminUser: null,
            isAuthenticated: false,
            initialized: true,
            loading: false,
          });
        }
      },

      setTokens: (accessToken, expiresIn) => {
        set({
          accessToken,
          expiryDate: calculateExpiryDate(expiresIn),
          isAuthenticated: true,
        });
      },

      // FIXED: Simplified fetchAdminUser without navigation logic
      fetchAdminUser: async () => {
        const state = get();

        // Prevent multiple simultaneous calls
        if (state.fetchingUser || state.loading) {
          return state.adminUser;
        }

        set({ fetchingUser: true });

        try {
          const user = await getCurrentUser();

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
          console.error("Fetch admin user error:", error);

          set({
            adminUser: null,
            isAuthenticated: false,
            fetchingUser: false,
          });

          return null;
        }
      },

      // FIXED: Improved login with better error handling
      login: async (email, password, navigate) => {
        if (get().loading) return;

        set({ loading: true });

        try {
          const { accessToken, expiresIn, user } = await adminlogin(
            email,
            password
          );

          // Fetch user data if not included in login response
          const adminUser = user || (await getCurrentUser());

          if (!adminUser) {
            throw new Error("Failed to fetch user data after login");
          }

          set({
            adminUser,
            accessToken,
            expiryDate: calculateExpiryDate(expiresIn),
            isAuthenticated: true,
            loading: false,
          });

          toast.success("Login successful!");

          // Navigate to dashboard after successful login
          if (navigate) {
            navigate("/admin/dashboard", { replace: true });
          }

          return { success: true, user: adminUser };
        } catch (error) {
          console.error("Login error:", error);

          set({
            loading: false,
            isAuthenticated: false,
            adminUser: null,
            accessToken: null,
            expiryDate: null,
          });

          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Login failed. Please try again.";

          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      logout: async (navigate, isManual = true) => {
        const currentState = get();

        try {
          // Only call server logout if we're authenticated
          if (currentState.isAuthenticated) {
            await adminlogout();
          }
        } catch (error) {
          console.error("Logout error:", error);
          // Continue with local cleanup even if server logout fails
        }

        // Clear all authentication data
        set({
          adminUser: null,
          accessToken: null,
          expiryDate: null,
          isAuthenticated: false,
        });

        // Clear tokens from localStorage
        clearAdminTokens();

        // Show logout message and redirect
        const message = isManual
          ? "You have been successfully logged out."
          : "Your session has expired. Please log in again.";

        if (navigate) {
          // Store logout message for display on login page
          localStorage.setItem("logoutMessage", message);
          localStorage.setItem("logoutType", isManual ? "manual" : "automatic");
          navigate("/admin/login", { replace: true });
        }
      },

      refreshAccessToken: async () => {
        try {
          const { accessToken, expiresIn } = await adminRefreshTokenApi();

          set({
            accessToken,
            expiryDate: calculateExpiryDate(expiresIn),
            isAuthenticated: true,
          });

          return { accessToken, expiresIn };
        } catch (error) {
          console.error("Token refresh error:", error);

          set({
            accessToken: null,
            expiryDate: null,
            isAuthenticated: false,
            adminUser: null,
          });

          clearAdminTokens();
          throw error;
        }
      },

      // Method to reset store (useful for testing or manual reset)
      reset: () => {
        set({
          adminUser: null,
          isAuthenticated: false,
          loading: false,
          accessToken: null,
          expiryDate: null,
          initialized: false,
          fetchingUser: false,
        });
        clearAdminTokens();
      },

      // NEW: Check if user should be redirected to login
      shouldRedirectToLogin: () => {
        const state = get();
        return !state.isAuthenticated && !state.loading && !state.fetchingUser;
      },
    }),
    {
      name: "admin-auth",
      storage: secureStorage,
      partialize: (state) => ({
        adminUser: state.adminUser,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        expiryDate: state.expiryDate,
        initialized: state.initialized,
      }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Verify token validity on rehydration
          if (state.expiryDate && Date.now() >= state.expiryDate) {
            state.isAuthenticated = false;
            state.adminUser = null;
            state.accessToken = null;
            state.expiryDate = null;
            clearAdminTokens();
          }
        }
      },
    }
  )
);

// Listen for storage events from other tabs
if (typeof window !== "undefined") {
  window.addEventListener("adminAuthStorage", (event) => {
    const { name, value } = event.detail;

    if (name === "admin-auth" && !value) {
      // Auth was cleared in another tab
      useAdminAuthStore.getState().reset();
    }
  });

  // Listen for storage events (cross-tab synchronization)
  window.addEventListener("storage", (event) => {
    if (event.key === "adminAccessToken" && !event.newValue) {
      // Token was cleared in another tab
      useAdminAuthStore.getState().reset();
    }
  });
}
