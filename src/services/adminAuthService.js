import adminHttpService from "../services/http/index";

const endPoint = "/api/admin/auth";
const endPointMe = "/api/admin";
const adminRefreshEndPoint = "/api/admin/refresh";

// Token management functions
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
    const data = response.data;

    console.log("Admin login response:", data);

    if (!data.accessToken) {
      throw new Error("No access token received from server");
    }

    const expiresIn = data.expiresIn || 3600; // Use server value or default to 1 hour

    // Set tokens in localStorage
    setAdminTokens(data.accessToken, expiresIn);

    return {
      accessToken: data.accessToken,
      expiresIn,
      user: data.user, // Include user data if available
    };
  } catch (error) {
    console.error("Admin login error:", error);
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

    const data = response.data;
    console.log("Admin refresh response:", data);

    if (!data.accessToken) {
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

// FIXED: Improved getCurrentUser with better error handling
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

    const response = await adminHttpService.get(`${endPointMe}/me`);

    if (response.data) {
      console.log("Successfully fetched current user");
      return response.data;
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
    // The user might still be valid, just can't reach the server
    if (error.code === "NETWORK_ERROR" || error.response?.status >= 500) {
      console.log("Network/Server error - keeping tokens");
      return null;
    }

    // For other errors, clear tokens to be safe
    clearAdminTokens();
    return null;
  }
}

// IMPROVED: Enhanced authentication status check
async function checkAuthStatus() {
  const { accessToken } = getAdminTokens();

  // No token means definitely not authenticated
  if (!accessToken) {
    console.log("No access token found - not authenticated");
    return { isAuthenticated: false, user: null };
  }

  // Expired token means not authenticated
  if (isTokenExpired()) {
    console.log("Token expired - clearing and not authenticated");
    clearAdminTokens();
    return { isAuthenticated: false, user: null };
  }

  try {
    // Try to get current user to verify token is still valid
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
