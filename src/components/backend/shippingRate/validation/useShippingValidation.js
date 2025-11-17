// useShippingValidation Hook

import { useState, useCallback, useEffect } from "react";
import {
  validateShippingRate,
  validateShippingZone,
  validateShippingAddress,
  validateShippingCalculation,
  sanitizeShippingData,
  validateWeightRatesNoOverlap,
  validatePriceRatesNoOverlap,
  hasErrors as checkHasErrors,
  getErrorMessages,
} from "./shippingValidation";

export function useShippingValidation(
  initialValues = {},
  validationType = "rate"
) {
  const [values, setValues] = useState(sanitizeShippingData(initialValues));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validation function based on type
  const getValidationFunction = useCallback(() => {
    switch (validationType) {
      case "rate":
        return validateShippingRate;
      case "zone":
        return validateShippingZone;
      case "address":
        return validateShippingAddress;
      case "calculation":
        return validateShippingCalculation;
      default:
        return validateShippingRate;
    }
  }, [validationType]);

  // Validate entire form
  const validateForm = useCallback(() => {
    setIsValidating(true);
    const validationFn = getValidationFunction();
    const result = validationFn(values);

    if (result.isValid) {
      setErrors({});
      setIsValid(true);
    } else {
      setErrors(result.errors || {});
      setIsValid(false);
    }

    setIsValidating(false);
    return result.isValid;
  }, [values, getValidationFunction]);

  // Validate single field
  const validateField = useCallback(
    (fieldName, value) => {
      const tempValues = { ...values, [fieldName]: value };
      const validationFn = getValidationFunction();
      const result = validationFn(tempValues);

      if (result.isValid) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return null;
      } else {
        const fieldError = result.errors[fieldName];
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
        }
        return fieldError || null;
      }
    },
    [values, getValidationFunction]
  );

  // Handle input change
  const handleChange = useCallback(
    (fieldName, value) => {
      const sanitizedValue = typeof value === "string" ? value.trim() : value;

      setValues((prev) => ({
        ...prev,
        [fieldName]: sanitizedValue,
      }));

      // Clear error when user starts typing
      if (touched[fieldName]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    },
    [touched]
  );

  // Handle blur event
  const handleBlur = useCallback(
    (fieldName) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
      validateField(fieldName, values[fieldName]);
    },
    [values, validateField]
  );

  // Handle nested field change (e.g., distanceRates.baseRate)
  const handleNestedChange = useCallback((parentField, childField, value) => {
    setValues((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [childField]: value,
      },
    }));
  }, []);

  // Handle array field change (e.g., weightRates, countries)
  const handleArrayChange = useCallback((fieldName, newArray) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: newArray,
    }));
  }, []);

  // Add item to array field
  const addArrayItem = useCallback((fieldName, item) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), item],
    }));
  }, []);

  // Remove item from array field
  const removeArrayItem = useCallback((fieldName, index) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: (prev[fieldName] || []).filter((_, i) => i !== index),
    }));
  }, []);

  // Update item in array field
  const updateArrayItem = useCallback((fieldName, index, updatedItem) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: (prev[fieldName] || []).map((item, i) =>
        i === index ? updatedItem : item
      ),
    }));
  }, []);

  // Reset form
  const resetForm = useCallback(
    (newValues = initialValues) => {
      setValues(sanitizeShippingData(newValues));
      setErrors({});
      setTouched({});
      setIsValid(false);
    },
    [initialValues]
  );

  // Set form values
  const setFormValues = useCallback((newValues) => {
    setValues(sanitizeShippingData(newValues));
  }, []);

  // Get field error
  const getFieldError = useCallback(
    (fieldName) => {
      return touched[fieldName] ? errors[fieldName] : null;
    },
    [errors, touched]
  );

  // Check if field has error
  const fieldHasError = useCallback(
    (fieldName) => {
      return Boolean(touched[fieldName] && errors[fieldName]);
    },
    [errors, touched]
  );

  // Mark all fields as touched (useful for form submission)
  const touchAllFields = useCallback(() => {
    const allTouched = {};
    Object.keys(values).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
  }, [values]);

  // Custom validation for weight rates (no overlap)
  const validateWeightRates = useCallback(() => {
    if (values.weightRates && values.weightRates.length > 0) {
      const isValidTiers = validateWeightRatesNoOverlap(values.weightRates);
      if (!isValidTiers) {
        setErrors((prev) => ({
          ...prev,
          weightRates: "Weight rate tiers cannot overlap",
        }));
        return false;
      }
    }
    return true;
  }, [values.weightRates]);

  // Custom validation for price rates (no overlap)
  const validatePriceRates = useCallback(() => {
    if (values.priceRates && values.priceRates.length > 0) {
      const isValidTiers = validatePriceRatesNoOverlap(values.priceRates);
      if (!isValidTiers) {
        setErrors((prev) => ({
          ...prev,
          priceRates: "Price rate tiers cannot overlap",
        }));
        return false;
      }
    }
    return true;
  }, [values.priceRates]);

  // Validate on values change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(touched).length > 0) {
        validateForm();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [values, touched, validateForm]);

  return {
    // Values
    values,
    setValues: setFormValues,

    // Errors
    errors,
    setErrors,
    getFieldError,
    fieldHasError,
    hasErrors: checkHasErrors(errors),
    errorMessages: getErrorMessages(errors),

    // Touched
    touched,
    setTouched,
    touchAllFields,

    // Validation
    isValid,
    isValidating,
    validateForm,
    validateField,
    validateWeightRates,
    validatePriceRates,

    // Handlers
    handleChange,
    handleBlur,
    handleNestedChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,

    // Utilities
    resetForm,
  };
}

export function useRateValidation(initialValues = {}) {
  return useShippingValidation(initialValues, "rate");
}

export function useZoneValidation(initialValues = {}) {
  return useShippingValidation(initialValues, "zone");
}

export function useAddressValidation(initialValues = {}) {
  return useShippingValidation(initialValues, "address");
}

export function useCalculationValidation(initialValues = {}) {
  return useShippingValidation(initialValues, "calculation");
}

// Export default
export default useShippingValidation;
