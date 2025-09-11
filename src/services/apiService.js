import {
  publicHttpService,
  userHttpService,
  httpService,
  ClientType,
} from "./httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/auth`;

function authUrl(path) {
  return `${apiEndPoint}/${path}`;
}

export async function loginApi(email, password) {
  try {
    const { data } = await publicHttpService.post(apiEndPoint, {
      email,
      password,
    });

    if (data.accessToken) {
      httpService.setTokens(ClientType.USER, {
        accessToken: data.accessToken,
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
    const { data } = await userHttpService.post(authUrl("refresh-token"));

    if (data.accessToken) {
      httpService.setTokens(ClientType.USER, {
        accessToken: data.accessToken,
        expiresIn: data.expiresIn || 900,
      });
    }

    return data;
  } catch (err) {
    console.error("Token refresh failed:", err);
    throw err;
  }
}

export async function logoutApi() {
  try {
    const response = await userHttpService.post(authUrl("logout"));

    httpService.clearTokens(ClientType.USER);

    return response;
  } catch (err) {
    console.error("Logout failed:", err);

    httpService.clearTokens(ClientType.USER);
    throw err;
  }
}

export async function getUserApi() {
  try {
    const { data } = await userHttpService.get(authUrl("me"));

    // CRITICAL FIX: Extract user from response object
    // The backend returns { user: userData }, not userData directly
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

// Set refresh callback for automatic token renewal
httpService.setRefreshCallback(ClientType.USER, async () => {
  const response = await refreshTokenApi();
  return {
    accessToken: response.accessToken,
    expiresIn: response.expiresIn || 900,
  };
});
