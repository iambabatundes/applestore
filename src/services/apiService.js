import { publicHttpService, userHttpService } from "./http/index.js";

// const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/auth`;
const apiEndPoint = `/api/auth`;

function authUrl(path) {
  return `${apiEndPoint}/${path}`;
}

// Set up refresh function for userHttpService
const refreshTokenFunction = async (refreshToken) => {
  try {
    const { data } = await publicHttpService.post(authUrl("refresh-token"), {
      refreshToken,
    });

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresIn: data.expiresIn || 900,
    };
  } catch (err) {
    console.error("Token refresh failed:", err);
    throw err;
  }
};

// Configure the refresh function
userHttpService.setRefreshFunction(refreshTokenFunction);

export async function loginApi(email, password) {
  try {
    const { data } = await publicHttpService.post(apiEndPoint, {
      email,
      password,
    });

    // Use the service's token management
    if (data.accessToken) {
      userHttpService.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn || 900,
      });
    }

    return data;
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
  }
}

export async function refreshTokenApi() {
  try {
    const refreshToken = userHttpService.tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const newTokens = await refreshTokenFunction(refreshToken);
    userHttpService.setTokens(newTokens);

    return newTokens;
  } catch (err) {
    console.error("Token refresh failed:", err);
    userHttpService.clearTokens();
    throw err;
  }
}

export async function logoutApi() {
  try {
    // Call logout endpoint if available
    const response = await userHttpService.post(authUrl("logout"));

    // Clear tokens after successful logout
    userHttpService.clearTokens();

    return response;
  } catch (err) {
    console.error("Logout failed:", err);

    // Clear tokens even if logout fails
    userHttpService.clearTokens();
    throw err;
  }
}

export async function getUserApi() {
  try {
    const { data } = await userHttpService.get(authUrl("me"));

    // Handle different response structures
    if (data && data.user) {
      return data.user;
    }

    // Fallback if structure is different
    console.warn("Unexpected user data structure:", data);
    return data;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    throw err;
  }
}

// Password reset functionality
export async function requestPasswordResetApi(email) {
  try {
    const { data } = await publicHttpService.post(authUrl("forgot-password"), {
      email,
    });
    return data;
  } catch (err) {
    console.error("Password reset request failed:", err);
    throw err;
  }
}

export async function resetPasswordApi(token, newPassword) {
  try {
    const { data } = await publicHttpService.post(authUrl("reset-password"), {
      token,
      password: newPassword,
    });
    return data;
  } catch (err) {
    console.error("Password reset failed:", err);
    throw err;
  }
}

// Email verification
export async function verifyEmailApi(token) {
  try {
    const { data } = await publicHttpService.post(authUrl("verify-email"), {
      token,
    });
    return data;
  } catch (err) {
    console.error("Email verification failed:", err);
    throw err;
  }
}

export async function resendVerificationEmailApi(email) {
  try {
    const { data } = await publicHttpService.post(
      authUrl("resend-verification"),
      {
        email,
      }
    );
    return data;
  } catch (err) {
    console.error("Resend verification failed:", err);
    throw err;
  }
}
