import { useAdminAuthStore } from "../components/backend/store/useAdminAuthStore";

const endPoint = "/api/admin/auth";
const endPointMe = "/api/admin";
const adminRefreshEndPoint = "/api/admin/refresh";

async function adminlogin(email, password) {
  const { data } = await http.post(endPoint, { email, password });
  console.log("Admin login response:", data);
  const expiresIn = 3600;
  setAdminTokens(data.accessToken, expiresIn);
  useAdminAuthStore.getState().setTokens(data.accessToken, expiresIn);
  return { accessToken: data.accessToken, expiresIn };
}

async function adminRefreshTokenApi() {
  console.log("Refreshing admin token at:", adminRefreshEndPoint);
  const { data } = await http.post(
    adminRefreshEndPoint,
    {},
    { withCredentials: true }
  );
  console.log("Admin refresh response:", data);
  const expiresIn = 3600; // Default to 1 hour
  setAdminTokens(data.accessToken, expiresIn);
  useAdminAuthStore.getState().setTokens(data.accessToken, expiresIn);
  return { accessToken: data.accessToken, expiresIn };
}

async function adminlogout() {
  await http.post(`${endPoint}/logout`, {}, { withCredentials: true });
  clearAdminTokens();
  useAdminAuthStore.getState().logout();
}

async function getCurrentUser() {
  try {
    const { data } = await http.get(`${endPointMe}/me`);
    return data;
  } catch (err) {
    console.error("Failed to get current user:", err);
    return null;
  }
}

export { adminlogin, adminRefreshTokenApi, adminlogout, getCurrentUser };
