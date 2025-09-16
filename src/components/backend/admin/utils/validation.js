export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    errors.push("Password is required");
    return errors;
  }

  if (password.length < 12) {
    errors.push("Password must be at least 12 characters long");
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

  return errors;
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return "Name must be at least 2 characters long";
  }
  if (name.length > 50) {
    return "Name must not exceed 50 characters";
  }
  return null;
};

export const validateCode = (code, expectedLength = 6) => {
  if (!code) {
    return "Code is required";
  }
  if (!/^\d+$/.test(code)) {
    return "Code must contain only numbers";
  }
  if (code.length !== expectedLength) {
    return `Code must be ${expectedLength} digits long`;
  }
  return null;
};
