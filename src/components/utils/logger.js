// Log levels enum
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
};

// Environment configuration
const ENV_CONFIG = {
  development: {
    level: LOG_LEVELS.DEBUG,
    enableConsole: true,
    enableStackTrace: true,
    enableTimestamp: true,
    colorize: true,
  },
  production: {
    level: LOG_LEVELS.INFO,
    enableConsole: true,
    enableStackTrace: false,
    enableTimestamp: true,
    colorize: false,
  },
  test: {
    level: LOG_LEVELS.ERROR,
    enableConsole: false,
    enableStackTrace: false,
    enableTimestamp: false,
    colorize: false,
  },
};

// Get current environment configuration
const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || "development";
  return ENV_CONFIG[env] || ENV_CONFIG.development;
};

// Color codes for console output
const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

// Log level configurations with colors and prefixes
const LEVEL_CONFIG = {
  [LOG_LEVELS.ERROR]: {
    name: "ERROR",
    color: COLORS.red,
    prefix: "🚨",
    method: "error",
  },
  [LOG_LEVELS.WARN]: {
    name: "WARN",
    color: COLORS.yellow,
    prefix: "⚠️",
    method: "warn",
  },
  [LOG_LEVELS.INFO]: {
    name: "INFO",
    color: COLORS.blue,
    prefix: "📋",
    method: "info",
  },
  [LOG_LEVELS.DEBUG]: {
    name: "DEBUG",
    color: COLORS.cyan,
    prefix: "🔍",
    method: "debug",
  },
};

const formatTimestamp = () => {
  return new Date().toISOString();
};

const getCallerInfo = () => {
  const stack = new Error().stack;
  if (!stack) return "";

  const stackLines = stack.split("\n");
  // Find the first line that's not in this logger file
  for (let i = 3; i < stackLines.length; i++) {
    const line = stackLines[i];
    if (line && !line.includes("logger.js") && !line.includes("Logger")) {
      const match = line.match(/\s+at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
      if (match) {
        const [, functionName, fileName, lineNumber] = match;
        const shortFileName = fileName.split("/").pop();
        return `[${shortFileName}:${lineNumber}]`;
      }
    }
  }
  return "";
};

const sanitizeData = (data) => {
  if (!data || typeof data !== "object") {
    return data;
  }

  const sensitiveKeys = [
    "password",
    "token",
    "accessToken",
    "refreshToken",
    "apiKey",
    "secret",
    "auth",
    "authorization",
    "cookie",
    "session",
    "sessionId",
    "ssn",
    "creditCard",
    "cvv",
  ];

  const sanitizeObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }

    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeys.some((sensitive) =>
        lowerKey.includes(sensitive)
      );

      if (isSensitive) {
        sanitized[key] = "[REDACTED]";
      } else if (typeof value === "object") {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };

  return sanitizeObject(data);
};

const formatMessage = (level, message, metadata = {}, config) => {
  const levelInfo = LEVEL_CONFIG[level];
  const timestamp = config.enableTimestamp ? formatTimestamp() : null;
  const caller = config.enableStackTrace ? getCallerInfo() : "";

  let formattedMessage = "";

  if (config.colorize && typeof window === "undefined") {
    // Node.js environment with color support
    formattedMessage = `${levelInfo.color}${levelInfo.prefix} [${levelInfo.name}]${COLORS.reset}`;
  } else {
    // Browser environment or no color support
    formattedMessage = `${levelInfo.prefix} [${levelInfo.name}]`;
  }

  if (timestamp) {
    formattedMessage += ` ${timestamp}`;
  }

  if (caller) {
    formattedMessage += ` ${caller}`;
  }

  formattedMessage += ` - ${message}`;

  return formattedMessage;
};

const log = (level, message, ...args) => {
  const config = getCurrentConfig();

  // Check if this log level should be output
  if (level > config.level || !config.enableConsole) {
    return;
  }

  const levelInfo = LEVEL_CONFIG[level];
  if (!levelInfo) return;

  try {
    // Sanitize arguments
    const sanitizedArgs = args.map(sanitizeData);

    // Format the message
    const formattedMessage = formatMessage(level, message, {}, config);

    // Use appropriate console method
    const consoleMethod = console[levelInfo.method] || console.log;

    if (sanitizedArgs.length > 0) {
      consoleMethod(formattedMessage, ...sanitizedArgs);
    } else {
      consoleMethod(formattedMessage);
    }

    // In production, you might want to send logs to a service
    if (config.level <= LOG_LEVELS.ERROR && level === LOG_LEVELS.ERROR) {
      // Example: Send to error tracking service
      // sendToErrorService({ level: levelInfo.name, message, args: sanitizedArgs });
    }
  } catch (error) {
    // Failsafe logging
    console.error("Logger error:", error);
    console.error("Original message:", message);
  }
};

const createTimer = (label) => {
  const startTime = performance.now();

  return {
    end: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      logger.debug(`Timer [${label}]: ${duration.toFixed(2)}ms`);
      return duration;
    },
  };
};

const createGroup = (label, collapsed = false) => {
  const config = getCurrentConfig();

  if (!config.enableConsole) return { end: () => {} };

  if (collapsed) {
    console.groupCollapsed(label);
  } else {
    console.group(label);
  }

  return {
    end: () => {
      if (config.enableConsole) {
        console.groupEnd();
      }
    },
  };
};

export const logger = {
  error: (message, ...args) => {
    log(LOG_LEVELS.ERROR, message, ...args);
  },

  warn: (message, ...args) => {
    log(LOG_LEVELS.WARN, message, ...args);
  },

  info: (message, ...args) => {
    log(LOG_LEVELS.INFO, message, ...args);
  },

  debug: (message, ...args) => {
    log(LOG_LEVELS.DEBUG, message, ...args);
  },

  time: (label) => {
    return createTimer(label);
  },

  group: (label, collapsed = false) => {
    return createGroup(label, collapsed);
  },

  table: (data) => {
    const config = getCurrentConfig();
    if (
      config.enableConsole &&
      console.table &&
      typeof window !== "undefined"
    ) {
      console.table(sanitizeData(data));
    } else {
      logger.info("Table data:", data);
    }
  },

  assert: (condition, message, ...args) => {
    if (!condition) {
      logger.error(`Assertion failed: ${message}`, ...args);
    }
  },

  getLevel: () => {
    return getCurrentConfig().level;
  },

  isLevelEnabled: (level) => {
    return level <= getCurrentConfig().level;
  },
};

// Export log levels for external use
export const LogLevels = LOG_LEVELS;

// Export default
export default logger;
