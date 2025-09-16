import { ERROR_TYPES } from "./config";

export function categorizeError(error) {
  const status = error.response?.status;

  switch (status) {
    case 400:
      return ERROR_TYPES.VALIDATION_ERROR;
    case 401:
      return ERROR_TYPES.AUTH_ERROR;
    case 403:
      return ERROR_TYPES.PERMISSION_ERROR;
    case 429:
      return ERROR_TYPES.RATE_LIMIT_ERROR;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_TYPES.SERVER_ERROR;
    default:
      return error.request
        ? ERROR_TYPES.NETWORK_ERROR
        : ERROR_TYPES.SERVER_ERROR;
  }
}

export class AdminServiceError extends Error {
  constructor(
    message,
    {
      type = ERROR_TYPES.SERVER_ERROR,
      operation = null,
      originalError = null,
      context = {},
      suggestions = [],
    } = {}
  ) {
    super(message);
    this.name = "AdminServiceError";
    this.type = type;
    this.operation = operation;
    this.originalError = originalError;
    this.context = context;
    this.suggestions = suggestions;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      operation: this.operation,
      context: this.context,
      suggestions: this.suggestions,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}
