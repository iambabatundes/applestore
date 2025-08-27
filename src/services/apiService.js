import { publicHttpService, userHttpService } from "./httpService";

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
    return data;
  } catch (err) {
    console.error("Login failed:", err);
    throw err;
  }
}

export async function refreshTokenApi() {
  try {
    const { data } = await userHttpService.post(authUrl("refresh-token"));
    return data;
  } catch (err) {
    console.error("Token refresh failed:", err);
    throw err;
  }
}

export async function logoutApi() {
  try {
    return userHttpService.post(authUrl("logout"));
  } catch (err) {
    console.error("Logout failed:", err);
    throw err;
  }
}

export async function getUserApi() {
  try {
    const { data } = await userHttpService.get(authUrl("me"));
    return data;
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return null;
  }
}
