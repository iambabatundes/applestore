import { BaseHttpService, ClientType } from "./httpService";

class PublicHttpService extends BaseHttpService {
  constructor(config = {}) {
    super(ClientType.PUBLIC, config);
  }

  getClientSpecificHeaders(headers) {
    return {
      ...headers,
      "X-Client-Type": "public",
    };
  }

  onRequestIntercept(config) {
    config.headers = config.headers || {};
    config.headers["X-Request-Source"] = "public-client";
    return config;
  }
}

const publicHttpService = new PublicHttpService();
export { PublicHttpService };
export default publicHttpService;

// // ===== ENHANCED PUBLIC HTTP SERVICE =====
// class PublicHttpService extends BaseHttpService {
//   constructor(config = {}) {
//     const publicConfig = {
//       timeout: 15000,
//       retryAttempts: 2,
//       cacheConfig: {
//         maxSize: 300,
//         defaultTTL: 10 * 60 * 1000, // 10 minutes for public data
//       },
//       ...config,
//     };

//     super(ClientType.PUBLIC, publicConfig);
//   }

//   getClientSpecificHeaders(headers) {
//     return {
//       ...headers,
//       "X-Client-Type": "public",
//       "X-Cache-Control": "public, max-age=300",
//     };
//   }

//   onRequestIntercept(config) {
//     config.headers = config.headers || {};
//     config.headers["X-Request-Source"] = "public-client";

//     // Add anonymous tracking ID for analytics
//     config.headers["X-Anonymous-ID"] = this.getAnonymousId();

//     return config;
//   }

//   getAnonymousId() {
//     // Generate or retrieve anonymous ID for public requests
//     let anonymousId = this.storage.getItem("anonymous_id", false);
//     if (!anonymousId) {
//       anonymousId = `anon_${Date.now()}_${Math.random()
//         .toString(36)
//         .substr(2, 9)}`;
//       this.storage.setItem("anonymous_id", anonymousId, false);
//     }
//     return anonymousId;
//   }
// }
