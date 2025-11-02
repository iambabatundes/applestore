// services/settingsService.js

import {
  adminHttpService,
  userHttpService,
  publicHttpService,
} from "./http/index.js";

class SettingsService {
  constructor() {
    this.basePath = "/settings";
    this.configPath = "/setting-config";
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  clearCache(category = null) {
    if (category) {
      this.cache.delete(category);
      this.cache.delete(`${category}_flat`);
    } else {
      this.cache.clear();
    }
  }

  getCached(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  setCached(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  async getAllSettings() {
    try {
      const cached = this.getCached("all_settings");
      if (cached) return cached;

      const response = await adminHttpService.get(this.basePath);
      const data = response.data;

      this.setCached("all_settings", data);
      return data;
    } catch (error) {
      console.error("Failed to get all settings:", error);
      throw this.handleError(error);
    }
  }

  async getCategorySettings(category) {
    try {
      const cached = this.getCached(category);
      if (cached) return cached;

      const response = await adminHttpService.get(
        `${this.basePath}/${category}`
      );
      const data = response.data;

      this.setCached(category, data);
      return data;
    } catch (error) {
      console.error(`Failed to get ${category} settings:`, error);
      throw this.handleError(error);
    }
  }

  async updateCategorySettings(category, updates, metadata = {}) {
    try {
      const response = await adminHttpService.put(
        `${this.basePath}/${category}`,
        {
          settings: updates,
          metadata,
        }
      );

      // Clear cache for this category
      this.clearCache(category);
      this.clearCache("all_settings");

      return response.data;
    } catch (error) {
      console.error(`Failed to update ${category} settings:`, error);
      throw this.handleError(error);
    }
  }

  async bulkUpdateSettings(updates, metadata = {}) {
    try {
      const response = await adminHttpService.post(`${this.basePath}/bulk`, {
        updates,
        metadata,
      });

      // Clear all cache
      this.clearCache();

      return response.data;
    } catch (error) {
      console.error("Failed to bulk update settings:", error);
      throw this.handleError(error);
    }
  }

  async getSettingsHistory(category, params = {}) {
    try {
      const response = await adminHttpService.get(
        `${this.basePath}/${category}/history`,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to get ${category} history:`, error);
      throw this.handleError(error);
    }
  }

  async revertSettings(category, version) {
    try {
      const response = await adminHttpService.post(
        `${this.basePath}/${category}/revert`,
        { version }
      );

      this.clearCache(category);
      this.clearCache("all_settings");

      return response.data;
    } catch (error) {
      console.error(`Failed to revert ${category} settings:`, error);
      throw this.handleError(error);
    }
  }

  async initializeDefaults() {
    try {
      const response = await adminHttpService.post(
        `${this.basePath}/initialize`
      );
      this.clearCache();
      return response.data;
    } catch (error) {
      console.error("Failed to initialize default settings:", error);
      throw this.handleError(error);
    }
  }

  async validateSettings(category, settings) {
    try {
      const response = await adminHttpService.post(
        `${this.basePath}/${category}/validate`,
        { settings }
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to validate ${category} settings:`, error);
      throw this.handleError(error);
    }
  }

  async exportSettings() {
    try {
      const response = await adminHttpService.get(`${this.basePath}/export`);
      return response.data;
    } catch (error) {
      console.error("Failed to export settings:", error);
      throw this.handleError(error);
    }
  }

  async importSettings(settingsData, merge = true) {
    try {
      const response = await adminHttpService.post(`${this.basePath}/import`, {
        settings: settingsData,
        merge,
      });

      this.clearCache();
      return response.data;
    } catch (error) {
      console.error("Failed to import settings:", error);
      throw this.handleError(error);
    }
  }

  async getPublicSetting(category, key, defaultValue = null) {
    try {
      const cacheKey = `public_${category}_${key}`;
      const cached = this.getCached(cacheKey);
      if (cached !== null) return cached;

      const response = await publicHttpService.get(
        `${this.basePath}/public/${category}/${key}`
      );

      const value = response.data?.value ?? defaultValue;
      this.setCached(cacheKey, value);
      return value;
    } catch (error) {
      console.error(`Failed to get public setting ${category}.${key}:`, error);
      return defaultValue;
    }
  }

  async getPublicCategorySettings(category) {
    try {
      const cacheKey = `public_${category}`;
      const cached = this.getCached(cacheKey);
      if (cached) return cached;

      const response = await publicHttpService.get(
        `${this.basePath}/public/${category}`
      );

      const data = response.data;
      this.setCached(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Failed to get public ${category} settings:`, error);
      throw this.handleError(error);
    }
  }

  async getPublicSettingsFlat() {
    try {
      const cached = this.getCached("public_flat");
      if (cached) return cached;

      const response = await publicHttpService.get(
        `${this.basePath}/public/flat`
      );

      const data = response.data;
      this.setCached("public_flat", data);
      return data;
    } catch (error) {
      console.error("Failed to get flat public settings:", error);
      throw this.handleError(error);
    }
  }

  async getSiteConfig() {
    try {
      const cached = this.getCached("site_config");
      if (cached) return cached;

      const response = await publicHttpService.get(`${this.configPath}/site`);

      const data = response.data;
      this.setCached("site_config", data);
      return data;
    } catch (error) {
      console.error("Failed to get site config:", error);
      throw this.handleError(error);
    }
  }

  async getBrandingConfig() {
    try {
      const cached = this.getCached("branding_config");
      if (cached) return cached;

      const response = await publicHttpService.get(
        `${this.configPath}/branding`
      );

      const data = response.data;
      this.setCached("branding_config", data);
      return data;
    } catch (error) {
      console.error("Failed to get branding config:", error);
      throw this.handleError(error);
    }
  }

  async getSecurityConfig() {
    try {
      const cached = this.getCached("security_config");
      if (cached) return cached;

      const response = await publicHttpService.get(
        `${this.configPath}/security`
      );

      const data = response.data;
      this.setCached("security_config", data);
      return data;
    } catch (error) {
      console.error("Failed to get security config:", error);
      throw this.handleError(error);
    }
  }

  async isMaintenanceMode() {
    try {
      const value = await this.getPublicSetting(
        "GENERAL",
        "maintenanceMode",
        false
      );
      return Boolean(value);
    } catch (error) {
      console.error("Failed to check maintenance mode:", error);
      return false;
    }
  }

  async getSiteUrls() {
    try {
      const general = await this.getPublicCategorySettings("GENERAL");
      return {
        siteUrl: general.siteUrl,
        adminPanelUrl: general.adminPanelUrl,
        frontendUrl: general.frontendUrl,
        apiUrl: general.apiUrl,
      };
    } catch (error) {
      console.error("Failed to get site URLs:", error);
      return {
        siteUrl: window.location.origin,
        adminPanelUrl: window.location.origin,
        frontendUrl: window.location.origin,
        apiUrl: `${window.location.origin}/api`,
      };
    }
  }

  async getLocalization() {
    try {
      const general = await this.getPublicCategorySettings("GENERAL");
      return {
        timezone: general.timezone,
        dateFormat: general.dateFormat,
        timeFormat: general.timeFormat,
        language: general.language,
        currency: general.currency,
      };
    } catch (error) {
      console.error("Failed to get localization settings:", error);
      return {
        timezone: "UTC",
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm:ss",
        language: "en",
        currency: "USD",
      };
    }
  }

  handleError(error) {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      if (status === 403) {
        return new Error("You don't have permission to access these settings");
      }
      if (status === 404) {
        return new Error("Settings category not found");
      }
      if (status === 422) {
        return new Error(`Validation failed: ${message}`);
      }

      return new Error(message);
    }

    return error;
  }

  subscribeToChanges(category, callback) {
    // This would integrate with WebSocket or Server-Sent Events
    // For now, it's a placeholder for future implementation

    const handleStorageChange = (e) => {
      if (e.key === `settings_${category}`) {
        callback(JSON.parse(e.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }
}

// Create and export singleton instance
const settingsService = new SettingsService();

export default settingsService;

// Named exports for specific use cases
export { SettingsService };
