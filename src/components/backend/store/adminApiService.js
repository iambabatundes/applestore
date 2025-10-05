import {
  publicHttpService,
  adminHttpService,
} from "../../../services/http/index";

const apiEndPoint = `/api/admins/auth`;

function adminAuthUrl(path) {
  return path ? `${apiEndPoint}/${path}` : apiEndPoint;
}

const adminRefreshTokenFunction = async (refreshToken) => {
  try {
    console.log("🔄 Starting admin token refresh...");

    const { data } = await publicHttpService.post(adminAuthUrl("refresh"), {
      refreshToken,
    });

    // Handle nested response structure
    const responseData = data.success && data.data ? data.data : data;

    const result = {
      accessToken: responseData.accessToken,
      refreshToken: responseData.refreshToken,
      expiresIn: responseData.expiresIn || 3600,
    };

    console.log("✅ Admin token refresh successful");
    return result;
  } catch (err) {
    console.error("❌ Admin token refresh failed:", err);
    throw err;
  }
};

adminHttpService.setRefreshFunction(adminRefreshTokenFunction);

export async function adminLoginApi(
  email,
  password,
  totpCode = null,
  backupCode = null,
  rememberMe = false
) {
  try {
    const loginData = { email, password };

    if (totpCode) loginData.totpCode = totpCode;
    if (backupCode) loginData.backupCode = backupCode;
    if (rememberMe) loginData.rememberMe = rememberMe;

    console.log("🔐 [adminLoginApi] Sending login request", {
      email,
      rememberMe,
      has2FA: !!(totpCode || backupCode),
    });

    const { data } = await publicHttpService.post(apiEndPoint, loginData);

    // Handle the nested response structure
    let responseData;
    if (data.success && data.data) {
      responseData = data.data;
    } else if (data.data) {
      responseData = data.data;
    } else {
      responseData = data;
    }

    console.log("📦 [adminLoginApi] Response received:", {
      hasAccessToken: !!(
        responseData.accessToken ||
        responseData.token ||
        data.accessToken ||
        data.token
      ),
      requires2FA: responseData.requires2FA,
      hasUser: !!(
        responseData.admin ||
        responseData.user ||
        data.admin ||
        data.user
      ),
    });

    // Handle 2FA requirement
    if (responseData.requires2FA || data.error?.code === "2FA_REQUIRED") {
      return {
        requires2FA: true,
        message:
          responseData.message || data.error?.message || "2FA code required",
        errorCode: data.error?.code || "2FA_REQUIRED",
      };
    }

    // Extract access token from multiple possible locations
    const accessToken =
      responseData.accessToken ||
      responseData.token ||
      data.accessToken ||
      data.token;

    if (!accessToken) {
      console.error("❌ [adminLoginApi] No access token found in response");
      throw new Error("No access token received from server");
    }

    const expiresIn = responseData.expiresIn || 3600;
    const actualExpiresIn = rememberMe ? 30 * 24 * 60 * 60 : expiresIn;
    const refreshToken = responseData.refreshToken || data.refreshToken;

    // CRITICAL FIX: Set tokens in HTTP service IMMEDIATELY
    console.log("🔧 [adminLoginApi] Setting tokens in HTTP service");
    adminHttpService.setTokens({
      accessToken,
      refreshToken,
      expiresIn: actualExpiresIn,
    });

    // CRITICAL FIX: Also set in localStorage for redundancy
    console.log("💾 [adminLoginApi] Syncing tokens to localStorage");
    localStorage.setItem("adminAccessToken", accessToken);
    localStorage.setItem(
      "adminTokenExpiry",
      (Date.now() + actualExpiresIn * 1000).toString()
    );
    if (refreshToken) {
      localStorage.setItem("adminRefreshToken", refreshToken);
    }

    // Verify token was set correctly
    const verifyToken = adminHttpService.tokenManager?.getAccessToken();
    if (!verifyToken) {
      console.error(
        "❌ [adminLoginApi] Token verification failed after setting"
      );
      throw new Error("Failed to set tokens in HTTP service");
    }

    console.log("✅ [adminLoginApi] Login successful, tokens synchronized");

    return {
      success: true,
      accessToken,
      refreshToken,
      expiresIn: actualExpiresIn,
      user: responseData.admin || responseData.user || data.admin || data.user,
      rememberMe,
    };
  } catch (err) {
    console.error("❌ Admin login failed:", err);

    // Clear any partial tokens on failure
    adminHttpService.clearTokens();
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminTokenExpiry");
    localStorage.removeItem("adminRefreshToken");

    throw err;
  }
}

export async function adminRefreshTokenApi() {
  try {
    const refreshToken = adminHttpService.tokenManager?.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("🔄 Refreshing admin token...");
    const newTokens = await adminRefreshTokenFunction(refreshToken);

    adminHttpService.setTokens(newTokens);

    console.log("✅ Admin token refreshed and set in HTTP service");
    return newTokens;
  } catch (err) {
    console.error("❌ Admin token refresh failed:", err);
    adminHttpService.clearTokens();
    throw err;
  }
}

export async function adminLogoutApi() {
  try {
    console.log("🚪 Starting admin logout...");

    try {
      const response = await adminHttpService.post(adminAuthUrl("logout"));
      console.log("✅ Admin logout API call successful");
    } catch (apiError) {
      console.warn("⚠️ Admin logout API call failed:", apiError);
    }

    adminHttpService.clearTokens();

    try {
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminTokenExpiry");
      localStorage.removeItem("adminRefreshToken");
      console.log("🧹 Cleared localStorage admin tokens");
    } catch (storageError) {
      console.warn("⚠️ Failed to clear localStorage tokens:", storageError);
    }

    console.log("✅ Admin logout completed - all tokens cleared");
    return { success: true };
  } catch (err) {
    console.error("❌ Admin logout failed:", err);

    adminHttpService.clearTokens();
    try {
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminTokenExpiry");
      localStorage.removeItem("adminRefreshToken");
    } catch (storageError) {
      console.warn(
        "Failed to clear localStorage after logout error:",
        storageError
      );
    }

    throw err;
  }
}

export function clearAdminTokens() {
  console.log("🧹 Clearing admin tokens from all locations");

  adminHttpService.clearTokens();

  try {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminTokenExpiry");
    localStorage.removeItem("adminRefreshToken");
    console.log("✅ Cleared localStorage admin tokens");
  } catch (error) {
    console.error("❌ Failed to clear localStorage tokens:", error);
  }
}

export async function getAdminUserApi() {
  try {
    console.log("👤 Fetching admin user...");
    const { data } = await adminHttpService.get(adminAuthUrl("me"));

    const responseData = data.success && data.data ? data.data : data;

    let user = null;
    if (responseData && responseData.admin) {
      user = responseData.admin;
    } else if (responseData && !responseData.admin) {
      console.warn("⚠️ Unexpected admin user data structure:", responseData);
      user = responseData;
    } else {
      user = responseData;
    }

    if (user) {
      console.log("✅ Admin user fetched:", user.email);
    } else {
      console.log("⚠️ No admin user data received");
    }

    return user;
  } catch (err) {
    console.error("❌ Failed to fetch admin user:", err);
    throw err;
  }
}

export async function checkAdminAuthStatusApi() {
  try {
    console.log("🔍 Checking admin auth status...");

    const accessToken = adminHttpService.tokenManager?.getAccessToken();

    if (!accessToken) {
      console.log("ℹ️ No access token found - not authenticated");
      return { isAuthenticated: false, user: null };
    }

    if (adminHttpService.tokenManager?.isTokenExpired()) {
      console.log("⏰ Token expired - attempting refresh...");
      try {
        await adminRefreshTokenApi();
        const newToken = adminHttpService.tokenManager?.getAccessToken();
        if (!newToken) {
          console.log("❌ Token refresh failed - not authenticated");
          return { isAuthenticated: false, user: null };
        }
        console.log("✅ Token refreshed successfully");
      } catch (error) {
        console.log("❌ Token refresh failed - not authenticated");
        return { isAuthenticated: false, user: null };
      }
    }

    try {
      const user = await getAdminUserApi();
      const isAuthenticated = !!user;

      console.log(
        `✅ Admin auth status: ${
          isAuthenticated ? "authenticated" : "not authenticated"
        }`
      );

      return {
        isAuthenticated,
        user,
      };
    } catch (userError) {
      console.error("❌ Failed to fetch user during auth check:", userError);

      if ([401, 403].includes(userError.response?.status)) {
        adminHttpService.clearTokens();
        return { isAuthenticated: false, user: null };
      }

      return { isAuthenticated: false, user: null };
    }
  } catch (error) {
    console.error("❌ Admin auth status check failed:", error);
    return { isAuthenticated: false, user: null };
  }
}

export function getAdminAccessToken() {
  return adminHttpService.tokenManager?.getAccessToken();
}

export function isAdminTokenExpired() {
  return adminHttpService.tokenManager?.isTokenExpired() ?? true;
}

// export function clearAdminTokens() {
//   console.log("🧹 Clearing admin tokens from HTTP service");
//   adminHttpService.clearTokens();
// }

export function getAdminTokens() {
  const accessToken = adminHttpService.tokenManager?.getAccessToken();
  const refreshToken = adminHttpService.tokenManager?.getRefreshToken();
  const expiryDate = adminHttpService.tokenManager?.getTokenExpiryDate();

  return {
    accessToken,
    refreshToken,
    expiryDate,
    rememberMe: false,
  };
}

export function syncTokensToHttpService(accessToken, refreshToken, expiresIn) {
  if (accessToken) {
    adminHttpService.setTokens({
      accessToken,
      refreshToken,
      expiresIn: expiresIn || 3600,
    });
    console.log("🔄 Tokens synchronized to HTTP service");
  }
}
