import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { adminlogout } from "../../../services/adminAuthService";
import { getAdminUser } from "../../../services/adminService";

let logoutTimer = null;
let listenersRegistered = false;

export const useAdminAuthStore = create((set, get) => ({
  adminUser: null,
  isAuthenticated: false,
  loading: true,

  // Fetch current admin user and set auth state
  fetchAdminUser: async (navigate) => {
    try {
      const token = localStorage.getItem("token");

      // Check for token expiration and refresh if needed
      if (token) {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          await get().refreshAccessToken(); // refresh access token if expired
        }
      }

      // Get admin user from API and set store state
      const user = await getAdminUser();
      set({ adminUser: user, isAuthenticated: true, loading: false });

      // Start inactivity timer and listeners
      get().setupInactivityMonitor(navigate);
    } catch (err) {
      console.error("Auth failed", err);
      set({ isAuthenticated: false, adminUser: null, loading: false });
      navigate("/admin/login");
    }
  },

  // Refresh access token using the refresh token from cookies
  refreshAccessToken: async () => {
    try {
      const { data } = await axios.post(
        "/admin/auth/refresh",
        {},
        { withCredentials: true }
      );
      localStorage.setItem("token", data.accessToken);
      set({ isAuthenticated: true });
    } catch (err) {
      console.error("Token refresh failed", err);
      await get().logout(true);
    }
  },

  // Logout function — handles both auto and manual logout
  logout: async (auto = false) => {
    if (auto) {
      localStorage.setItem("logoutType", "automatic");
      localStorage.setItem(
        "logoutMessage",
        "Session expired due to inactivity. Please login again."
      );
    } else {
      localStorage.setItem("logoutType", "manual");
      localStorage.setItem(
        "logoutMessage",
        "You have successfully logged out."
      );
    }

    clearTimeout(logoutTimer);
    get().removeActivityListeners();
    await adminlogout();

    localStorage.removeItem("token");
    set({ adminUser: null, isAuthenticated: false });
  },

  // Setup inactivity timer and event listeners
  setupInactivityMonitor: (navigate) => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(async () => {
      await get().logout(true);
      navigate("/admin/login");
    }, 3600000); // 1 hour = 3600000ms

    if (!listenersRegistered) {
      const events = ["mousemove", "keydown", "click", "scroll", "keypress"];
      const activityHandler = () => {
        clearTimeout(logoutTimer);
        logoutTimer = setTimeout(async () => {
          await get().logout(true);
          navigate("/admin/login");
        }, 3600000);
      };

      events.forEach((event) =>
        window.addEventListener(event, activityHandler)
      );
      listenersRegistered = true;

      // Multi-tab logout sync
      window.addEventListener("storage", (e) => {
        if (e.key === "token" && !e.newValue) {
          get().logout(true);
          navigate("/admin/login");
        }
      });
    }
  },

  // Clean up event listeners and timers
  removeActivityListeners: () => {
    const events = ["mousemove", "keydown", "click", "scroll", "keypress"];
    events.forEach((event) =>
      window.removeEventListener(event, get().resetInactivityTimer)
    );
    clearTimeout(logoutTimer);
    listenersRegistered = false;
  },
}));
