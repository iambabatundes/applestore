import { BaseHttpService, ClientType } from "./httpService";
import { UserHttpService } from "./userHttpService.js";
import { AdminHttpService } from "./adminHttpService.js";
import { PublicHttpService } from "./publicHttpService.js";
// import { MobileHttpService } from "./mobileHttpService.js";

export const publicHttpService = new PublicHttpService();
export const userHttpService = new UserHttpService();
export const adminHttpService = new AdminHttpService();
// export const mobileHttpService = new MobileHttpService();

export {
  BaseHttpService,
  ClientType,
  UserHttpService,
  AdminHttpService,
  PublicHttpService,
  // MobileHttpService,
};

export default {
  public: publicHttpService,
  user: userHttpService,
  admin: adminHttpService,
  // mobile: mobileHttpService,
};

// // Utility function to get appropriate service based on context
// export function getHttpService(clientType) {
//   switch (clientType) {
//     case ClientType.PUBLIC:
//       return publicHttpService;
//     case ClientType.USER:
//       return userHttpService;
//     case ClientType.ADMIN:
//       return adminHttpService;
//     case ClientType.MOBILE:
//       return mobileHttpService;
//     default:
//       return publicHttpService;
//   }
// }

// // Factory function for creating custom configured services
// export function createHttpService(clientType, customConfig = {}) {
//   switch (clientType) {
//     case ClientType.USER:
//       return new UserHttpService(customConfig);
//     case ClientType.ADMIN:
//       return new AdminHttpService(customConfig);
//     case ClientType.MOBILE:
//       return new MobileHttpService(customConfig);
//     case ClientType.PUBLIC:
//     default:
//       return new PublicHttpService(customConfig);
//   }
// }
