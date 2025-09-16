export const TOAST_CONFIG = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: false,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  toastClassName: "custom-toast",
};

// App initialization timeout (30 seconds)
export const INITIALIZATION_TIMEOUT = 30000;

// Retry configuration
export const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
};

// API configuration
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
};

// Local storage keys
export const STORAGE_KEYS = {
  SELECTED_CURRENCY: "selectedCurrency",
  USER_PREFERENCES: "userPreferences",
  CART_DATA: "cartData",
  AUTH_TOKENS: "authTokens",
};

// Route patterns
export const ROUTE_PATTERNS = {
  ADMIN: "/admin",
  CHECKOUT: "/checkout",
  HOME: "/",
};

// Loading messages
export const LOADING_MESSAGES = {
  AUTH: "Initializing authentication...",
  SYSTEM_SETUP: "Checking system setup...",
  ADMIN_SETUP: "Loading admin setup...",
  ADMIN_INTERFACE: "Loading admin interface...",
  APPLICATION: "Loading application...",
};

// Error messages
export const ERROR_MESSAGES = {
  INITIALIZATION_TIMEOUT: "App initialization timed out",
  ADMIN_REFRESH_UNAVAILABLE: "Admin refresh not available",
  CURRENCY_CHANGE_FAILED: "Currency change failed",
  CART_UPDATE_FAILED: "Cart update failed",
  CART_COUNT_CALCULATION_FAILED: "Cart count calculation failed",
};

// Development configuration
export const DEV_CONFIG = {
  enableDebugLogs: process.env.NODE_ENV === "development",
  logLevel: process.env.NODE_ENV === "development" ? "debug" : "info",
};

// Default values
export const DEFAULTS = {
  QUANTITY: 1,
  CURRENCY_RATE: 1,
  CART_COUNT: 0,
  TOKEN_EXPIRY: 900, // 15 minutes
};

// Skeleton configuration
export const SKELETON_CONFIG = {
  itemCount: 6,
  cardMinWidth: 280,
};

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  SHORT: 200,
  MEDIUM: 500,
  LONG: 1000,
  SKELETON: 1500,
};
