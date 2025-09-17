import { adminHttpService, publicHttpService } from "./http/index";
import {
  ADMIN_SERVICE_CONFIG,
  ERROR_TYPES,
  OPERATION_TYPES,
} from "./admin/config";
import { ENDPOINTS } from "./admin/endpoints";

import { categorizeError, AdminServiceError } from "./admin/errors";

function buildUrl(endpoint, id = null) {
  const fullPath = `${ADMIN_SERVICE_CONFIG.BASE_ENDPOINT}${endpoint}`;
  return id ? `${fullPath}/${id}` : fullPath;
}

function validateInput(data, schema) {
  // Basic validation - in production, use a proper validation library
  if (!data) return { isValid: false, errors: ["Data is required"] };

  const errors = [];
  Object.keys(schema).forEach((key) => {
    const rule = schema[key];
    const value = data[key];

    if (
      rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push(`${key} is required`);
    }

    if (value && rule.type && typeof value !== rule.type) {
      errors.push(`${key} must be of type ${rule.type}`);
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      errors.push(`${key} must be at least ${rule.minLength} characters`);
    }
  });

  return { isValid: errors.length === 0, errors };
}

async function executeOperation(
  operationName,
  operationType,
  apiCall,
  options = {}
) {
  const startTime = Date.now();
  const operationId = `${operationName}_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 5)}`;

  try {
    // Log operation start if audit is enabled
    if (ADMIN_SERVICE_CONFIG.AUDIT_ENABLED) {
      console.info(
        `[AdminService] Starting ${operationType} operation: ${operationName}`,
        {
          operationId,
          timestamp: new Date().toISOString(),
          context: options.context || {},
        }
      );
    }

    // Input validation if schema provided
    if (options.validationSchema && options.data) {
      const validation = validateInput(options.data, options.validationSchema);
      if (!validation.isValid) {
        throw new AdminServiceError(`Validation failed for ${operationName}`, {
          type: ERROR_TYPES.VALIDATION_ERROR,
          operation: operationName,
          context: { validationErrors: validation.errors },
          suggestions: ["Please check the input data and try again"],
        });
      }
    }

    // Execute the API call
    const { data } = await apiCall();

    // Log successful operation
    const duration = Date.now() - startTime;
    if (ADMIN_SERVICE_CONFIG.AUDIT_ENABLED) {
      console.info(`[AdminService] Operation completed: ${operationName}`, {
        operationId,
        duration: `${duration}ms`,
        success: true,
        timestamp: new Date().toISOString(),
      });
    }

    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorType = categorizeError(error);

    // Enhanced error logging
    console.error(`[AdminService] Operation failed: ${operationName}`, {
      operationId,
      duration: `${duration}ms`,
      error: error.message,
      errorType,
      status: error.response?.status,
      timestamp: new Date().toISOString(),
      context: options.context || {},
    });

    // Create enhanced error with suggestions
    const suggestions = getSuggestions(errorType, operationName);
    throw new AdminServiceError(`Failed to ${operationName}`, {
      type: errorType,
      operation: operationName,
      originalError: error,
      context: {
        status: error.response?.status,
        duration: `${duration}ms`,
        ...options.context,
      },
      suggestions,
    });
  }
}

function getSuggestions(errorType, operationName) {
  switch (errorType) {
    case ERROR_TYPES.AUTH_ERROR:
      return ["Please log in again", "Check if your session has expired"];
    case ERROR_TYPES.PERMISSION_ERROR:
      return [
        "Contact your administrator for required permissions",
        "Verify your admin role",
      ];
    case ERROR_TYPES.RATE_LIMIT_ERROR:
      return [
        "Please wait a moment before trying again",
        "Consider reducing request frequency",
      ];
    case ERROR_TYPES.NETWORK_ERROR:
      return ["Check your internet connection", "Try again in a moment"];
    case ERROR_TYPES.VALIDATION_ERROR:
      return [
        "Review the input data for errors",
        "Ensure all required fields are provided",
      ];
    default:
      return ["Try again later", "Contact support if the problem persists"];
  }
}

export async function getSetupStatus() {
  return executeOperation(
    "getSetupStatus",
    OPERATION_TYPES.READ,
    () => publicHttpService.get(buildUrl(ENDPOINTS.SETUP.STATUS)),
    { context: { public: true } }
  );
}

export async function createInitialAdmin(adminData) {
  return executeOperation(
    "createInitialAdmin",
    OPERATION_TYPES.CREATE,
    () =>
      adminHttpService.post(buildUrl(ENDPOINTS.SETUP.INITIAL_ADMIN), adminData),
    {
      data: adminData,
      validationSchema: {
        email: { required: true, type: "string" },
        password: { required: true, type: "string", minLength: 8 },
        firstName: { required: true, type: "string" },
        lastName: { required: true, type: "string" },
      },
      context: { sensitive: true },
    }
  );
}

export async function validateInviteToken(token) {
  return executeOperation(
    "validateInviteToken",
    OPERATION_TYPES.READ,
    () => adminHttpService.get(buildUrl(ENDPOINTS.SETUP.INVITE, token)),
    {
      validationSchema: { token: { required: true, type: "string" } },
      data: { token },
      context: { token: token.substring(0, 8) + "..." },
    }
  );
}

export async function completeRegistration(registrationData) {
  return executeOperation(
    "completeRegistration",
    OPERATION_TYPES.CREATE,
    () =>
      adminHttpService.post(
        buildUrl(ENDPOINTS.SETUP.REGISTER),
        registrationData
      ),
    {
      data: registrationData,
      validationSchema: {
        token: { required: true, type: "string" },
        password: { required: true, type: "string", minLength: 8 },
      },
      context: { sensitive: true },
    }
  );
}

export async function verifyEmail(verificationData) {
  return executeOperation(
    "verifyEmail",
    OPERATION_TYPES.SECURITY,
    () =>
      adminHttpService.post(
        buildUrl(ENDPOINTS.SETUP.VERIFY_CONTACTS),
        verificationData
      ),
    {
      data: verificationData,
      validationSchema: {
        token: { required: true, type: "string" },
        code: { required: true, type: "string" },
      },
      context: { sensitive: true },
    }
  );
}

export async function complete2FA(twoFAData) {
  try {
    const data = await executeOperation(
      "complete2FA",
      OPERATION_TYPES.SECURITY,
      () =>
        adminHttpService.post(
          buildUrl(ENDPOINTS.SETUP.COMPLETE_2FA),
          twoFAData
        ),
      {
        data: twoFAData,
        validationSchema: {
          token: { required: true, type: "string" },
          code: { required: true, type: "string" },
        },
        context: { sensitive: true, authenticationFlow: true },
      }
    );

    // Handle token setting correctly
    if (data.accessToken) {
      adminHttpService.setTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        expiresAt: data.expiresAt,
      });

      console.info(
        "[AdminService] Admin authentication completed successfully"
      );
    }

    return data;
  } catch (error) {
    console.error("[AdminService] 2FA completion failed:", error);
    throw error;
  }
}

export async function resendVerificationCode(tokenData) {
  return executeOperation(
    "resendVerificationCode",
    OPERATION_TYPES.SECURITY,
    () =>
      adminHttpService.post(buildUrl(ENDPOINTS.SETUP.RESEND_CODES), tokenData),
    {
      data: tokenData,
      validationSchema: { token: { required: true, type: "string" } },
      context: { sensitive: true },
    }
  );
}

// ============================================================================
// INVITE MANAGEMENT OPERATIONS
// ============================================================================

export async function createAdminInvite(inviteData) {
  return executeOperation(
    "createAdminInvite",
    OPERATION_TYPES.CREATE,
    () => adminHttpService.post(buildUrl(ENDPOINTS.SETUP.INVITE), inviteData),
    {
      data: inviteData,
      validationSchema: {
        email: { required: true, type: "string" },
        role: { required: true, type: "string" },
      },
      context: { inviteEmail: inviteData?.email },
    }
  );
}

export async function getInvites(params = {}) {
  return executeOperation(
    "getInvites",
    OPERATION_TYPES.READ,
    () => adminHttpService.get(buildUrl(ENDPOINTS.SETUP.INVITES), { params }),
    { context: { params } }
  );
}

export async function cancelInvite(inviteId) {
  return executeOperation(
    "cancelInvite",
    OPERATION_TYPES.DELETE,
    () => adminHttpService.delete(buildUrl(ENDPOINTS.SETUP.INVITE, inviteId)),
    {
      validationSchema: { inviteId: { required: true, type: "string" } },
      data: { inviteId },
      context: { inviteId },
    }
  );
}

// ============================================================================
// STATISTICS & MONITORING OPERATIONS
// ============================================================================

export async function getAdminStats() {
  return executeOperation(
    "getAdminStats",
    OPERATION_TYPES.READ,
    () => adminHttpService.get(buildUrl(ENDPOINTS.SETUP.STATS)),
    { context: { cacheable: true } }
  );
}

export async function getMetrics() {
  return executeOperation(
    "getMetrics",
    OPERATION_TYPES.READ,
    () => adminHttpService.get(buildUrl(ENDPOINTS.SETUP.METRICS)),
    { context: { cacheable: true } }
  );
}

// ============================================================================
// ADMIN MANAGEMENT OPERATIONS
// ============================================================================

export async function getAdminList(params = {}) {
  return executeOperation(
    "getAdminList",
    OPERATION_TYPES.READ,
    () => adminHttpService.get(buildUrl(ENDPOINTS.SETUP.ADMINS), { params }),
    { context: { params, cacheable: true } }
  );
}

export async function updateAdmin(adminId, updateData) {
  return executeOperation(
    "updateAdmin",
    OPERATION_TYPES.UPDATE,
    () =>
      adminHttpService.put(
        buildUrl(ENDPOINTS.SETUP.ADMINS, adminId),
        updateData
      ),
    {
      data: updateData,
      validationSchema: {
        adminId: { required: true, type: "string" },
      },
      context: { adminId, sensitive: true },
    }
  );
}

export async function deleteAdmin(adminId) {
  return executeOperation(
    "deleteAdmin",
    OPERATION_TYPES.DELETE,
    () => adminHttpService.delete(buildUrl(ENDPOINTS.SETUP.ADMINS, adminId)),
    {
      validationSchema: { adminId: { required: true, type: "string" } },
      data: { adminId },
      context: { adminId, sensitive: true, destructive: true },
    }
  );
}

export async function updateAdminStatus(adminId, statusData) {
  return executeOperation(
    "updateAdminStatus",
    OPERATION_TYPES.UPDATE,
    () =>
      adminHttpService.patch(
        buildUrl(`${ENDPOINTS.SETUP.ADMINS}/${adminId}/status`),
        statusData
      ),
    {
      data: statusData,
      validationSchema: {
        adminId: { required: true, type: "string" },
        status: { required: true, type: "string" },
      },
      context: { adminId, newStatus: statusData?.status, sensitive: true },
    }
  );
}

// ============================================================================
// SECURITY MANAGEMENT OPERATIONS
// ============================================================================

export async function enable2FA() {
  return executeOperation(
    "enable2FA",
    OPERATION_TYPES.SECURITY,
    () => adminHttpService.post(buildUrl(ENDPOINTS.SECURITY.ENABLE_2FA)),
    { context: { sensitive: true, securityOperation: true } }
  );
}

export async function disable2FA(disableData) {
  return executeOperation(
    "disable2FA",
    OPERATION_TYPES.SECURITY,
    () =>
      adminHttpService.post(
        buildUrl(ENDPOINTS.SECURITY.DISABLE_2FA),
        disableData
      ),
    {
      data: disableData,
      validationSchema: { password: { required: true, type: "string" } },
      context: { sensitive: true, securityOperation: true },
    }
  );
}

export async function generateBackupCodes() {
  return executeOperation(
    "generateBackupCodes",
    OPERATION_TYPES.SECURITY,
    () => adminHttpService.post(buildUrl(ENDPOINTS.SECURITY.BACKUP_CODES)),
    { context: { sensitive: true, securityOperation: true } }
  );
}

export async function updatePassword(passwordData) {
  return executeOperation(
    "updatePassword",
    OPERATION_TYPES.SECURITY,
    () =>
      adminHttpService.put(
        buildUrl(ENDPOINTS.SECURITY.UPDATE_PASSWORD),
        passwordData
      ),
    {
      data: passwordData,
      validationSchema: {
        currentPassword: { required: true, type: "string" },
        newPassword: { required: true, type: "string", minLength: 8 },
      },
      context: { sensitive: true, securityOperation: true },
    }
  );
}

// ============================================================================
// LOGGING & AUDIT OPERATIONS
// ============================================================================

export async function getActivityLogs(params = {}) {
  return executeOperation(
    "getActivityLogs",
    OPERATION_TYPES.READ,
    () => adminHttpService.get(buildUrl(ENDPOINTS.SETUP.ACTIVITY), { params }),
    { context: { params, auditOperation: true } }
  );
}

export async function getAuditLogs(params = {}) {
  return executeOperation(
    "getAuditLogs",
    OPERATION_TYPES.READ,
    () => adminHttpService.get(buildUrl(ENDPOINTS.SETUP.AUDIT), { params }),
    { context: { params, auditOperation: true, sensitive: true } }
  );
}

// ============================================================================
// SYSTEM MANAGEMENT OPERATIONS
// ============================================================================

export async function performCleanup() {
  return executeOperation(
    "performCleanup",
    OPERATION_TYPES.SYSTEM,
    () => adminHttpService.post(buildUrl(ENDPOINTS.SETUP.CLEANUP)),
    { context: { sensitive: true, systemOperation: true, destructive: true } }
  );
}

export async function getSystemHealth() {
  return executeOperation(
    "getSystemHealth",
    OPERATION_TYPES.READ,
    () => adminHttpService.get(buildUrl(ENDPOINTS.SYSTEM.HEALTH)),
    { context: { systemOperation: true, cacheable: true } }
  );
}

// ============================================================================
// PROFILE & SETTINGS OPERATIONS
// ============================================================================

export async function updateProfile(profileData) {
  return executeOperation(
    "updateProfile",
    OPERATION_TYPES.UPDATE,
    () => adminHttpService.put(buildUrl(ENDPOINTS.SETUP.PROFILE), profileData),
    {
      data: profileData,
      validationSchema: {
        firstName: { required: false, type: "string" },
        lastName: { required: false, type: "string" },
        email: { required: false, type: "string" },
      },
      context: { profileUpdate: true },
    }
  );
}

export async function updateSettings(settings) {
  return executeOperation(
    "updateSettings",
    OPERATION_TYPES.UPDATE,
    () => adminHttpService.put(buildUrl(ENDPOINTS.SETUP.SETTINGS), settings),
    {
      data: settings,
      context: { settingsUpdate: true, sensitive: true },
    }
  );
}

// ============================================================================
// USER DATA OPERATIONS
// ============================================================================

export async function getAdminUser() {
  return executeOperation(
    "getAdminUser",
    OPERATION_TYPES.READ,
    () => adminHttpService.get(buildUrl("")),
    { context: { userProfile: true, cacheable: true } }
  );
}

// ============================================================================
// BUSINESS INTELLIGENCE & ANALYTICS
// ============================================================================

export async function getDashboardData() {
  try {
    const [stats, metrics, health] = await Promise.allSettled([
      getAdminStats(),
      getMetrics(),
      getSystemHealth(),
    ]);

    return {
      stats: stats.status === "fulfilled" ? stats.value : null,
      metrics: metrics.status === "fulfilled" ? metrics.value : null,
      health: health.status === "fulfilled" ? health.value : null,
      timestamp: new Date().toISOString(),
      errors: [stats, metrics, health]
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason.message),
    };
  } catch (error) {
    console.error("[AdminService] Failed to get dashboard data:", error);
    throw new AdminServiceError("Failed to load dashboard data", {
      type: ERROR_TYPES.SERVER_ERROR,
      operation: "getDashboardData",
      originalError: error,
      suggestions: ["Try refreshing the page", "Check your connection"],
    });
  }
}

export async function getAdminOverview(adminId) {
  try {
    const [adminData, activityLogs] = await Promise.allSettled([
      adminHttpService.get(buildUrl(ENDPOINTS.SETUP.ADMINS, adminId)),
      getActivityLogs({ adminId, limit: 10 }),
    ]);

    return {
      admin: adminData.status === "fulfilled" ? adminData.value.data : null,
      recentActivity:
        activityLogs.status === "fulfilled" ? activityLogs.value : null,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    throw new AdminServiceError(`Failed to get overview for admin ${adminId}`, {
      type: categorizeError(error),
      operation: "getAdminOverview",
      originalError: error,
      context: { adminId },
    });
  }
}

// ============================================================================
// UTILITY & SERVICE MANAGEMENT
// ============================================================================

export function getServiceConfig() {
  return { ...ADMIN_SERVICE_CONFIG };
}

export function updateServiceConfig(newConfig) {
  Object.assign(ADMIN_SERVICE_CONFIG, newConfig);
  console.info("[AdminService] Configuration updated:", newConfig);
}

export function getServiceHealth() {
  return {
    status: "healthy",
    version: ADMIN_SERVICE_CONFIG.API_VERSION,
    timestamp: new Date().toISOString(),
    httpService: adminHttpService.getAdminCacheMetrics(),
    config: ADMIN_SERVICE_CONFIG,
  };
}

export const AdminService = {
  // Setup & Initialization
  getSetupStatus,
  createInitialAdmin,
  validateInviteToken,
  completeRegistration,
  verifyEmail,
  complete2FA,
  resendVerificationCode,

  // Invite Management
  createAdminInvite,
  getInvites,
  cancelInvite,

  // Statistics & Monitoring
  getAdminStats,
  getMetrics,

  // Admin Management
  getAdminList,
  updateAdmin,
  deleteAdmin,
  updateAdminStatus,

  // Security Management
  enable2FA,
  disable2FA,
  generateBackupCodes,
  updatePassword,

  // Logging & Audit
  getActivityLogs,
  getAuditLogs,

  // System Management
  performCleanup,
  getSystemHealth,

  // Profile & Settings
  updateProfile,
  updateSettings,

  // User Data
  getAdminUser,

  // Business Intelligence
  getDashboardData,
  getAdminOverview,

  // Utility
  getServiceConfig,
  updateServiceConfig,
  getServiceHealth,

  // Error Types
  ERROR_TYPES,
  AdminServiceError,
};

export default AdminService;
export { ERROR_TYPES };
