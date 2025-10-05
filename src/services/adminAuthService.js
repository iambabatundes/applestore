import {
  adminLoginApi,
  adminRefreshTokenApi,
  adminLogoutApi,
  getAdminUserApi,
  checkAdminAuthStatusApi,
  getAdminAccessToken,
  isAdminTokenExpired,
  clearAdminTokens as clearTokens,
  getAdminTokens as getTokens,
} from "./adminApiService";

const { adminHttpService } = require("./http/index");

export const adminLogin = adminLoginApi;
export const adminRefreshTokenApi = adminRefreshTokenApi;
export const adminlogout = adminLogoutApi;
export const getCurrentUser = getAdminUserApi;
export const checkAuthStatus = checkAdminAuthStatusApi;
export const getAdminTokens = getTokens;
export const clearAdminTokens = clearTokens;
export const isTokenExpired = isAdminTokenExpired;

export function setAdminTokens(
  accessToken,
  expiresIn,
  refreshToken = null,
  rememberMe = false
) {
  console.warn(
    "setAdminTokens is deprecated - tokens are now managed by adminHttpService"
  );

  const actualExpiresIn = rememberMe ? 30 * 24 * 60 * 60 : expiresIn;

  adminHttpService.setTokens({
    accessToken,
    refreshToken,
    expiresIn: actualExpiresIn,
  });
}
