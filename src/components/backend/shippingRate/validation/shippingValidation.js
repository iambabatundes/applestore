// shippingValidation.js
import Joi from "joi";

export const shippingRateSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": "Rate name is required",
    "string.min": "Rate name must be at least 3 characters",
    "string.max": "Rate name cannot exceed 100 characters",
    "any.required": "Rate name is required",
  }),

  code: Joi.string()
    .trim()
    .uppercase()
    .min(2)
    .max(50)
    .pattern(/^[A-Z0-9_-]+$/)
    .required()
    .messages({
      "string.empty": "Rate code is required",
      "string.pattern.base":
        "Rate code can only contain uppercase letters, numbers, hyphens, and underscores",
      "string.min": "Rate code must be at least 2 characters",
      "string.max": "Rate code cannot exceed 50 characters",
      "any.required": "Rate code is required",
    }),

  displayName: Joi.string().trim().max(100).allow("").messages({
    "string.max": "Display name cannot exceed 100 characters",
  }),

  carrier: Joi.string()
    .valid(
      "standard",
      "express",
      "overnight",
      "ups",
      "fedex",
      "dhl",
      "usps",
      "custom"
    )
    .required()
    .messages({
      "any.only": "Please select a valid carrier",
      "any.required": "Carrier is required",
    }),

  carrierServiceCode: Joi.string().trim().max(100).allow("").messages({
    "string.max": "Carrier service code cannot exceed 100 characters",
  }),

  shippingZone: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid shipping zone ID",
      "any.required": "Shipping zone is required",
    }),

  pricingType: Joi.string()
    .valid("flat", "weight_based", "price_based", "distance_based", "custom")
    .required()
    .messages({
      "any.only": "Please select a valid pricing type",
      "any.required": "Pricing type is required",
    }),

  flatRate: Joi.when("pricingType", {
    is: "flat",
    then: Joi.number().min(0).precision(2).required().messages({
      "number.min": "Flat rate must be 0 or greater",
      "number.base": "Flat rate must be a valid number",
      "any.required": "Flat rate is required for flat pricing",
    }),
    otherwise: Joi.number().optional().allow(null, ""),
  }),

  weightRates: Joi.array()
    .items(
      Joi.object({
        minWeight: Joi.number().min(0).required().messages({
          "number.min": "Minimum weight must be 0 or greater",
          "any.required": "Minimum weight is required",
        }),
        maxWeight: Joi.number().min(Joi.ref("minWeight")).required().messages({
          "number.min": "Maximum weight must be greater than minimum weight",
          "any.required": "Maximum weight is required",
        }),
        rate: Joi.number().min(0).precision(2).required().messages({
          "number.min": "Rate must be 0 or greater",
          "any.required": "Rate is required",
        }),
      })
    )
    .optional(),

  priceRates: Joi.array()
    .items(
      Joi.object({
        minPrice: Joi.number().min(0).required().messages({
          "number.min": "Minimum price must be 0 or greater",
          "any.required": "Minimum price is required",
        }),
        maxPrice: Joi.number().min(Joi.ref("minPrice")).required().messages({
          "number.min": "Maximum price must be greater than minimum price",
          "any.required": "Maximum price is required",
        }),
        rate: Joi.number().min(0).precision(2).messages({
          "number.min": "Rate must be 0 or greater",
        }),
        percentage: Joi.number().min(0).max(100).precision(2).messages({
          "number.min": "Percentage must be 0 or greater",
          "number.max": "Percentage cannot exceed 100",
        }),
      }).or("rate", "percentage")
    )
    .optional(),

  distanceRates: Joi.object({
    baseRate: Joi.number().min(0).precision(2).default(0).messages({
      "number.min": "Base rate must be 0 or greater",
    }),
    ratePerKm: Joi.number().min(0).precision(2).messages({
      "number.min": "Rate per km must be 0 or greater",
    }),
    ratePerMile: Joi.number().min(0).precision(2).messages({
      "number.min": "Rate per mile must be 0 or greater",
    }),
    maxDistance: Joi.number().min(0).messages({
      "number.min": "Maximum distance must be 0 or greater",
    }),
  }).optional(),

  freeShippingThreshold: Joi.number()
    .min(0)
    .precision(2)
    .allow(null, "")
    .messages({
      "number.min": "Free shipping threshold must be 0 or greater",
    }),

  estimatedDeliveryDays: Joi.object({
    min: Joi.number().integer().min(0).default(1).messages({
      "number.min": "Minimum delivery days must be 0 or greater",
      "number.integer": "Minimum delivery days must be a whole number",
    }),
    max: Joi.number().integer().min(Joi.ref("min")).default(7).messages({
      "number.min":
        "Maximum delivery days must be greater than or equal to minimum",
      "number.integer": "Maximum delivery days must be a whole number",
    }),
  }).optional(),

  minOrderAmount: Joi.number().min(0).precision(2).default(0).messages({
    "number.min": "Minimum order amount must be 0 or greater",
  }),

  maxOrderAmount: Joi.number()
    .min(Joi.ref("minOrderAmount"))
    .precision(2)
    .allow(null)
    .messages({
      "number.min":
        "Maximum order amount must be greater than minimum order amount",
    }),

  maxWeight: Joi.number().min(0).precision(2).allow(null).messages({
    "number.min": "Maximum weight must be 0 or greater",
  }),

  priority: Joi.number().integer().default(0).messages({
    "number.integer": "Priority must be a whole number",
  }),

  isActive: Joi.boolean().default(true),

  requiresSignature: Joi.boolean().default(false),

  includesInsurance: Joi.boolean().default(false),

  includesTracking: Joi.boolean().default(true),

  description: Joi.string().trim().max(500).allow("").messages({
    "string.max": "Description cannot exceed 500 characters",
  }),

  applicableCategories: Joi.array().items(Joi.string()).optional(),

  excludedCategories: Joi.array().items(Joi.string()).optional(),

  applicableProducts: Joi.array()
    .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
    .optional(),
});

export const shippingZoneSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Zone name is required",
    "string.min": "Zone name must be at least 2 characters",
    "string.max": "Zone name cannot exceed 100 characters",
    "any.required": "Zone name is required",
  }),

  code: Joi.string()
    .trim()
    .uppercase()
    .min(2)
    .max(50)
    .pattern(/^[A-Z0-9_-]+$/)
    .required()
    .messages({
      "string.empty": "Zone code is required",
      "string.pattern.base":
        "Zone code can only contain uppercase letters, numbers, hyphens, and underscores",
      "string.min": "Zone code must be at least 2 characters",
      "string.max": "Zone code cannot exceed 50 characters",
      "any.required": "Zone code is required",
    }),

  countries: Joi.array()
    .items(
      Joi.string()
        .length(2)
        .uppercase()
        .pattern(/^[A-Z]{2}$/)
        .messages({
          "string.length": "Country code must be exactly 2 characters",
          "string.pattern.base":
            "Country code must be a valid ISO 3166-1 alpha-2 code (e.g., US, GB, NG)",
        })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one country is required",
      "any.required": "Countries are required",
    }),

  regions: Joi.array().items(Joi.string().trim().max(100)).optional().messages({
    "string.max": "Region name cannot exceed 100 characters",
  }),

  postalCodeRanges: Joi.array()
    .items(
      Joi.object({
        start: Joi.string().trim().max(20).required().messages({
          "string.empty": "Start postal code is required",
          "any.required": "Start postal code is required",
        }),
        end: Joi.string().trim().max(20).required().messages({
          "string.empty": "End postal code is required",
          "any.required": "End postal code is required",
        }),
      })
    )
    .optional(),

  type: Joi.string()
    .valid("domestic", "international", "regional", "custom")
    .default("domestic")
    .messages({
      "any.only": "Please select a valid zone type",
    }),

  priority: Joi.number().integer().default(0).messages({
    "number.integer": "Priority must be a whole number",
  }),

  isActive: Joi.boolean().default(true),

  description: Joi.string().trim().max(500).allow("").messages({
    "string.max": "Description cannot exceed 500 characters",
  }),

  estimatedDeliveryDays: Joi.object({
    min: Joi.number().integer().min(0).default(1).messages({
      "number.min": "Minimum delivery days must be 0 or greater",
      "number.integer": "Minimum delivery days must be a whole number",
    }),
    max: Joi.number().integer().min(Joi.ref("min")).default(7).messages({
      "number.min":
        "Maximum delivery days must be greater than or equal to minimum",
      "number.integer": "Maximum delivery days must be a whole number",
    }),
  }).optional(),
});

export const shippingAddressSchema = Joi.object({
  firstName: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "First name is required",
    "string.max": "First name cannot exceed 100 characters",
    "any.required": "First name is required",
  }),

  lastName: Joi.string().trim().min(1).max(100).required().messages({
    "string.empty": "Last name is required",
    "string.max": "Last name cannot exceed 100 characters",
    "any.required": "Last name is required",
  }),

  company: Joi.string().trim().max(100).allow("").messages({
    "string.max": "Company name cannot exceed 100 characters",
  }),

  street: Joi.string().trim().min(3).max(255).required().messages({
    "string.empty": "Street address is required",
    "string.min": "Street address must be at least 3 characters",
    "string.max": "Street address cannot exceed 255 characters",
    "any.required": "Street address is required",
  }),

  street2: Joi.string().trim().max(255).allow("").messages({
    "string.max": "Address line 2 cannot exceed 255 characters",
  }),

  city: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "City is required",
    "string.min": "City must be at least 2 characters",
    "string.max": "City cannot exceed 100 characters",
    "any.required": "City is required",
  }),

  state: Joi.string().trim().max(100).allow("").messages({
    "string.max": "State/region cannot exceed 100 characters",
  }),

  region: Joi.string().trim().max(100).allow("").messages({
    "string.max": "Region cannot exceed 100 characters",
  }),

  country: Joi.string()
    .length(2)
    .uppercase()
    .pattern(/^[A-Z]{2}$/)
    .required()
    .messages({
      "string.empty": "Country is required",
      "string.length": "Country code must be exactly 2 characters",
      "string.pattern.base":
        "Country must be a valid ISO 3166-1 alpha-2 code (e.g., US, GB, NG)",
      "any.required": "Country is required",
    }),

  postalCode: Joi.string().trim().max(20).required().messages({
    "string.empty": "Postal code is required",
    "string.max": "Postal code cannot exceed 20 characters",
    "any.required": "Postal code is required",
  }),

  phoneNumber: Joi.string()
    .trim()
    .max(20)
    .pattern(/^[+\d\s()-]+$/)
    .allow("")
    .messages({
      "string.max": "Phone number cannot exceed 20 characters",
      "string.pattern.base": "Please enter a valid phone number",
    }),

  label: Joi.string()
    .valid("home", "work", "billing", "shipping", "other")
    .default("home")
    .messages({
      "any.only": "Please select a valid address label",
    }),

  nickname: Joi.string().trim().max(50).allow("").messages({
    "string.max": "Nickname cannot exceed 50 characters",
  }),

  isDefault: Joi.boolean().default(false),

  notes: Joi.string().trim().max(500).allow("").messages({
    "string.max": "Notes cannot exceed 500 characters",
  }),
});

export const shippingCalculationSchema = Joi.object({
  orderData: Joi.object({
    subtotal: Joi.number().min(0).required().messages({
      "number.min": "Order subtotal must be 0 or greater",
      "any.required": "Order subtotal is required",
    }),
    weight: Joi.number().min(0).required().messages({
      "number.min": "Order weight must be 0 or greater",
      "any.required": "Order weight is required",
    }),
    items: Joi.array()
      .items(
        Joi.object({
          product: Joi.string().required(),
          quantity: Joi.number().integer().min(1).required(),
          price: Joi.number().min(0).required(),
          weight: Joi.number().min(0).optional(),
          category: Joi.string().optional(),
        })
      )
      .min(1)
      .required()
      .messages({
        "array.min": "At least one item is required",
        "any.required": "Order items are required",
      }),
  }).required(),

  shippingAddress: shippingAddressSchema.required(),
});

export function validateShippingRate(data) {
  const { error, value } = shippingRateSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = {};
    error.details.forEach((detail) => {
      const path = detail.path.join(".");
      errors[path] = detail.message;
    });
    return { errors, isValid: false };
  }

  return { value, isValid: true };
}

export function validateShippingZone(data) {
  const { error, value } = shippingZoneSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = {};
    error.details.forEach((detail) => {
      const path = detail.path.join(".");
      errors[path] = detail.message;
    });
    return { errors, isValid: false };
  }

  return { value, isValid: true };
}

export function validateShippingAddress(data) {
  const { error, value } = shippingAddressSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = {};
    error.details.forEach((detail) => {
      const path = detail.path.join(".");
      errors[path] = detail.message;
    });
    return { errors, isValid: false };
  }

  return { value, isValid: true };
}

export function validateShippingCalculation(data) {
  const { error, value } = shippingCalculationSchema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = {};
    error.details.forEach((detail) => {
      const path = detail.path.join(".");
      errors[path] = detail.message;
    });
    return { errors, isValid: false };
  }

  return { value, isValid: true };
}

export function validateField(fieldName, value, schema) {
  const fieldSchema = Joi.object({
    [fieldName]: schema.extract(fieldName),
  });

  const { error } = fieldSchema.validate({ [fieldName]: value });

  if (error) {
    return error.details[0].message;
  }

  return null;
}

export function isValidCountryCode(countryCode) {
  return /^[A-Z]{2}$/.test(countryCode);
}

export function isValidPostalCode(postalCode, countryCode) {
  if (!postalCode) return false;

  const postalCodePatterns = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,
    GB: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
    NG: /^\d{6}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
    AU: /^\d{4}$/,
    JP: /^\d{3}-?\d{4}$/,
    CN: /^\d{6}$/,
    IN: /^\d{6}$/,
    BR: /^\d{5}-?\d{3}$/,
  };

  if (countryCode && postalCodePatterns[countryCode]) {
    return postalCodePatterns[countryCode].test(postalCode);
  }

  // Basic validation for unknown countries
  return /^[A-Z0-9\s-]{3,20}$/i.test(postalCode);
}

export function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

export function isValidPhoneNumber(phoneNumber) {
  if (!phoneNumber) return true; // Optional field
  return /^[+\d\s()-]{7,20}$/.test(phoneNumber);
}

export function validateWeightRatesNoOverlap(weightRates) {
  if (!weightRates || weightRates.length === 0) return true;

  const sortedRates = [...weightRates].sort(
    (a, b) => a.minWeight - b.minWeight
  );

  for (let i = 0; i < sortedRates.length - 1; i++) {
    if (sortedRates[i].maxWeight > sortedRates[i + 1].minWeight) {
      return false;
    }
  }

  return true;
}

export function validatePriceRatesNoOverlap(priceRates) {
  if (!priceRates || priceRates.length === 0) return true;

  const sortedRates = [...priceRates].sort((a, b) => a.minPrice - b.minPrice);

  for (let i = 0; i < sortedRates.length - 1; i++) {
    if (sortedRates[i].maxPrice > sortedRates[i + 1].minPrice) {
      return false;
    }
  }

  return true;
}

export function sanitizeShippingData(data) {
  const sanitized = { ...data };

  // Trim string values
  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitized[key].trim();
    }
  });

  // Uppercase country codes
  if (sanitized.country) {
    sanitized.country = sanitized.country.toUpperCase();
  }

  if (sanitized.countries && Array.isArray(sanitized.countries)) {
    sanitized.countries = sanitized.countries.map((c) => c.toUpperCase());
  }

  // Uppercase codes
  if (sanitized.code) {
    sanitized.code = sanitized.code.toUpperCase().replace(/\s+/g, "_");
  }

  // Parse numeric values
  const numericFields = [
    "flatRate",
    "baseRate",
    "ratePerKm",
    "ratePerMile",
    "freeShippingThreshold",
    "minOrderAmount",
    "maxOrderAmount",
    "maxWeight",
    "priority",
    "subtotal",
    "weight",
  ];

  numericFields.forEach((field) => {
    if (
      sanitized[field] !== undefined &&
      sanitized[field] !== null &&
      sanitized[field] !== ""
    ) {
      sanitized[field] = parseFloat(sanitized[field]);
    }
  });

  return sanitized;
}

export function getErrorMessages(errors) {
  if (!errors) return [];

  return Object.values(errors).filter(Boolean);
}

export function hasErrors(errors) {
  if (!errors) return false;
  return Object.keys(errors).some((key) => errors[key]);
}

// Export all schemas for custom validation
export {
  shippingRateSchema as rateSchema,
  shippingZoneSchema as zoneSchema,
  shippingAddressSchema as addressSchema,
  shippingCalculationSchema as calculationSchema,
};
