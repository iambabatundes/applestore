import { adminHttpService } from "../services/http/index";

const endPoint = "/api/admins/auth";
const endPointMe = "/api/admins/auth"; // FIXED: Changed from "/api/admins" to "/api/admins/auth"
const adminRefreshEndPoint = "/api/admins/auth/refresh"; // FIXED: Use full path

// Token management functions (unchanged)
function setAdminTokens(accessToken, expiresIn) {
  if (typeof window !== "undefined") {
    localStorage.setItem("adminAccessToken", accessToken);
    const expiryDate = Date.now() + expiresIn * 1000;
    localStorage.setItem("adminTokenExpiry", expiryDate.toString());
  }
}

function getAdminTokens() {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("adminAccessToken");
    const expiryDate = localStorage.getItem("adminTokenExpiry");
    return {
      accessToken,
      expiryDate: expiryDate ? parseInt(expiryDate) : null,
    };
  }
  return { accessToken: null, expiryDate: null };
}

function clearAdminTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminTokenExpiry");
  }
}

function isTokenExpired() {
  const { expiryDate } = getAdminTokens();
  return !expiryDate || Date.now() >= expiryDate;
}

async function adminlogin(email, password) {
  try {
    const response = await adminHttpService.post(endPoint, { email, password });

    // Handle different response structures
    let data = response.data;

    // Check if response is wrapped in sendSuccessResponse format
    if (data.success && data.data) {
      data = data.data;
      console.log("Admin login response (unwrapped):", data);
    } else {
      console.log("Admin login response (direct):", data);
    }

    // Check for access token in the data
    if (!data.accessToken) {
      console.error("Response structure:", response.data);
      throw new Error("No access token received from server");
    }

    const expiresIn = data.expiresIn || 3600;

    // Set tokens in localStorage
    setAdminTokens(data.accessToken, expiresIn);

    return {
      accessToken: data.accessToken,
      expiresIn,
      user: data.admin || data.user,
    };
  } catch (error) {
    console.error("Admin login error:", error);
    console.error("Response data:", error.response?.data);
    throw error;
  }
}

async function adminRefreshTokenApi() {
  try {
    console.log("Refreshing admin token at:", adminRefreshEndPoint);

    const response = await adminHttpService.post(
      adminRefreshEndPoint,
      {},
      { withCredentials: true }
    );

    // Handle different response structures
    let data = response.data;

    if (data.success && data.data) {
      data = data.data;
      console.log("Admin refresh response (unwrapped):", data);
    } else {
      console.log("Admin refresh response (direct):", data);
    }

    if (!data.accessToken) {
      console.error("Refresh response structure:", response.data);
      throw new Error("No access token received from refresh");
    }

    const expiresIn = data.expiresIn || 3600;

    // Update tokens
    setAdminTokens(data.accessToken, expiresIn);

    return {
      accessToken: data.accessToken,
      expiresIn,
    };
  } catch (error) {
    console.error("Token refresh error:", error);
    console.error("Response data:", error.response?.data);
    clearAdminTokens();
    throw error;
  }
}

async function adminlogout() {
  try {
    await adminHttpService.post(
      `${endPoint}/logout`,
      {},
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Logout error:", error);
    // Continue with cleanup even if server logout fails
  } finally {
    clearAdminTokens();
  }
}

// FIXED: Use correct route path
async function getCurrentUser() {
  try {
    // Check if we have a valid token first
    const { accessToken } = getAdminTokens();

    if (!accessToken) {
      console.log("No access token available for getCurrentUser");
      return null;
    }

    if (isTokenExpired()) {
      console.log("Token expired for getCurrentUser");
      clearAdminTokens();
      return null;
    }

    // FIXED: Use the correct route - /api/admins/auth/me
    const response = await adminHttpService.get(`${endPointMe}/me`);

    // Handle different response structures
    let data = response.data;

    if (data.success && data.data) {
      data = data.data;
    }

    // Handle both 'admin' and direct user data
    const userData = data.admin || data;

    if (userData) {
      console.log("Successfully fetched current user");
      return userData;
    }

    console.log("No user data returned from server");
    return null;
  } catch (error) {
    console.error("Failed to get current user:", error);

    // Handle specific error cases
    if (error.response?.status === 401) {
      console.log("Unauthorized - clearing tokens");
      clearAdminTokens();
      return null;
    }

    if (error.response?.status === 403) {
      console.log("Forbidden - user may not have admin privileges");
      return null;
    }

    // For network errors or server errors, don't clear tokens
    if (error.code === "NETWORK_ERROR" || error.response?.status >= 500) {
      console.log("Network/Server error - keeping tokens");
      return null;
    }

    // For other errors, clear tokens to be safe
    clearAdminTokens();
    return null;
  }
}

// Enhanced authentication status check
async function checkAuthStatus() {
  const { accessToken } = getAdminTokens();

  if (!accessToken) {
    console.log("No access token found - not authenticated");
    return { isAuthenticated: false, user: null };
  }

  if (isTokenExpired()) {
    console.log("Token expired - clearing and not authenticated");
    clearAdminTokens();
    return { isAuthenticated: false, user: null };
  }

  try {
    const user = await getCurrentUser();
    const isAuthenticated = !!user;

    console.log(
      `Auth status check: ${
        isAuthenticated ? "authenticated" : "not authenticated"
      }`
    );

    return {
      isAuthenticated,
      user,
    };
  } catch (error) {
    console.error("Auth status check failed:", error);
    return { isAuthenticated: false, user: null };
  }
}

export {
  adminlogin,
  adminRefreshTokenApi,
  adminlogout,
  getCurrentUser,
  checkAuthStatus,
  getAdminTokens,
  clearAdminTokens,
  isTokenExpired,
};
