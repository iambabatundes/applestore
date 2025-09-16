export const SETUP_STEPS = [
  {
    id: "status",
    label: "Check Status",
    description: "Verify system setup requirements",
  },
  {
    id: "create",
    label: "Create Admin",
    description: "Set up super administrator account",
  },
  { id: "verify", label: "Verify Email", description: "Confirm email address" },
  {
    id: "setup-2fa",
    label: "Setup 2FA",
    description: "Configure two-factor authentication",
  },
  { id: "backup", label: "Backup Codes", description: "Save recovery codes" },
  {
    id: "complete",
    label: "Complete",
    description: "Setup finished successfully",
  },
];

export const PASSWORD_REQUIREMENTS = [
  "At least 12 characters long",
  "Contains uppercase and lowercase letters",
  "Contains at least one number",
  "Contains at least one special character (!@#$%^&* etc.)",
  "Cannot be a common password or personal information",
];

export const ADMIN_ROLES = [
  {
    value: "super_admin",
    label: "Super Administrator",
    description: "Full system access and control",
    permissions: ["all"],
  },
  {
    value: "admin",
    label: "Administrator",
    description: "Standard administrative privileges",
    permissions: ["users", "products", "orders", "analytics", "settings"],
  },
  {
    value: "moderator",
    label: "Moderator",
    description: "Content and user moderation",
    permissions: ["users", "content", "reports"],
  },
  {
    value: "support",
    label: "Support",
    description: "Customer support access",
    permissions: ["users", "orders", "support"],
  },
];

export const SETUP_STATUS_MESSAGES = {
  pending: "System setup is required",
  completed: "System setup is already complete",
  locked: "System setup is locked for security",
  in_progress: "Setup is currently in progress",
};
