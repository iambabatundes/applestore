// import { BaseHttpService, ClientType } from "./httpService.js";

// class MobileHttpService extends BaseHttpService {
//   constructor(config = {}) {
//     // Mobile-specific configuration
//     const mobileConfig = {
//       // Shorter timeouts for mobile networks
//       timeout: 15000,
//       // More aggressive retries for mobile connectivity issues
//       retryAttempts: 5,
//       retryDelay: 500,
//       // Smaller cache for mobile memory constraints
//       cacheConfig: {
//         maxSize: 50,
//         defaultTTL: 2 * 60 * 1000, // 2 minutes
//       },
//       // Mobile-specific security settings
//       securityConfig: {
//         enableCSRF: false, // Often disabled for mobile apps
//         tokenRefreshThreshold: 2 * 60 * 1000, // 2 minutes
//         maxConcurrentRequests: 5, // Lower for mobile
//       },
//       ...config,
//     };

//     super(ClientType.MOBILE, mobileConfig);

//     // Mobile-specific properties
//     this.deviceInfo = this.collectDeviceInfo();
//     this.networkType = this.detectNetworkType();
//     this.setupMobileSpecificMonitoring();
//   }

//   getClientSpecificBaseURL(base) {
//     return `${base}/mobile/v1`;
//   }

//   getClientSpecificHeaders(headers) {
//     return {
//       ...headers,
//       "X-Client-Type": "mobile",
//       "X-API-Version": "mobile-v1",
//       "X-Device-Platform": this.deviceInfo.platform,
//       "X-App-Version": this.deviceInfo.appVersion,
//       "X-Device-ID": this.deviceInfo.deviceId,
//       "X-Network-Type": this.networkType,
//     };
//   }

//   onRequestIntercept(config) {
//     config.headers = config.headers || {};
//     config.headers["X-Request-Source"] = "mobile-app";
//     config.headers["X-Request-ID"] = this.generateRequestId();

//     // Add mobile-specific request metadata
//     config.metadata = {
//       ...config.metadata,
//       isMobile: true,
//       networkType: this.networkType,
//       timestamp: Date.now(),
//     };

//     // Adjust timeout based on network type
//     if (this.networkType === "slow-2g" || this.networkType === "2g") {
//       config.timeout = Math.max(config.timeout || 15000, 30000);
//     }

//     return config;
//   }

//   async onErrorIntercept(error) {
//     const response = error.response;
//     const config = error.config;

//     // Mobile-specific error handling
//     if (!response && error.request) {
//       // Network error - common on mobile
//       console.warn("Mobile network error:", {
//         networkType: this.networkType,
//         isOnline: this.isOnline,
//         url: config?.url,
//       });
//     }

//     if (response?.status === 413) {
//       // Payload too large - common with mobile uploads
//       console.warn("Upload too large for mobile connection");
//     }

//     if (response?.status === 429) {
//       // Rate limited - mobile apps often hit this
//       console.warn("Mobile app rate limited");
//     }
//   }

//   collectDeviceInfo() {
//     const userAgent =
//       typeof navigator !== "undefined" ? navigator.userAgent : "";

//     return {
//       platform: this.detectPlatform(userAgent),
//       appVersion: this.getAppVersion(),
//       deviceId: this.getOrCreateDeviceId(),
//       screenSize:
//         typeof window !== "undefined"
//           ? `${window.screen.width}x${window.screen.height}`
//           : "unknown",
//       userAgent: userAgent,
//     };
//   }

//   detectPlatform(userAgent) {
//     if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
//     if (/Android/i.test(userAgent)) return "Android";
//     if (/Windows Phone/i.test(userAgent)) return "WindowsPhone";
//     return "Unknown";
//   }

//   getAppVersion() {
//     // Try to get from environment variables or meta tags
//     return (
//       process.env.REACT_APP_VERSION ||
//       document.querySelector('meta[name="app-version"]')?.content ||
//       "1.0.0"
//     );
//   }

//   getOrCreateDeviceId() {
//     const key = "mobile_device_id";
//     let deviceId = this.storage.getItem(key, false);

//     if (!deviceId) {
//       deviceId = this.generateDeviceId();
//       this.storage.setItem(key, deviceId, false);
//     }

//     return deviceId;
//   }

//   generateDeviceId() {
//     return (
//       "mobile_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
//     );
//   }

//   generateRequestId() {
//     return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
//   }

//   detectNetworkType() {
//     if (typeof navigator !== "undefined" && "connection" in navigator) {
//       const connection =
//         navigator.connection ||
//         navigator.mozConnection ||
//         navigator.webkitConnection;
//       return connection?.effectiveType || "unknown";
//     }
//     return "unknown";
//   }

//   setupMobileSpecificMonitoring() {
//     if (typeof window === "undefined") return;

//     // Monitor network changes (mobile-specific)
//     if ("connection" in navigator) {
//       const connection =
//         navigator.connection ||
//         navigator.mozConnection ||
//         navigator.webkitConnection;

//       if (connection) {
//         connection.addEventListener("change", () => {
//           this.networkType = connection.effectiveType;
//           this.logger?.info &&
//             this.logger.info(`Network changed to: ${this.networkType}`);
//         });
//       }
//     }

//     // Monitor app visibility (important for mobile battery optimization)
//     document.addEventListener("visibilitychange", () => {
//       if (document.hidden) {
//         this.logger?.info && this.logger.info("Mobile app went to background");
//         // Could pause non-critical requests here
//       } else {
//         this.logger?.info && this.logger.info("Mobile app came to foreground");
//         // Resume operations, refresh critical data
//       }
//     });
//   }

//   // Mobile-specific optimized request method
//   async optimizedRequest(config) {
//     // Compress request if supported and payload is large
//     if (config.data && JSON.stringify(config.data).length > 1024) {
//       config.headers = config.headers || {};
//       config.headers["Content-Encoding"] = "gzip";
//     }

//     // Use smaller timeouts for mobile
//     config.timeout = config.timeout || 15000;

//     return this.request(config);
//   }

//   // Batch requests for mobile efficiency
//   async batchRequest(requests) {
//     const results = [];
//     const batchSize = 3; // Smaller batches for mobile

//     for (let i = 0; i < requests.length; i += batchSize) {
//       const batch = requests.slice(i, i + batchSize);
//       const batchPromises = batch.map((req) =>
//         this.request(req).catch((error) => ({ error, request: req }))
//       );

//       const batchResults = await Promise.all(batchPromises);
//       results.push(...batchResults);
//     }

//     return results;
//   }

//   // Mobile-specific file upload with progress and compression
//   async uploadFile(file, endpoint, options = {}) {
//     const formData = new FormData();

//     // Compress image if it's too large (mobile-specific)
//     if (file.type.startsWith("image/") && file.size > 1024 * 1024) {
//       const compressedFile = await this.compressImage(file);
//       formData.append("file", compressedFile);
//     } else {
//       formData.append("file", file);
//     }

//     // Add mobile-specific metadata
//     formData.append("deviceType", "mobile");
//     formData.append("networkType", this.networkType);

//     return this.post(endpoint, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       timeout: 60000, // Longer timeout for uploads
//       onUploadProgress:
//         options.onProgress ||
//         ((progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           this.logger?.info &&
//             this.logger.info(`Upload progress: ${percentCompleted}%`);
//         }),
//       ...options,
//     });
//   }

//   // Simple image compression for mobile
//   async compressImage(file, maxWidth = 1200, quality = 0.8) {
//     return new Promise((resolve) => {
//       const canvas = document.createElement("canvas");
//       const ctx = canvas.getContext("2d");
//       const img = new Image();

//       img.onload = () => {
//         const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
//         canvas.width = img.width * ratio;
//         canvas.height = img.height * ratio;

//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//         canvas.toBlob(resolve, file.type, quality);
//       };

//       img.src = URL.createObjectURL(file);
//     });
//   }

//   // Mobile-specific cache optimization
//   mobileOptimizedGet(url, config = {}) {
//     // Use longer cache for mobile to reduce bandwidth
//     const mobileConfig = {
//       ...config,
//       cache: {
//         ttl: 10 * 60 * 1000, // 10 minutes
//         ...config.cache,
//       },
//     };

//     return this.get(url, mobileConfig);
//   }

//   // Prefetch critical data for offline usage
//   async prefetchCriticalData(endpoints) {
//     const results = {};

//     for (const [key, endpoint] of Object.entries(endpoints)) {
//       try {
//         results[key] = await this.mobileOptimizedGet(endpoint);
//         // Store in cache for offline access
//         this.cache.set(`prefetch_${key}`, results[key], 30 * 60 * 1000); // 30 minutes
//       } catch (error) {
//         this.logger?.warn &&
//           this.logger.warn(`Failed to prefetch ${key}:`, error);
//       }
//     }

//     return results;
//   }

//   // Get offline cached data
//   getOfflineData(key) {
//     return this.cache.get(`prefetch_${key}`);
//   }

//   // Check if device has limited connectivity
//   hasLimitedConnectivity() {
//     return (
//       this.networkType === "2g" ||
//       this.networkType === "slow-2g" ||
//       !this.isOnline
//     );
//   }

//   // Mobile-specific metrics
//   getMobileMetrics() {
//     return {
//       ...this.getCacheMetrics(),
//       deviceInfo: this.deviceInfo,
//       networkType: this.networkType,
//       isOnline: this.isOnline,
//       hasLimitedConnectivity: this.hasLimitedConnectivity(),
//     };
//   }
// }

// // Create and export singleton instance
// const mobileHttpService = new MobileHttpService();

// export { MobileHttpService };
// export default mobileHttpService;
