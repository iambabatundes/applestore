// /utils/cartValidation.js
export const validateQuantity = (quantity, item, isCustom = false) => {
  const errors = [];

  // Basic validation
  if (typeof quantity !== "number" || isNaN(quantity)) {
    errors.push("Please enter a valid number");
    return { isValid: false, errors };
  }

  if (quantity < 1) {
    errors.push("Quantity must be at least 1");
  }

  if (isCustom && quantity < 10) {
    errors.push("Custom quantity must be 10 or more");
  }

  // Stock validation
  if (item?.numberInStock !== undefined && quantity > item.numberInStock) {
    errors.push(`Only ${item.numberInStock} items available in stock`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    validatedQuantity: Math.min(quantity, item?.numberInStock || quantity),
  };
};

// Real-time validation for debounced inputs
export const getRealTimeValidation = (quantity, item, isCustom = false) => {
  const { isValid, errors } = validateQuantity(quantity, item, isCustom);

  return {
    isValid,
    errors,
    warning:
      quantity > (item?.numberInStock || 0)
        ? `Maximum available: ${item.numberInStock}`
        : null,
    canAutoUpdate: isValid && quantity <= (item?.numberInStock || Infinity),
  };
};
