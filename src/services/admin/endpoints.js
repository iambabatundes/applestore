export const ENDPOINTS = {
  SETUP: {
    STATUS: "/setup/status",
    INITIAL_ADMIN: "/setup/initial-admin",
    INVITE: "/setup/invite",
    INVITES: "/setup/invites",
    REGISTER: "/setup/register",
    VERIFY_CONTACTS: "/setup/verify-contacts",
    COMPLETE_2FA: "/setup/complete-2fa",
    RESEND_CODES: "/setup/resend-codes",
    STATS: "/setup/stats",
    METRICS: "/setup/metrics",
    ADMINS: "/setup/admins",
    ACTIVITY: "/setup/activity",
    AUDIT: "/setup/audit",
    CLEANUP: "/setup/cleanup",
    PROFILE: "/setup/profile",
    SETTINGS: "/setup/settings",
  },
  SECURITY: {
    ENABLE_2FA: "/setup/security/enable-2fa",
    DISABLE_2FA: "/setup/security/disable-2fa",
    BACKUP_CODES: "/setup/security/backup-codes",
    UPDATE_PASSWORD: "/setup/security/password",
  },
  SYSTEM: {
    HEALTH: "/setup/system/health",
  },
};
