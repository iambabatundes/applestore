import * as yup from "yup";

export const registerValidationSchema = yup.object().shape({
  firstName: yup.string().trim().required("First Name is required"),
  email: yup
    .string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: yup
    .string()
    .trim()
    .matches(/^[0-9]+$/, "Phone Number must contain only digits")
    .min(7, "Phone Number is too short")
    .max(15, "Phone Number is too long")
    .required("Phone Number is required"),
  username: yup
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .required("Username is required"),
  password: yup
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});
