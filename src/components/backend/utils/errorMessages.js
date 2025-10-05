// Enhanced error message utility with improved 423 lockout handling

export const getUserFriendlyErrorMessage = (error, context = {}) => {
  const {
    isTwoFactorStep = false,
    isRegistration = false,
    isPasswordReset = false,
    operation = "operation",
  } = context;

  console.log("🔍 Processing error in getUserFriendlyErrorMessage:", {
    hasResponse: !!error.response,
    status: error.response?.status,
    responseData: error.response?.data,
    errorMessage: error.message,
  });

  // Check if it's an axios error with response
  if (error.response) {
    const { status, data: errorData } = error.response;

    console.log(`🔍 Error status: ${status}, data:`, errorData);

    // Extract message from various possible response structures
    const serverMessage =
      errorData?.error?.message ||
      errorData?.message ||
      errorData?.details?.message ||
      errorData?.error ||
      null;

    switch (status) {
      case 400:
        return handle400Error(serverMessage, {
          isTwoFactorStep,
          isRegistration,
          isPasswordReset,
        });

      case 401:
        return handle401Error(serverMessage, {
          isTwoFactorStep,
          isRegistration,
        });

      case 403:
        return handle403Error(serverMessage, { isRegistration });

      case 404:
        return handle404Error(serverMessage, { isPasswordReset });

      case 409:
        return handle409Error(serverMessage, { isRegistration });

      case 422:
        return handle422Error(serverMessage, errorData);

      case 423:
        // Enhanced 423 error handling - return structured data
        return handle423Error(serverMessage, errorData);

      case 429:
        return handle429Error(serverMessage);

      case 500:
      case 502:
      case 503:
      case 504:
        return handleServerError(status, serverMessage);

      default:
        return handleGenericError(serverMessage, status);
    }
  }

  // Handle network errors (no response received)
  if (error.request) {
    return "Unable to connect to our servers. Please check your internet connection and try again.";
  }

  // Handle other axios errors or custom errors
  if (error.message) {
    return handleErrorMessage(error.message);
  }

  // Final fallback
  return `An unexpected error occurred during ${operation}. Please try again.`;
};

/**
 * Enhanced 423 Locked error handler with comprehensive data extraction
 * Returns structured data for UI to handle countdown timers
 */
const handle423Error = (serverMessage, errorData) => {
  console.log("🔒 Processing 423 error with data:", errorData);

  // Multiple extraction methods to handle different backend response structures
  let remainingMinutes = null;
  let lockUntil = null;

  // Method 1: Direct properties
  if (errorData?.remainingMinutes) {
    remainingMinutes = errorData.remainingMinutes;
  }

  // Method 2: Nested in error object
  if (!remainingMinutes && errorData?.error?.details?.remainingMinutes) {
    remainingMinutes = errorData.error.details.remainingMinutes;
  }

  // Method 3: Nested in data object
  if (!remainingMinutes && errorData?.data?.remainingMinutes) {
    remainingMinutes = errorData.data.remainingMinutes;
  }

  // Method 4: Calculate from lockUntil timestamp
  lockUntil =
    errorData?.lockUntil ||
    errorData?.error?.details?.lockUntil ||
    errorData?.data?.lockUntil;

  if (!remainingMinutes && lockUntil) {
    try {
      const lockDate = new Date(lockUntil);
      const now = new Date();
      const diffMs = lockDate - now;
      remainingMinutes = Math.ceil(diffMs / (60 * 1000));

      // Ensure it's a positive number
      if (remainingMinutes < 0) remainingMinutes = 0;
    } catch (e) {
      console.warn("Failed to calculate remaining minutes from lockUntil:", e);
    }
  }

  // Default fallback
  if (!remainingMinutes || remainingMinutes < 0) {
    remainingMinutes = 15; // 15 minute default
  }

  // Build comprehensive message
  let message =
    serverMessage ||
    "Your account is temporarily locked due to multiple failed attempts.";

  // Add timing information if available
  if (remainingMinutes > 0) {
    const timeText = remainingMinutes === 1 ? "minute" : "minutes";
    message += ` Please try again in ${remainingMinutes} ${timeText}.`;
  } else {
    message += " Please try again later.";
  }

  const lockoutResponse = {
    message,
    isLockout: true,
    statusCode: 423,
    remainingMinutes: remainingMinutes > 0 ? remainingMinutes : null,
    lockUntil,
    userFriendly: true,
  };

  console.log("🔒 Returning lockout response:", lockoutResponse);

  return lockoutResponse;
};

/**
 * Handle 400 Bad Request errors
 */
const handle400Error = (serverMessage, context) => {
  const { isTwoFactorStep, isRegistration, isPasswordReset } = context;

  // Handle 2FA requirement
  if (
    serverMessage &&
    (serverMessage.toLowerCase().includes("2fa") ||
      serverMessage.toLowerCase().includes("two-factor") ||
      serverMessage.toLowerCase().includes("totp"))
  ) {
    return "Please enter your two-factor authentication code to continue.";
  }

  // Handle invalid credentials
  if (
    serverMessage &&
    (serverMessage.toLowerCase().includes("invalid") ||
      serverMessage.toLowerCase().includes("incorrect") ||
      serverMessage.toLowerCase().includes("wrong"))
  ) {
    if (isTwoFactorStep) {
      return "Invalid authentication code. Please check your code and try again.";
    }
    if (isRegistration) {
      return "Please check your registration details and try again.";
    }
    if (isPasswordReset) {
      return "Invalid reset token or the link has expired. Please request a new password reset.";
    }
    return "Invalid email or password. Please check your credentials and try again.";
  }

  // Handle validation errors
  if (
    serverMessage &&
    (serverMessage.toLowerCase().includes("validation") ||
      serverMessage.toLowerCase().includes("required") ||
      serverMessage.toLowerCase().includes("format"))
  ) {
    return serverMessage.length < 150
      ? serverMessage
      : "Please check your input and try again.";
  }

  // Handle 2FA specific errors
  if (isTwoFactorStep) {
    if (serverMessage && serverMessage.toLowerCase().includes("expired")) {
      return "Your authentication code has expired. Please generate a new one.";
    }
    if (serverMessage && serverMessage.toLowerCase().includes("used")) {
      return "This authentication code has already been used. Please generate a new one.";
    }
    return "Invalid authentication code. Please try again.";
  }

  // Handle registration specific errors
  if (isRegistration) {
    if (serverMessage && serverMessage.toLowerCase().includes("email")) {
      return "Please enter a valid email address.";
    }
    if (serverMessage && serverMessage.toLowerCase().includes("password")) {
      return "Password doesn't meet requirements. Please check and try again.";
    }
  }

  // Handle password reset errors
  if (isPasswordReset) {
    return "Invalid or expired reset link. Please request a new password reset.";
  }

  // Generic 400 error
  return isUserFriendlyMessage(serverMessage)
    ? serverMessage
    : "Please check your input and try again.";
};

/**
 * Handle 401 Unauthorized errors
 */
const handle401Error = (serverMessage, context) => {
  const { isTwoFactorStep, isRegistration } = context;

  if (isTwoFactorStep) {
    return "Invalid authentication code. Please try again.";
  }

  if (isRegistration) {
    return "Registration failed. Please try again.";
  }

  return "Invalid email or password. Please check your credentials.";
};

/**
 * Handle 403 Forbidden errors
 */
const handle403Error = (serverMessage, context) => {
  const { isRegistration } = context;

  if (isRegistration) {
    return "Registration is currently disabled. Please contact support.";
  }

  if (serverMessage && serverMessage.toLowerCase().includes("admin")) {
    return "Access denied. Your account may not have admin privileges.";
  }

  return "Access denied. You don't have permission to perform this action.";
};

/**
 * Handle 404 Not Found errors
 */
const handle404Error = (serverMessage, context) => {
  const { isPasswordReset } = context;

  if (isPasswordReset) {
    return "Reset link not found or has expired. Please request a new password reset.";
  }

  return "The requested resource was not found.";
};

/**
 * Handle 409 Conflict errors
 */
const handle409Error = (serverMessage, context) => {
  const { isRegistration } = context;

  if (
    isRegistration ||
    (serverMessage && serverMessage.toLowerCase().includes("exists"))
  ) {
    return "An account with this email already exists. Please use a different email or try logging in.";
  }

  return isUserFriendlyMessage(serverMessage)
    ? serverMessage
    : "A conflict occurred. Please try again.";
};

/**
 * Handle 422 Unprocessable Entity errors
 */
const handle422Error = (serverMessage, errorData) => {
  // Handle validation errors with details
  if (errorData?.errors && Array.isArray(errorData.errors)) {
    const firstError = errorData.errors[0];
    return firstError?.message || "Please check your input and try again.";
  }

  if (errorData?.validation && typeof errorData.validation === "object") {
    const firstKey = Object.keys(errorData.validation)[0];
    const firstError = errorData.validation[firstKey];
    return Array.isArray(firstError) ? firstError[0] : firstError;
  }

  return isUserFriendlyMessage(serverMessage)
    ? serverMessage
    : "Please check your input and try again.";
};

/**
 * Handle 429 Too Many Requests errors
 */
const handle429Error = (serverMessage) => {
  if (serverMessage && serverMessage.toLowerCase().includes("minute")) {
    return serverMessage;
  }
  return "Too many attempts. Please wait a few minutes before trying again.";
};

/**
 * Handle server errors (5xx)
 */
const handleServerError = (status, serverMessage) => {
  const errorMessages = {
    500: "Our servers are experiencing issues. Please try again in a few minutes.",
    502: "Service temporarily unavailable. Please try again later.",
    503: "Service temporarily unavailable for maintenance. Please try again later.",
    504: "Request timed out. Please try again.",
  };

  return errorMessages[status] || "Server error. Please try again later.";
};

/**
 * Handle generic HTTP errors
 */
const handleGenericError = (serverMessage, status) => {
  // Use server message if available and user-friendly
  if (isUserFriendlyMessage(serverMessage)) {
    return serverMessage;
  }

  return `Request failed (${status}). Please try again.`;
};

/**
 * Handle various error message patterns
 */
const handleErrorMessage = (message) => {
  const lowerMessage = message.toLowerCase();

  // Network related errors
  if (lowerMessage.includes("network error")) {
    return "Network connection failed. Please check your internet and try again.";
  }

  if (lowerMessage.includes("timeout")) {
    return "Request timed out. Please check your connection and try again.";
  }

  if (lowerMessage.includes("request failed with status code")) {
    return "Request failed. Please check your input and try again.";
  }

  if (lowerMessage.includes("cors")) {
    return "Connection error. Please try again.";
  }

  if (
    lowerMessage.includes("refused") ||
    lowerMessage.includes("unreachable")
  ) {
    return "Unable to reach the server. Please try again later.";
  }

  // For custom error messages that are already user-friendly
  if (isUserFriendlyMessage(message)) {
    return message;
  }

  return "An unexpected error occurred. Please try again.";
};

/**
 * Check if a message is user-friendly (not technical)
 */
const isUserFriendlyMessage = (message) => {
  if (!message || typeof message !== "string") return false;

  const technicalPatterns = [
    "request failed",
    "status code",
    "axios",
    "fetch",
    "cors",
    "preflight",
    "parse",
    "json",
    "syntax",
    "unexpected token",
    "stack trace",
    "at Object.",
    "at Function.",
    "TypeError:",
    "ReferenceError:",
    "SyntaxError:",
  ];

  const lowerMessage = message.toLowerCase();
  const hasTechnicalPattern = technicalPatterns.some((pattern) =>
    lowerMessage.includes(pattern)
  );

  // Consider it user-friendly if:
  // - No technical patterns
  // - Reasonable length (not too long/verbose)
  // - Doesn't look like a stack trace or technical error
  return (
    !hasTechnicalPattern &&
    message.length < 200 &&
    !message.includes("Error:") &&
    !message.includes("    at ")
  );
};

/**
 * Enhanced helper function to check if error is a lockout error
 */
export const isLockoutError = (error) => {
  console.log("🔍 Checking if error is lockout:", {
    hasResponse: !!error.response,
    status: error.response?.status,
    isLockoutFlag: error?.isLockout,
    responseData: error.response?.data,
  });

  // Method 1: Direct 423 status
  if (error?.response?.status === 423) {
    return true;
  }

  // Method 2: Error object has isLockout flag
  if (error?.isLockout === true) {
    return true;
  }

  // Method 3: Response data indicates lockout
  const responseData = error?.response?.data;
  if (
    responseData &&
    (responseData.remainingMinutes ||
      responseData.lockUntil ||
      (responseData.error &&
        responseData.error.details &&
        (responseData.error.details.remainingMinutes ||
          responseData.error.details.lockUntil)))
  ) {
    return true;
  }

  // Method 4: Message contains lockout keywords
  const message = error?.response?.data?.message || error?.message || "";
  if (
    message &&
    (message.toLowerCase().includes("locked") ||
      message.toLowerCase().includes("lockout") ||
      message.toLowerCase().includes("try again in"))
  ) {
    return true;
  }

  return false;
};

/**
 * Enhanced helper function to extract lockout data from error
 */
export const getLockoutData = (error) => {
  console.log("🔍 Extracting lockout data from error:", error);

  if (!isLockoutError(error)) return null;

  const errorData = error.response?.data || error;

  // Extract remaining minutes using multiple methods
  let remainingMinutes = null;

  // Direct property
  remainingMinutes = errorData?.remainingMinutes;

  // Nested in error details
  if (!remainingMinutes) {
    remainingMinutes = errorData?.error?.details?.remainingMinutes;
  }

  // Nested in data
  if (!remainingMinutes) {
    remainingMinutes = errorData?.data?.remainingMinutes;
  }

  // Calculate from lockUntil
  const lockUntil =
    errorData?.lockUntil || errorData?.error?.details?.lockUntil;
  if (!remainingMinutes && lockUntil) {
    try {
      const lockDate = new Date(lockUntil);
      const now = new Date();
      const diffMs = lockDate - now;
      remainingMinutes = Math.ceil(diffMs / (60 * 1000));
      if (remainingMinutes < 0) remainingMinutes = 0;
    } catch (e) {
      console.warn("Failed to calculate remaining minutes from lockUntil:", e);
    }
  }

  // Default fallback
  if (!remainingMinutes || remainingMinutes < 0) {
    remainingMinutes = 15;
  }

  const lockoutData = {
    remainingMinutes: remainingMinutes > 0 ? remainingMinutes : null,
    lockUntil: lockUntil,
    message:
      errorData?.message ||
      errorData?.error?.message ||
      "Account temporarily locked due to multiple failed attempts",
  };

  console.log("🔒 Extracted lockout data:", lockoutData);
  return lockoutData;
};

/**
 * Specialized error handlers for different contexts
 */

/**
 * Handle authentication-specific errors with lockout support
 */
export const getAuthErrorMessage = (error) => {
  const result = getUserFriendlyErrorMessage(error, { isTwoFactorStep: false });

  // If it's a lockout error, return the structured data
  if (typeof result === "object" && result.isLockout) {
    return result;
  }

  return result;
};

/**
 * Handle 2FA-specific errors with lockout support
 */
export const get2FAErrorMessage = (error) => {
  const result = getUserFriendlyErrorMessage(error, { isTwoFactorStep: true });

  // If it's a lockout error, return the structured data
  if (typeof result === "object" && result.isLockout) {
    return result;
  }

  return result;
};

/**
 * Handle registration-specific errors
 */
export const getRegistrationErrorMessage = (error) => {
  return getUserFriendlyErrorMessage(error, { isRegistration: true });
};

/**
 * Handle password reset-specific errors
 */
export const getPasswordResetErrorMessage = (error) => {
  return getUserFriendlyErrorMessage(error, { isPasswordReset: true });
};

/**
 * Handle API-specific errors with operation context
 */
export const getAPIErrorMessage = (error, operation = "request") => {
  return getUserFriendlyErrorMessage(error, { operation });
};
