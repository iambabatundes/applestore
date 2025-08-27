import { toast } from "react-toastify";
import { getAccessToken, getExpiryDate, isValidJwt } from "./tokenManager";
import { handleApiError } from "./errorHandler";

export const setupInterceptors = (client, role, refreshAccessToken) => {
  client.interceptors.request.use(
    async (config) => {
      let token = getAccessToken(role);
      const expiryDate = getExpiryDate(role);

      if (expiryDate && Date.now() > expiryDate) {
        try {
          await refreshAccessToken();
          token = getAccessToken(role);
        } catch {
          console.warn(`${role} token refresh failed`);
        }
      }

      if (isValidJwt(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      const isUnauthorized =
        error.response?.status === 401 && !originalRequest._retry;

      if (isUnauthorized) {
        originalRequest._retry = true;
        try {
          await refreshAccessToken();
          const newToken = getAccessToken(role);
          if (isValidJwt(newToken)) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return client(originalRequest);
          }
        } catch {
          toast.warn("Session expired. Please log in again.");
          window.location = role === "admin" ? "/admin/login" : "/login";
        }
      }

      handleApiError(error, role);
      return Promise.reject(error);
    }
  );
};
