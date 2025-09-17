import axios from "axios";
import CryptoJS from "crypto-js";

const getEnv = (key, fallback = undefined) => {
  if (typeof import.meta && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

// Lightweight stable string hash (djb2) for cache keys
const stableHash = (str) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  // >>> 0 to force unsigned
  return (hash >>> 0).toString(36);
};

// Custom HttpError that callers can use to render UI
export class HttpError extends Error {
  constructor(
    message,
    { status = null, data = null, originalError = null } = {}
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.data = data;
    this.originalError = originalError;
  }
}

export const defaultConfig = {
  baseURL: getEnv("VITE_API_URL", getEnv("REACT_APP_API_URL")),
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  retryDelayMultiplier: 1.5,
  enableLogging: getEnv("NODE_ENV", "development") !== "production",
  cacheConfig: { maxSize: 200, defaultTTL: 5 * 60 * 1000 },
  securityConfig: {
    enableCSRF: true,
    tokenRefreshThreshold: 5 * 60 * 1000,
    maxConcurrentRequests: 10,
  },
};

export const ClientType = Object.freeze({
  PUBLIC: "public",
  USER: "user",
  ADMIN: "admin",
  MOBILE: "mobile",
});

export class EncryptionService {
  constructor(secretKey) {
    this.secretKey =
      secretKey ||
      getEnv("VITE_ENCRYPTION_KEY") ||
      getEnv("REACT_APP_ENCRYPTION_KEY");
    if (!this.secretKey) {
      throw new Error(
        "Encryption key is required. Set VITE_ENCRYPTION_KEY / REACT_APP_ENCRYPTION_KEY."
      );
    }
  }

  encrypt(data) {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.secretKey
    ).toString();
  }

  decrypt(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
    const txt = bytes.toString(CryptoJS.enc.Utf8);
    return txt ? JSON.parse(txt) : null;
  }
}

export class SecureStorage {
  constructor(encryption) {
    if (!encryption)
      throw new Error("SecureStorage requires an EncryptionService instance");
    this.encryption = encryption;
    this.isAvailable = this.checkStorageAvailability();
    this.fallback = new Map();
  }

  // checkStorageAvailability() {
  //   try {
  //     const key = "__storage_test__";
  //     localStorage.setItem(key, "1");
  //     localStorage.removeItem(key);
  //     return true;
  //   } catch (err) {
  //     return false;
  //   }
  // }

  checkStorageAvailability() {
    try {
      const testKey = "__storage_test__";
      sessionStorage.setItem(testKey, "1");
      sessionStorage.removeItem(testKey);
      this.storageType = "session";
      return true;
    } catch (err) {
      this.storageType = "memory";
      return false;
    }
  }

  setItem(key, value, encrypt = true) {
    const payload = encrypt
      ? this.encryption.encrypt(value)
      : JSON.stringify(value);
    if (this.isAvailable) localStorage.setItem(key, payload);
    else this.fallback.set(key, payload);
  }

  getItem(key, encrypted = true) {
    const raw = this.isAvailable
      ? localStorage.getItem(key)
      : this.fallback.get(key);
    if (raw == null) return null;
    return encrypted ? this.encryption.decrypt(raw) : JSON.parse(raw);
  }

  removeItem(key) {
    if (this.isAvailable) localStorage.removeItem(key);
    else this.fallback.delete(key);
  }

  clear() {
    if (this.isAvailable) localStorage.clear();
    else this.fallback.clear();
  }
}

export class RequestCache {
  constructor({ maxSize = 200, defaultTTL = 5 * 60 * 1000 } = {}) {
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
    this.map = new Map(); // key => { data, expiresAt }
    this.accessOrder = new Set();
    this.timers = new Map();
    this.metrics = { hits: 0, misses: 0, evictions: 0 };
  }

  generateKey(cfg) {
    const method = (cfg.method || "GET").toUpperCase();
    const base = `${method}:${cfg.url || ""}:${JSON.stringify(
      cfg.params || {}
    )}`;
    // include body hash only for non-GET
    const bodyPart =
      method === "GET" ? "" : `:${stableHash(JSON.stringify(cfg.data || {}))}`;
    return stableHash(base + bodyPart);
  }

  get(key) {
    const entry = this.map.get(key);
    if (!entry) {
      this.metrics.misses++;
      return null;
    }
    if (entry.expiresAt <= Date.now()) {
      this.delete(key);
      this.metrics.misses++;
      return null;
    }
    this.metrics.hits++;
    // update access order
    this.accessOrder.delete(key);
    this.accessOrder.add(key);
    return entry.data;
  }

  set(key, data, ttl = this.defaultTTL) {
    this.evictIfNeeded();
    const expiresAt = Date.now() + ttl;
    this.map.set(key, { data, expiresAt });
    this.accessOrder.delete(key);
    this.accessOrder.add(key);
    const t = setTimeout(() => this.delete(key), ttl);
    this.timers.set(key, t);
  }

  evictIfNeeded() {
    while (this.map.size >= this.maxSize) {
      const oldest = this.accessOrder.values().next().value;
      if (!oldest) break;
      this.delete(oldest);
      this.metrics.evictions++;
    }
  }

  delete(key) {
    this.map.delete(key);
    this.accessOrder.delete(key);
    const t = this.timers.get(key);
    if (t) clearTimeout(t);
    this.timers.delete(key);
  }

  clear() {
    this.map.clear();
    this.accessOrder.clear();
    this.timers.forEach((t) => clearTimeout(t));
    this.timers.clear();
  }

  getMetrics() {
    const total = this.metrics.hits + this.metrics.misses;
    return {
      ...this.metrics,
      size: this.map.size,
      hitRate: total ? this.metrics.hits / total : 0,
    };
  }
}

export class TokenManager {
  constructor(storage, logger, clientType) {
    if (!storage) throw new Error("TokenManager requires storage");
    this.storage = storage;
    this.logger = logger;
    this.clientType = clientType || "default";
    this.cacheKey = `tokens_${this.clientType}`;
    this.tokens = this.storage.getItem(this.cacheKey, true) || null;
    this.refreshPromise = null;
  }

  setTokens(tokenData) {
    const { accessToken, refreshToken, expiresIn, expiresAt } = tokenData;
    const expiry = expiresAt || Date.now() + (expiresIn || 0) * 1000;
    this.tokens = { accessToken, refreshToken, expiresAt: expiry };
    this.storage.setItem(this.cacheKey, this.tokens, true);
    this.logger?.info &&
      this.logger.info(`Tokens saved for ${this.clientType}`, {
        expiresAt: new Date(expiry).toISOString(),
      });
  }

  getAccessToken() {
    if (!this.tokens)
      this.tokens = this.storage.getItem(this.cacheKey, true) || null;
    return this.tokens?.accessToken || null;
  }

  getRefreshToken() {
    if (!this.tokens)
      this.tokens = this.storage.getItem(this.cacheKey, true) || null;
    return this.tokens?.refreshToken || null;
  }

  isTokenExpired(threshold = 0) {
    if (!this.tokens) return true;
    return Date.now() + threshold >= (this.tokens.expiresAt || 0);
  }

  async refreshAccessToken(refreshFn) {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = (async () => {
      try {
        const rt = this.getRefreshToken();
        if (!rt) throw new Error("No refresh token");
        const tokens = await refreshFn(rt);
        this.setTokens(tokens);
        return tokens.accessToken;
      } finally {
        this.refreshPromise = null;
      }
    })();
    return this.refreshPromise;
  }

  clearTokens() {
    this.tokens = null;
    this.storage.removeItem(this.cacheKey);
    this.logger?.info &&
      this.logger.info(`Tokens cleared for ${this.clientType}`);
  }
}

let shared = null;
export const getSharedServices = (opts = {}) => {
  if (!shared) {
    const encryption = new EncryptionService(opts.encryptionKey);
    const storage = new SecureStorage(encryption);
    const cache = new RequestCache(
      opts.cacheConfig || defaultConfig.cacheConfig
    );
    shared = { encryption, storage, cache };
  }
  return shared;
};

export class BaseHttpService {
  constructor(
    clientType = ClientType.PUBLIC,
    config = {},
    { logger = console, refreshFn = null, sharedOpts = {} } = {}
  ) {
    this.config = { ...defaultConfig, ...config };
    this.clientType = clientType;
    this.logger = logger;
    this.refreshFn = refreshFn;

    const sharedServices = getSharedServices(sharedOpts);
    this.encryption = sharedServices.encryption;
    this.storage = sharedServices.storage;
    this.cache = sharedServices.cache;

    this.tokenManager = new TokenManager(
      this.storage,
      this.logger,
      this.clientType
    );

    this.isOnline = typeof navigator !== "undefined" ? navigator.onLine : true;

    this.setupNetworkMonitoring();
    this.initializeClient();
  }

  setupNetworkMonitoring() {
    if (typeof window === "undefined") return;
    if (!BaseHttpService._networkSetup) {
      window.addEventListener("online", () => {
        this.isOnline = true;
        this.logger?.info && this.logger.info("online");
      });
      window.addEventListener("offline", () => {
        this.isOnline = false;
        this.logger?.warn && this.logger.warn("offline");
      });
      BaseHttpService._networkSetup = true;
    }
  }

  // getBaseURL() {
  //   return this.config.baseURL;
  // }

  getBaseURL() {
    const base = this.config.baseURL;
    // Call client-specific base URL if implemented
    if (typeof this.getClientSpecificBaseURL === "function") {
      return this.getClientSpecificBaseURL(base);
    }
    return base;
  }

  requiresCredentials() {
    return this.clientType !== ClientType.PUBLIC;
  }

  // getDefaultHeaders() {
  //   const hdrs = {
  //     "Content-Type": "application/json",
  //     "X-Requested-With": "XMLHttpRequest",
  //   };
  //   if (this.clientType === ClientType.MOBILE) hdrs["X-Client-Type"] = "mobile";
  //   return hdrs;
  // }

  getDefaultHeaders() {
    const hdrs = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    };
    if (this.clientType === ClientType.MOBILE) hdrs["X-Client-Type"] = "mobile";

    // Call client-specific headers if implemented
    if (typeof this.getClientSpecificHeaders === "function") {
      return this.getClientSpecificHeaders(hdrs);
    }
    return hdrs;
  }

  initializeClient() {
    this.client = axios.create({
      baseURL: this.getBaseURL(),
      timeout: this.config.timeout,
      withCredentials: this.requiresCredentials(),
      headers: this.getDefaultHeaders(),
    });
    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.request.use(async (cfg) => {
      cfg.metadata = { startTime: Date.now(), clientType: this.clientType };

      // auth
      if (this.clientType !== ClientType.PUBLIC) {
        await this.addAuthHeaders(cfg);
      }

      if (this.config.securityConfig?.enableCSRF) {
        const meta =
          typeof document !== "undefined" &&
          document.querySelector('meta[name="csrf-token"]');
        const csrf = meta?.getAttribute("content");
        if (csrf) cfg.headers["X-CSRF-Token"] = csrf;
      }

      return this.onRequestIntercept(cfg) || cfg;
    });

    this.client.interceptors.response.use(
      (resp) => {
        // logging
        if (this.config.enableLogging && resp.config?.metadata) {
          const dur = Date.now() - resp.config.metadata.startTime;
          this.logger?.info &&
            this.logger.info(
              `[${this.clientType}] ${resp.config.method?.toUpperCase()} ${
                resp.config.url
              } (${dur}ms)`
            );
        }
        return this.onResponseIntercept(resp) || resp;
      },
      async (err) => {
        // Call client-specific error handler if implemented
        if (typeof this.onErrorIntercept === "function") {
          await this.onErrorIntercept(err);
        }

        const cfg = err.config || {};

        if (
          err.response?.status === 401 &&
          !cfg._retry &&
          this.clientType !== ClientType.PUBLIC
        ) {
          cfg._retry = true;
          try {
            if (this.refreshFn) {
              await this.tokenManager.refreshAccessToken(this.refreshFn);
              const newToken = this.tokenManager.getAccessToken();
              if (newToken) {
                cfg.headers = cfg.headers || {};
                cfg.headers.Authorization = `Bearer ${newToken}`;
                return this.client.request(cfg);
              }
            }
          } catch (e) {
            this.tokenManager.clearTokens();
            // fail through to error handling below
          }
        }

        if (
          this.isRetryableError(err) &&
          (cfg._retryCount || 0) < this.config.retryAttempts
        ) {
          const retryCount = (cfg._retryCount || 0) + 1;
          cfg._retryCount = retryCount;

          let delay =
            this.config.retryDelay *
            Math.pow(this.config.retryDelayMultiplier, retryCount - 1);

          if (err.response?.status === 429) {
            const ra =
              err.response.headers &&
              (err.response.headers["retry-after"] ||
                err.response.headers["Retry-After"]);
            if (ra) {
              const seconds = parseInt(ra, 10);
              if (!Number.isNaN(seconds))
                delay = Math.max(delay, seconds * 1000);
            }
          }

          await new Promise((res) => setTimeout(res, delay));
          return this.client.request(cfg);
        }

        // final error: wrap as HttpError and throw
        const status = err.response?.status || null;
        const data = err.response?.data || null;
        const message = data?.message || err.message || "Request failed";
        throw new HttpError(message, { status, data, originalError: err });
      }
    );
  }

  // overridable hooks
  onRequestIntercept(cfg) {
    return cfg;
  }
  onResponseIntercept(resp) {
    return resp;
  }

  async addAuthHeaders(cfg) {
    const threshold = this.config.securityConfig?.tokenRefreshThreshold || 0;
    if (this.tokenManager.isTokenExpired(threshold) && this.refreshFn) {
      try {
        await this.tokenManager.refreshAccessToken(this.refreshFn);
      } catch (e) {
        // leave clearing to caller
      }
    }
    const token = this.tokenManager.getAccessToken();
    if (token) {
      cfg.headers = cfg.headers || {};
      cfg.headers.Authorization = `Bearer ${token}`;
    }
  }

  isRetryableError(err) {
    const retryable = [408, 500, 502, 503, 504];
    const status = err.response?.status;
    const isNetwork = !err.response && err.request;
    if (status === 429) return true;
    return isNetwork || retryable.includes(status);
  }

  // Public API
  async request(cfg) {
    // cache check for GET
    const method = (cfg.method || "GET").toUpperCase();
    if (method === "GET") {
      const cacheKey = this.cache.generateKey
        ? this.cache.generateKey(cfg)
        : this.cache.generateKey(cfg);
      const cached = this.cache.get(cacheKey);
      if (cached) return cached;
    }

    const resp = await this.client.request(cfg);

    if (method === "GET" && resp.status >= 200 && resp.status < 300) {
      const cacheKey = this.cache.generateKey
        ? this.cache.generateKey(cfg)
        : this.cache.generateKey(cfg);
      this.cache.set(cacheKey, resp, this.config.cacheConfig?.defaultTTL);
    }

    return resp;
  }

  async get(url, cfg = {}) {
    return this.request({ ...cfg, method: "GET", url });
  }
  async post(url, data = {}, cfg = {}) {
    return this.request({ ...cfg, method: "POST", url, data });
  }
  async put(url, data = {}, cfg = {}) {
    return this.request({ ...cfg, method: "PUT", url, data });
  }
  async patch(url, data = {}, cfg = {}) {
    return this.request({ ...cfg, method: "PATCH", url, data });
  }
  async delete(url, cfg = {}) {
    return this.request({ ...cfg, method: "DELETE", url });
  }

  // token helpers
  setRefreshFunction(fn) {
    this.refreshFn = fn;
  }
  setTokens(tokens) {
    this.tokenManager.setTokens(tokens);
  }
  clearTokens() {
    this.tokenManager.clearTokens();
  }

  // cache helpers
  getCacheMetrics() {
    return this.cache.getMetrics();
  }
  clearCache() {
    return this.cache.clear();
  }
}

export default BaseHttpService;
