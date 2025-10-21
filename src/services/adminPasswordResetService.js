import { adminHttpService, publicHttpService } from "./http/index.js";

const apiPath = "/api/admins/password-reset";

function clearPasswordResetCache() {
  publicHttpService.clearCache();
}

export async function requestAdminPasswordReset(email) {
  try {
    clearPasswordResetCache();
    const response = await publicHttpService.post(`${apiPath}/password-reset`, {
      email: email.trim().toLowerCase(),
    });
    return response;
  } catch (error) {
    console.error("Request password reset failed:", error);
    throw error;
  }
}

export async function verifyAdminResetCode(email, resetCode) {
  try {
    clearPasswordResetCache();
    const response = await publicHttpService.post(`${apiPath}/verify-code`, {
      email: email.trim().toLowerCase(),
      resetCode: resetCode.trim(),
    });
    return response;
  } catch (error) {
    console.error("Verify reset code failed:", error);
    throw error;
  }
}

export async function verify2FAForAdminReset(
  resetToken,
  totpCode = null,
  backupCode = null
) {
  try {
    clearPasswordResetCache();

    if (!totpCode && !backupCode) {
      throw new Error("Either TOTP code or backup code is required");
    }

    const response = await publicHttpService.post(`${apiPath}/verify-2fa`, {
      resetToken,
      totpCode: totpCode?.trim() || undefined,
      backupCode: backupCode?.trim().toUpperCase() || undefined,
    });
    return response;
  } catch (error) {
    console.error("Verify 2FA for reset failed:", error);
    throw error;
  }
}

export async function completeAdminPasswordReset(
  resetToken,
  newPassword,
  confirmPassword
) {
  try {
    clearPasswordResetCache();
    const response = await publicHttpService.post(`${apiPath}/complete`, {
      resetToken,
      newPassword,
      confirmPassword,
    });
    return response;
  } catch (error) {
    console.error("Complete password reset failed:", error);
    throw error;
  }
}

export async function resendAdminResetCode(email) {
  try {
    clearPasswordResetCache();
    const response = await publicHttpService.post(`${apiPath}/resend`, {
      email: email.trim().toLowerCase(),
    });
    return response;
  } catch (error) {
    console.error("Resend reset code failed:", error);
    throw error;
  }
}

export async function changeAdminPassword(
  currentPassword,
  newPassword,
  confirmPassword
) {
  try {
    adminHttpService.clearCache();
    const response = await adminHttpService.post(`${apiPath}/change-password`, {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response;
  } catch (error) {
    console.error("Change password failed:", error);
    throw error;
  }
}

export async function cancelAdminPasswordReset(resetToken) {
  try {
    clearPasswordResetCache();
    const response = await publicHttpService.post(`${apiPath}/cancel-reset`, {
      resetToken,
    });
    return response;
  } catch (error) {
    console.error("Cancel password reset failed:", error);
    throw error;
  }
}

export function validatePasswordStrength(password) {
  const errors = [];

  if (!password || password.length < 12) {
    errors.push("Password must be at least 12 characters long");
  }

  if (password && password.length > 128) {
    errors.push("Password must not exceed 128 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword && password.length > 0;
}
