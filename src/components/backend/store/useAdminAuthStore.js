import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import { adminHttpService } from "../../../services/httpService";
import {
  adminlogin,
  adminlogout,
  getCurrentUser,
  adminRefreshTokenApi,
} from "../../../services/adminAuthService";

const calculateExpiryDate = (expiresInSeconds) =>
  Date.now() + expiresInSeconds * 1000;

// Custom storage for multi-tab synchronization
const secureStorage = {
  getItem: (name) => localStorage.getItem(name),
  setItem: (name, value) => {
    localStorage.setItem(name, value);
    window.dispatchEvent(
      new CustomEvent("adminAuthStorage", { detail: { name, value } })
    );
  },
  removeItem: (name) => {
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
      loading: true,
      accessToken: null,
      expiryDate: null,

      setTokens: (accessToken, expiresIn) => {
        set({
          accessToken,
          expiryDate: calculateExpiryDate(expiresIn),
          isAuthenticated: true,
        });
      },

      fetchAdminUser: async (navigate, currentPath) => {
        if (currentPath === "/admin/login") return; // Prevent loop on login page
        set({ loading: true });
        try {
          const user = await getCurrentUser();
          if (user) {
            set({ adminUser: user, isAuthenticated: true });
          } else {
            set({ adminUser: null, isAuthenticated: false });
            navigate("/admin/login");
          }
        } catch (err) {
          set({ adminUser: null, isAuthenticated: false });
          navigate("/admin/login");
          toast.error("Failed to load admin user. Please log in again.");
        } finally {
          set({ loading: false });
        }
      },

      login: async (email, password, navigate) => {
        set({ loading: true });
        try {
          const { accessToken, expiresIn } = await adminlogin(email, password);
          const user = await getCurrentUser();
          if (!user) throw new Error("Failed to fetch user after login");
          set({
            adminUser: user,
            accessToken,
            expiryDate: calculateExpiryDate(expiresIn),
            isAuthenticated: true,
            loading: false,
          });
          navigate("/admin");
        } catch (err) {
          set({ loading: false, isAuthenticated: false });
          toast.error(
            err.response?.data?.message || "Login failed. Please try again."
          );
          throw err;
        }
      },

      logout: async () => {
        try {
          await adminlogout();
          set({
            adminUser: null,
            accessToken: null,
            expiryDate: null,
            isAuthenticated: false,
          });
        } catch (err) {
          console.error("Logout failed:", err);
          toast.error("Logout failed. Please try again.");
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
        } catch (err) {
          set({ accessToken: null, expiryDate: null, isAuthenticated: false });
          toast.error("Session expired. Please log in again.");
          throw err;
        }
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
      }),
    }
  )
);
