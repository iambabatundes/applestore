// Key names in storage
const STORAGE_KEYS = {
  admin: "adminAuth",
  user: "userAuth",
};

// In-memory cache (faster access than hitting storage every time)
let tokens = {
  admin: { accessToken: null, expiryDate: null },
  user: { accessToken: null, expiryDate: null },
};

// Load from localStorage on app start
Object.keys(STORAGE_KEYS).forEach((role) => {
  const stored = localStorage.getItem(STORAGE_KEYS[role]);
  if (stored) {
    try {
      tokens[role] = JSON.parse(stored);
    } catch {
      tokens[role] = { accessToken: null, expiryDate: null };
    }
  }
});

// General token functions (existing)
export const setTokens = (role, token, expiresIn) => {
  const data = {
    accessToken: token,
    expiryDate: Date.now() + expiresIn * 1000,
  };
  tokens[role] = data;
  localStorage.setItem(STORAGE_KEYS[role], JSON.stringify(data));
};

export const getAccessToken = (role) => tokens[role]?.accessToken;
export const getExpiryDate = (role) => tokens[role]?.expiryDate;

export const clearTokens = (role) => {
  tokens[role] = { accessToken: null, expiryDate: null };
  localStorage.removeItem(STORAGE_KEYS[role]);
};

// User-specific token functions (for auth store compatibility)
export const setUserTokens = (token, expiresIn) => {
  setTokens("user", token, expiresIn);
};

export const getUserAccessToken = () => {
  return getAccessToken("user");
};

export const getUserExpiryDate = () => {
  return getExpiryDate("user");
};

export const clearUserTokens = () => {
  clearTokens("user");
};

// Admin-specific token functions (for completeness)
export const setAdminTokens = (token, expiresIn) => {
  setTokens("admin", token, expiresIn);
};

export const getAdminAccessToken = () => {
  return getAccessToken("admin");
};

export const getAdminExpiryDate = () => {
  return getExpiryDate("admin");
};

export const clearAdminTokens = () => {
  clearTokens("admin");
};

// Utility function
export const isValidJwt = (token) =>
  token && /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(token);

// Check if token exists and is not expired
export const isTokenValid = (role) => {
  const token = getAccessToken(role);
  const expiryDate = getExpiryDate(role);
  return isValidJwt(token) && expiryDate && Date.now() < expiryDate;
};
