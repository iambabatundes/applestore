import axios from "axios";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";

// Configuration
export const defaultConfig = {
  baseURL: import.meta.env.VITE_API_URL || "https://api.yourstore.com",
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  retryDelayMultiplier: 1.5,
  enableLogging: import.meta.env.MODE !== "production",
  enableMetrics: true,
  cacheConfig: {
    maxSize: 200,
    defaultTTL: 5 * 60 * 1000, // 5 minutes
  },
  securityConfig: {
    enableCSRF: true,
    enableEncryption: true,
    tokenRefreshThreshold: 5 * 60 * 1000,
    maxConcurrentRequests: 10,
  },
};

// Client types
export const ClientType = {
  PUBLIC: "public",
  USER: "user",
  ADMIN: "admin",
};

// Secure encryption service
class EncryptionService {
  constructor(secretKey = import.meta.env.VITE_ENCRYPTION_KEY) {
    this.secretKey = secretKey || this.generateSecretKey();
  }

  generateSecretKey() {
    return CryptoJS.lib.WordArray.random(256 / 8).toString();
  }

  encrypt(data) {
    try {
      return CryptoJS.AES.encrypt(
        JSON.stringify(data),
        this.secretKey
      ).toString();
    } catch (error) {
      console.error("Encryption failed:", error);
      return null;
    }
  }

  decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  }
}

// Secure storage with fallback
class SecureStorage {
  constructor(encryption) {
    this.encryption = encryption;
    this.isAvailable = this.checkStorageAvailability();
    this.fallbackStorage = new Map(); // In-memory fallback
  }

  checkStorageAvailability() {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      console.warn("localStorage not available, using in-memory storage");
      return false;
    }
  }

  setItem(key, value, encrypt = true) {
    try {
      const dataToStore =
        encrypt && this.encryption
          ? this.encryption.encrypt(value)
          : JSON.stringify(value);

      if (this.isAvailable) {
        localStorage.setItem(key, dataToStore);
      } else {
        this.fallbackStorage.set(key, dataToStore);
      }
      return true;
    } catch (error) {
      console.error("Storage set failed:", error);
      return false;
    }
  }

  getItem(key, encrypted = true) {
    try {
      const storedData = this.isAvailable
        ? localStorage.getItem(key)
        : this.fallbackStorage.get(key);

      if (!storedData) return null;

      return encrypted && this.encryption
        ? this.encryption.decrypt(storedData)
        : JSON.parse(storedData);
    } catch (error) {
      console.error("Storage get failed:", error);
      return null;
    }
  }

  removeItem(key) {
    if (this.isAvailable) {
      localStorage.removeItem(key);
    } else {
      this.fallbackStorage.delete(key);
    }
  }

  clear() {
    if (this.isAvailable) {
      localStorage.clear();
    } else {
      this.fallbackStorage.clear();
    }
  }
}

// Advanced caching with LRU and TTL
class RequestCache {
  constructor(config = {}) {
    this.maxSize = config.maxSize || 200;
    this.defaultTTL = config.defaultTTL || 5 * 60 * 1000;
    this.cache = new Map();
    this.timers = new Map();
    this.accessOrder = new Set();
    this.metrics = { hits: 0, misses: 0, evictions: 0 };
  }

  generateKey(config) {
    const { method = "GET", url, params, data } = config;
    let key = `${method}:${url}`;
    if (params) key += `:${JSON.stringify(params)}`;
    if (data && method !== "GET") key += `:${JSON.stringify(data)}`;
    return key;
  }

  get(key) {
    if (this.cache.has(key)) {
      const entry = this.cache.get(key);
      if (entry.expiresAt > Date.now()) {
        this.metrics.hits++;
        this.updateAccessOrder(key);
        return entry.data;
      } else {
        this.delete(key);
      }
    }
    this.metrics.misses++;
    return null;
  }

  set(key, data, ttl = this.defaultTTL) {
    this.evictIfNecessary();

    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { data, expiresAt });
    this.updateAccessOrder(key);

    const timer = setTimeout(() => this.delete(key), ttl);
    this.timers.set(key, timer);
  }

  updateAccessOrder(key) {
    this.accessOrder.delete(key);
    this.accessOrder.add(key);
  }

  evictIfNecessary() {
    while (this.cache.size >= this.maxSize) {
      const oldestKey = this.accessOrder.values().next().value;
      this.delete(oldestKey);
      this.metrics.evictions++;
    }
  }

  delete(key) {
    this.cache.delete(key);
    this.accessOrder.delete(key);
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }

  clear() {
    this.cache.clear();
    this.accessOrder.clear();
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }

  getMetrics() {
    const total = this.metrics.hits + this.metrics.misses;
    return {
      ...this.metrics,
      size: this.cache.size,
      hitRate: total > 0 ? ((this.metrics.hits / total) * 100).toFixed(2) : 0,
    };
  }
}

// Enhanced token manager
class TokenManager {
  constructor(storage, encryption, logger) {
    this.storage = storage;
    this.encryption = encryption;
    this.logger = logger;
    this.tokens = new Map();
    this.refreshPromises = new Map();
  }

  setTokens(clientType, tokenData) {
    const { accessToken, refreshToken, expiresIn, expiresAt } = tokenData;
    const expiry = expiresAt || Date.now() + expiresIn * 1000;

    const tokens = {
      accessToken,
      refreshToken,
      expiresAt: expiry,
      clientType,
    };

    this.tokens.set(clientType, tokens);
    this.storage.setItem(`tokens_${clientType}`, tokens, true);

    this.logger?.info(`Tokens set for ${clientType}`, {
      expiresAt: new Date(expiry).toISOString(),
    });
  }

  getAccessToken(clientType) {
    let tokenData = this.tokens.get(clientType);

    if (!tokenData) {
      tokenData = this.storage.getItem(`tokens_${clientType}`, true);
      if (tokenData) this.tokens.set(clientType, tokenData);
    }

    return tokenData?.accessToken;
  }

  getRefreshToken(clientType) {
    const tokenData =
      this.tokens.get(clientType) ||
      this.storage.getItem(`tokens_${clientType}`, true);
    return tokenData?.refreshToken;
  }

  isTokenExpired(clientType, threshold = 0) {
    const tokenData =
      this.tokens.get(clientType) ||
      this.storage.getItem(`tokens_${clientType}`, true);

    if (!tokenData?.expiresAt) return true;
    return Date.now() + threshold >= tokenData.expiresAt;
  }

  async refreshAccessToken(clientType, refreshCallback) {
    if (this.refreshPromises.has(clientType)) {
      return this.refreshPromises.get(clientType);
    }

    const refreshPromise = this._performRefresh(clientType, refreshCallback);
    this.refreshPromises.set(clientType, refreshPromise);

    try {
      const result = await refreshPromise;
      return result;
    } finally {
      this.refreshPromises.delete(clientType);
    }
  }

  async _performRefresh(clientType, refreshCallback) {
    try {
      const refreshToken = this.getRefreshToken(clientType);
      if (!refreshToken) throw new Error("No refresh token available");

      this.logger?.info(`Refreshing token for ${clientType}`);
      const newTokens = await refreshCallback(refreshToken);
      this.setTokens(clientType, newTokens);

      return newTokens.accessToken;
    } catch (error) {
      this.logger?.error(`Token refresh failed for ${clientType}`, error);
      this.clearTokens(clientType);
      throw error;
    }
  }

  clearTokens(clientType) {
    this.tokens.delete(clientType);
    this.storage.removeItem(`tokens_${clientType}`);
    this.logger?.info(`Tokens cleared for ${clientType}`);
  }

  clearAllTokens() {
    this.tokens.clear();
    Object.values(ClientType).forEach((type) => {
      this.storage.removeItem(`tokens_${type}`);
    });
    this.logger?.info("All tokens cleared");
  }

  validateToken(token) {
    if (!token) return false;
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    return jwtRegex.test(token);
  }
}

// Main HTTP Service
export class EnterpriseHttpService {
  constructor(config = {}) {
    this.config = { ...defaultConfig, ...config };

    // Initialize dependencies
    this.encryption = new EncryptionService(this.config.encryptionKey);
    this.storage = new SecureStorage(this.encryption);
    this.cache = new RequestCache(this.config.cacheConfig);
    this.tokenManager = new TokenManager(
      this.storage,
      this.encryption,
      console
    );

    this.clients = new Map();
    this.refreshCallbacks = new Map();
    this.isOnline = navigator.onLine;

    this.setupNetworkMonitoring();
    this.initializeClients();
  }

  setupNetworkMonitoring() {
    window.addEventListener("online", () => {
      this.isOnline = true;
      console.info("Network connection restored");
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      console.warn("Network connection lost");
    });
  }

  initializeClients() {
    Object.values(ClientType).forEach((clientType) => {
      const client = axios.create({
        baseURL: this.config.baseURL,
        timeout: this.config.timeout,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      this.setupInterceptors(client, clientType);
      this.clients.set(clientType, client);
    });
  }

  setupInterceptors(client, clientType) {
    // Request interceptor
    client.interceptors.request.use(
      async (config) => {
        config.metadata = { startTime: Date.now(), clientType };

        // Add authentication for non-public clients
        if (clientType !== ClientType.PUBLIC) {
          await this.addAuthHeaders(config, clientType);
        }

        // Add CSRF token
        if (this.config.securityConfig.enableCSRF) {
          const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");
          if (csrfToken) config.headers["X-CSRF-Token"] = csrfToken;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;

        // Handle 401 errors
        if (
          error.response?.status === 401 &&
          !config._retry &&
          clientType !== ClientType.PUBLIC
        ) {
          config._retry = true;
          try {
            const callback = this.refreshCallbacks.get(clientType);
            if (callback) {
              await this.tokenManager.refreshAccessToken(clientType, callback);
              const newToken = this.tokenManager.getAccessToken(clientType);
              if (newToken) {
                config.headers.Authorization = `Bearer ${newToken}`;
                return client.request(config);
              }
            }
          } catch (refreshError) {
            this.handleAuthFailure(clientType);
          }
        }

        // Handle retryable errors
        if (this.isRetryableError(error) && !config._retried) {
          return this.retryRequest(error, client);
        }

        this.handleErrorResponse(error);
        return Promise.reject(error);
      }
    );
  }

  async addAuthHeaders(config, clientType) {
    const threshold = this.config.securityConfig.tokenRefreshThreshold;

    if (this.tokenManager.isTokenExpired(clientType, threshold)) {
      const callback = this.refreshCallbacks.get(clientType);
      if (callback) {
        try {
          await this.tokenManager.refreshAccessToken(clientType, callback);
        } catch (error) {
          this.handleAuthFailure(clientType);
          throw error;
        }
      }
    }

    const token = this.tokenManager.getAccessToken(clientType);
    if (token && this.tokenManager.validateToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  isRetryableError(error) {
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    const statusCode = error.response?.status;
    const isNetworkError = !error.response && error.request;
    return isNetworkError || retryableStatusCodes.includes(statusCode);
  }

  async retryRequest(error, client) {
    const config = error.config;
    const retryCount = config._retryCount || 0;

    if (retryCount >= this.config.retryAttempts) {
      return Promise.reject(error);
    }

    config._retried = true;
    config._retryCount = retryCount + 1;

    const delay =
      this.config.retryDelay *
      Math.pow(this.config.retryDelayMultiplier, retryCount);
    await new Promise((resolve) => setTimeout(resolve, delay));

    return client.request(config);
  }

  handleErrorResponse(error) {
    const response = error.response;
    const message =
      response?.data?.message || response?.data?.error || error.message;

    if (!response) {
      toast.error("Network error - please check your connection");
    } else {
      switch (response.status) {
        case 400:
          toast.error(`Bad request: ${message}`);
          break;
        case 401:
          toast.warning("Please log in to continue");
          break;
        case 403:
          toast.warning(`Access denied: ${message}`);
          break;
        case 404:
          toast.info("Resource not found");
          break;
        case 429:
          toast.error("Too many requests - please wait");
          break;
        default:
          if (response.status >= 500) {
            toast.error("Server error - please try again later");
          }
      }
    }
  }

  handleAuthFailure(clientType) {
    this.tokenManager.clearTokens(clientType);
    const loginPath =
      clientType === ClientType.ADMIN ? "/admin/login" : "/login";
    toast.warning("Session expired. Please log in again.");
    window.location.href = loginPath;
  }

  // Public API
  async request(clientType, config) {
    const client = this.clients.get(clientType);
    if (!client) throw new Error(`Invalid client type: ${clientType}`);

    // Check cache for GET requests
    if (!config.method || config.method.toUpperCase() === "GET") {
      const cacheKey = this.cache.generateKey(config);
      const cachedResponse = this.cache.get(cacheKey);
      if (cachedResponse) return cachedResponse;
    }

    const response = await client.request(config);

    // Cache successful GET responses
    if (
      (!config.method || config.method.toUpperCase() === "GET") &&
      response.status >= 200 &&
      response.status < 300
    ) {
      const cacheKey = this.cache.generateKey(config);
      this.cache.set(cacheKey, response);
    }

    return response;
  }

  // Client APIs
  get public() {
    return {
      get: (url, config) =>
        this.request(ClientType.PUBLIC, { ...config, method: "GET", url }),
      post: (url, data, config) =>
        this.request(ClientType.PUBLIC, {
          ...config,
          method: "POST",
          url,
          data,
        }),
      put: (url, data, config) =>
        this.request(ClientType.PUBLIC, {
          ...config,
          method: "PUT",
          url,
          data,
        }),
      delete: (url, config) =>
        this.request(ClientType.PUBLIC, { ...config, method: "DELETE", url }),
    };
  }

  get user() {
    return {
      get: (url, config) =>
        this.request(ClientType.USER, { ...config, method: "GET", url }),
      post: (url, data, config) =>
        this.request(ClientType.USER, { ...config, method: "POST", url, data }),
      put: (url, data, config) =>
        this.request(ClientType.USER, { ...config, method: "PUT", url, data }),
      delete: (url, config) =>
        this.request(ClientType.USER, { ...config, method: "DELETE", url }),
    };
  }

  get admin() {
    return {
      get: (url, config) =>
        this.request(ClientType.ADMIN, { ...config, method: "GET", url }),
      post: (url, data, config) =>
        this.request(ClientType.ADMIN, {
          ...config,
          method: "POST",
          url,
          data,
        }),
      put: (url, data, config) =>
        this.request(ClientType.ADMIN, { ...config, method: "PUT", url, data }),
      delete: (url, config) =>
        this.request(ClientType.ADMIN, { ...config, method: "DELETE", url }),
    };
  }

  // Configuration methods
  setRefreshCallback(clientType, callback) {
    this.refreshCallbacks.set(clientType, callback);
  }

  setTokens(clientType, tokens) {
    this.tokenManager.setTokens(clientType, tokens);
  }

  clearTokens(clientType) {
    this.tokenManager.clearTokens(clientType);
  }

  clearAllTokens() {
    this.tokenManager.clearAllTokens();
  }

  // Utility methods
  getCacheMetrics() {
    return this.cache.getMetrics();
  }

  clearCache() {
    this.cache.clear();
  }
}

export const httpService = new EnterpriseHttpService();

// Backward compatibility exports
export const userHttpService = httpService.user;
export const adminHttpService = httpService.admin;
export const publicHttpService = httpService.public;

export default httpService;
