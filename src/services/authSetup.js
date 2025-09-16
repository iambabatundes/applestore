import {
  initializeInterceptors,
  setUserTokens,
  setAdminTokens,
} from "./http/httpService";
import { createAuthStore } from "../components/home/store/useAuthStore";
import { useAdminAuthStore } from "../components/backend/store/useAdminAuthStore";
import { loginApi, refreshTokenApi, logoutApi, getUserApi } from "./apiService";
import {
  adminlogin,
  adminRefreshTokenApi,
  adminlogout,
  getCurrentUser,
} from "./adminAuthService";

// Create user auth store
export const authStore = createAuthStore({
  loginApi,
  refreshTokenApi,
  logoutApi,
  getUserApi,
});

export const authAdminStore = createAuthStore({
  adminlogin,
  adminRefreshTokenApi,
  adminlogout,
  getCurrentUser,
});

// Initialize interceptors
initializeInterceptors({
  userRefreshAccessToken: authStore.getState().refreshAccessToken,
  adminRefreshAccessToken: useAdminAuthStore.getState().refreshAccessToken,
});

// Sync Zustand state with httpService token storage
authStore.subscribe((state) => {
  if (state.accessToken && state.expiryDate) {
    setUserTokens(state.accessToken, (state.expiryDate - Date.now()) / 1000);
  }
});

useAdminAuthStore.subscribe((state) => {
  if (state.accessToken && state.expiryDate) {
    setAdminTokens(state.accessToken, (state.expiryDate - Date.now()) / 1000);
  }
});
