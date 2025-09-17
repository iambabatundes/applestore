import { BaseHttpService, ClientType, HttpError } from "./httpService";

const ADMIN_CONFIG = {
  API_VERSION: "v1",
  CLIENT_TYPE: "admin",
  RATE_LIMITS: {
    DEFAULT: 100,
    SENSITIVE: 10,
  },
  CACHE_SETTINGS: {
    STATS: 2 * 60 * 1000,
    METRICS: 5 * 60 * 1000,
    LOGS: 30 * 1000,
    HEALTH: 10 * 1000,
  },
};

const ADMIN_ERROR_CODES = {
  INSUFFICIENT_PRIVILEGES: "ADMIN_INSUFFICIENT_PRIVILEGES",
  ADMIN_LOCKED: "ADMIN_ACCOUNT_LOCKED",
  INVALID_2FA: "INVALID_2FA_CODE",
  SESSION_EXPIRED: "ADMIN_SESSION_EXPIRED",
  PERMISSION_DENIED: "ADMIN_PERMISSION_DENIED",
  MAINTENANCE_MODE: "SYSTEM_MAINTENANCE_MODE",
};

class AdminHttpService extends BaseHttpService {
  constructor(config = {}) {
    const adminConfig = {
      timeout: 45000,
      retryAttempts: 2,
      retryDelay: 2000,
      cacheConfig: {
        maxSize: 150,
        defaultTTL: ADMIN_CONFIG.CACHE_SETTINGS.STATS,
      },
      securityConfig: {
        enableCSRF: true,
        tokenRefreshThreshold: 10 * 60 * 1000,
        maxConcurrentRequests: 5,
      },

      apiVersion: ADMIN_CONFIG.API_VERSION,
      ...config,
    };

    super(ClientType.ADMIN, adminConfig, {
      logger: console,
      refreshFn: config.refreshFunction || null,
    });

    // Now safe to set instance properties after super() completes
    this.adminConfig = ADMIN_CONFIG;
    this.errorCodes = ADMIN_ERROR_CODES;
    this.sensitiveEndpoints = new Set([
      "/security/",
      "/admins/",
      "/cleanup",
      "/system/",
      "/audit",
    ]);
  }

  getClientSpecificBaseURL(base) {
    // Get API version from config (available during parent constructor)
    // or fall back to adminConfig (available after constructor completes)
    // const apiVersion =
    // this.config.apiVersion || this.adminConfig?.API_VERSION || "v1";
    // const adminPath = apiVersion ? `/admins/${apiVersion}` : "/admin";
    // return `${base}${adminPath}`;
    return base;
  }

  getClientSpecificHeaders(headers) {
    // Safely access config values with fallbacks
    const clientType = this.adminConfig?.CLIENT_TYPE || "admin";
    const apiVersion =
      this.config.apiVersion || this.adminConfig?.API_VERSION || "v1";

    const adminHeaders = {
      ...headers,
      "X-Client-Type": clientType,
      "X-API-Version": apiVersion,
      "X-Admin-Access": "true",
      "X-Request-Priority": "high",
    };

    // Add tenant ID if available (for multi-tenant systems)
    const tenantId = this.getTenantId();
    if (tenantId) {
      adminHeaders["X-Tenant-ID"] = tenantId;
    }

    // Add session ID for audit tracking
    const sessionId = this.getSessionId();
    if (sessionId) {
      adminHeaders["X-Session-ID"] = sessionId;
    }

    return adminHeaders;
  }

  onRequestIntercept(config) {
    config.headers = config.headers || {};
    config.headers["X-Request-Source"] = "admin-client";
    config.headers["X-Request-ID"] = this.generateRequestId();
    config.headers["X-Timestamp"] = new Date().toISOString();

    // Add rate limiting headers for sensitive endpoints
    if (this.isSensitiveEndpoint(config.url)) {
      const rateLimits =
        this.adminConfig?.RATE_LIMITS || ADMIN_CONFIG.RATE_LIMITS;
      config.headers["X-Rate-Limit"] = rateLimits.SENSITIVE;
      config.headers["X-Sensitive-Operation"] = "true";
    }

    // Log admin operations for audit
    if (this.config.enableLogging) {
      this.logAdminOperation(config);
    }

    return config;
  }

  onResponseIntercept(response) {
    // Handle admin-specific response processing
    if (response.headers) {
      // Check for admin warnings
      const adminWarning = response.headers["x-admin-warning"];
      if (adminWarning) {
        this.logger?.warn && this.logger.warn("Admin Warning:", adminWarning);
      }

      // Handle maintenance mode notifications
      const maintenanceMode = response.headers["x-maintenance-mode"];
      if (maintenanceMode === "true") {
        this.logger?.warn &&
          this.logger.warn("System entering maintenance mode");
      }
    }

    return response;
  }

  async onErrorIntercept(error) {
    const response = error.response;
    const config = error.config;

    // Enhanced admin error handling
    if (response) {
      const { status, data } = response;

      switch (status) {
        case 403:
          this.handleInsufficientPrivileges(data, config);
          break;
        case 423:
          this.handleAccountLocked(data);
          break;
        case 429:
          this.handleRateLimit(response.headers, config);
          break;
        case 503:
          this.handleMaintenanceMode(data);
          break;
      }

      // Log admin errors for security monitoring
      this.logAdminError(error);
    }

    // Call parent error handler if it exists
    if (super.onErrorIntercept) {
      await super.onErrorIntercept(error);
    }
  }

  handleInsufficientPrivileges(data, config) {
    const operation = this.extractOperation(config.url);
    this.logger?.error &&
      this.logger.error(`Admin access denied for operation: ${operation}`, {
        url: config.url,
        method: config.method,
      });

    // Emit event for UI to handle
    this.emitAdminEvent("insufficient_privileges", {
      operation,
      requiredPermission: data?.requiredPermission,
    });
  }

  handleAccountLocked(data) {
    this.logger?.error && this.logger.error("Admin account locked", data);
    this.emitAdminEvent("account_locked", {
      reason: data?.reason,
      unlockTime: data?.unlockTime,
    });
  }

  handleRateLimit(headers, config) {
    const resetTime = headers["x-ratelimit-reset"];
    const operation = this.extractOperation(config.url);

    this.logger?.warn &&
      this.logger.warn(
        `Rate limit exceeded for admin operation: ${operation}`,
        { resetTime, url: config.url }
      );

    this.emitAdminEvent("rate_limit_exceeded", {
      operation,
      resetTime: resetTime ? new Date(resetTime * 1000) : null,
    });
  }

  handleMaintenanceMode(data) {
    this.logger?.warn && this.logger.warn("System in maintenance mode", data);
    this.emitAdminEvent("maintenance_mode", {
      estimatedDuration: data?.estimatedDuration,
      reason: data?.reason,
    });
  }

  isSensitiveEndpoint(url) {
    if (!url) return false;
    const endpoints =
      this.sensitiveEndpoints ||
      new Set(["/security/", "/admins/", "/cleanup", "/system/", "/audit"]);
    return Array.from(endpoints).some((endpoint) => url.includes(endpoint));
  }

  extractOperation(url) {
    if (!url) return "unknown";
    const parts = url.split("/").filter(Boolean);
    return parts[parts.length - 1] || "unknown";
  }

  generateRequestId() {
    return `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getTenantId() {
    return (
      this.storage?.getItem("tenantId", false) ||
      (typeof window !== "undefined"
        ? new URLSearchParams(window.location?.search).get("tenant")
        : null) ||
      null
    );
  }

  getSessionId() {
    return this.storage?.getItem("sessionId", false) || null;
  }

  logAdminOperation(config) {
    const operation = {
      method: config.method?.toUpperCase(),
      url: config.url,
      timestamp: new Date().toISOString(),
      requestId: config.headers["X-Request-ID"],
      sensitive: this.isSensitiveEndpoint(config.url),
    };

    this.logger?.info && this.logger.info("Admin Operation:", operation);
  }

  logAdminError(error) {
    const errorLog = {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
      timestamp: new Date().toISOString(),
      requestId: error.config?.headers?.["X-Request-ID"],
      message: error.message,
    };

    this.logger?.error && this.logger.error("Admin Error:", errorLog);
  }

  emitAdminEvent(eventType, data) {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      const event = new CustomEvent(`admin:${eventType}`, {
        detail: data,
      });
      window.dispatchEvent(event);
    }
  }

  async request(config) {
    const originalTTL = this.config.cacheConfig?.defaultTTL;
    const cacheSettings =
      this.adminConfig?.CACHE_SETTINGS || ADMIN_CONFIG.CACHE_SETTINGS;

    if (config.url) {
      if (config.url.includes("/stats")) {
        config.cacheTTL = cacheSettings.STATS;
      } else if (config.url.includes("/metrics")) {
        config.cacheTTL = cacheSettings.METRICS;
      } else if (
        config.url.includes("/logs") ||
        config.url.includes("/activity")
      ) {
        config.cacheTTL = cacheSettings.LOGS;
      } else if (config.url.includes("/health")) {
        config.cacheTTL = cacheSettings.HEALTH;
      }
    }

    // Call parent request method
    const result = await super.request(config);

    // Restore original TTL
    if (this.config.cacheConfig) {
      this.config.cacheConfig.defaultTTL = originalTTL;
    }

    return result;
  }

  async validateAdminSession() {
    try {
      const response = await this.get("/auth/validate");
      return response.data;
    } catch (error) {
      this.logger?.error &&
        this.logger.error("Admin session validation failed:", error);
      throw new HttpError("Session validation failed", {
        status: error.response?.status,
        originalError: error,
      });
    }
  }

  async getAdminPermissions() {
    try {
      const response = await this.get("/auth/permissions");
      return response.data;
    } catch (error) {
      this.logger?.error &&
        this.logger.error("Failed to get admin permissions:", error);
      throw error;
    }
  }

  setTenantId(tenantId) {
    if (tenantId) {
      this.storage?.setItem("tenantId", tenantId, false);
    } else {
      this.storage?.removeItem("tenantId");
    }
  }

  setSessionId(sessionId) {
    if (sessionId) {
      this.storage?.setItem("sessionId", sessionId, false);
    } else {
      this.storage?.removeItem("sessionId");
    }
  }

  clearTokens() {
    super.clearTokens();
    this.storage?.removeItem("tenantId");
    this.storage?.removeItem("sessionId");
    this.emitAdminEvent("session_cleared", {});
  }

  // Get admin-specific cache metrics
  getAdminCacheMetrics() {
    const baseMetrics = this.getCacheMetrics();
    const adminConfig = this.adminConfig || ADMIN_CONFIG;
    const sensitiveEndpoints = this.sensitiveEndpoints || new Set();

    return {
      ...baseMetrics,
      adminConfig,
      sensitiveEndpointsCount: sensitiveEndpoints.size,
    };
  }
}

// Create singleton instance
const adminHttpService = new AdminHttpService();

// Export both class and instance
export { AdminHttpService, ADMIN_CONFIG, ADMIN_ERROR_CODES };
export default adminHttpService;
