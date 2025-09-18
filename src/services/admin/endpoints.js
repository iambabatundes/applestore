export const ENDPOINTS = {
  SETUP: {
    STATUS: "/setup/status",
    INITIAL_ADMIN: "/setup/initial-admin",
    INVITE: "/invite",
    INVITES: "/invites",
    REGISTER: "/register",
    VERIFY_CONTACTS: "/verify-contacts",
    COMPLETE_2FA: "/complete-2fa",
    RESEND_CODES: "/resend-codes",
    STATS: "/stats",
    METRICS: "/metrics",
    ADMINS: "/admins",
    ACTIVITY: "/activity",
    AUDIT: "/audit",
    CLEANUP: "/cleanup",
    PROFILE: "/profile",
    SETTINGS: "/settings",
  },
  SECURITY: {
    ENABLE_2FA: "/security/enable-2fa",
    DISABLE_2FA: "/security/disable-2fa",
    BACKUP_CODES: "/security/backup-codes",
    UPDATE_PASSWORD: "/security/password",
  },
  SYSTEM: {
    HEALTH: "/system/health",
  },
};
