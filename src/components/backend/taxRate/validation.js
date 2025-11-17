import Joi from "joi";

const taxRateSchema = Joi.object({
  country: Joi.string().min(2).max(3).uppercase().required().messages({
    "string.min": "Country code must be 2-3 characters",
    "string.max": "Country code must be 2-3 characters",
    "any.required": "Country is required",
  }),
  region: Joi.string().trim().allow(null, "").optional(),
  city: Joi.string().trim().allow(null, "").optional(),
  postalCode: Joi.string().trim().allow(null, "").optional(),

  // Tax configuration
  taxRate: Joi.number().min(0).max(100).required().messages({
    "number.min": "Tax rate must be at least 0",
    "number.max": "Tax rate cannot exceed 100",
    "any.required": "Tax rate is required",
  }),
  taxCode: Joi.string().min(3).max(50).uppercase().required().messages({
    "string.min": "Tax code must be at least 3 characters",
    "string.max": "Tax code cannot exceed 50 characters",
    "any.required": "Tax code is required",
  }),
  taxName: Joi.string().trim().max(255).required().messages({
    "string.max": "Tax name cannot exceed 255 characters",
    "any.required": "Tax name is required",
  }),
  taxType: Joi.string()
    .valid("VAT", "GST", "SALES", "EXCISE", "IMPORT", "OTHER")
    .default("SALES")
    .messages({
      "any.only":
        "Tax type must be one of: VAT, GST, SALES, EXCISE, IMPORT, OTHER",
    }),

  // Scope and applicability
  isGlobal: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),
  priority: Joi.number().integer().default(0).messages({
    "number.base": "Priority must be a number",
  }),

  // Date validity
  effectiveDate: Joi.date().required().messages({
    "any.required": "Effective date is required",
    "date.base": "Effective date must be a valid date",
  }),
  expirationDate: Joi.date()
    .greater(Joi.ref("effectiveDate"))
    .allow(null, "")
    .optional()
    .messages({
      "date.greater": "Expiration date must be after effective date",
    }),

  // Tiered rates
  tieredRates: Joi.array()
    .items(
      Joi.object({
        minAmount: Joi.number().min(0).required().messages({
          "number.min": "Minimum amount must be at least 0",
          "any.required": "Minimum amount is required",
        }),
        maxAmount: Joi.number()
          .greater(Joi.ref("minAmount"))
          .required()
          .messages({
            "number.greater":
              "Maximum amount must be greater than minimum amount",
            "any.required": "Maximum amount is required",
          }),
        rate: Joi.number().min(0).max(100).required().messages({
          "number.min": "Rate must be at least 0",
          "number.max": "Rate cannot exceed 100",
          "any.required": "Rate is required",
        }),
      })
    )
    .optional(),

  // Product categories
  productCategories: Joi.array().items(Joi.string().trim()).optional(),
  excludedCategories: Joi.array().items(Joi.string().trim()).optional(),

  // Compound tax configuration
  isCompound: Joi.boolean().default(false),
  compoundOrder: Joi.number().integer().default(0),

  // Shipping taxation
  applyToShipping: Joi.boolean().default(true),

  // Metadata
  description: Joi.string().max(500).allow("").optional().messages({
    "string.max": "Description cannot exceed 500 characters",
  }),
  jurisdictionLevel: Joi.string()
    .valid("FEDERAL", "STATE", "COUNTY", "CITY", "MUNICIPAL")
    .default("STATE")
    .optional(),
  taxAuthority: Joi.string().max(255).allow("").optional(),
  lastModifiedReason: Joi.string().max(500).allow("").optional(),
});

// Update schema (all fields optional except those being validated)
const taxRateUpdateSchema = Joi.object({
  country: Joi.string().min(2).max(3).uppercase().optional(),
  region: Joi.string().trim().allow(null, "").optional(),
  city: Joi.string().trim().allow(null, "").optional(),
  postalCode: Joi.string().trim().allow(null, "").optional(),
  taxRate: Joi.number().min(0).max(100).optional(),
  taxName: Joi.string().trim().max(255).optional(),
  taxType: Joi.string()
    .valid("VAT", "GST", "SALES", "EXCISE", "IMPORT", "OTHER")
    .optional(),
  isGlobal: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
  priority: Joi.number().integer().optional(),
  effectiveDate: Joi.date().optional(),
  expirationDate: Joi.date().allow(null, "").optional(),
  tieredRates: Joi.array()
    .items(
      Joi.object({
        minAmount: Joi.number().min(0).required(),
        maxAmount: Joi.number().greater(Joi.ref("minAmount")).required(),
        rate: Joi.number().min(0).max(100).required(),
      })
    )
    .optional(),
  productCategories: Joi.array().items(Joi.string().trim()).optional(),
  excludedCategories: Joi.array().items(Joi.string().trim()).optional(),
  isCompound: Joi.boolean().optional(),
  compoundOrder: Joi.number().integer().optional(),
  applyToShipping: Joi.boolean().optional(),
  description: Joi.string().max(500).allow("").optional(),
  jurisdictionLevel: Joi.string()
    .valid("FEDERAL", "STATE", "COUNTY", "CITY", "MUNICIPAL")
    .optional(),
  taxAuthority: Joi.string().max(255).allow("").optional(),
  lastModifiedReason: Joi.string().max(500).allow("").optional(),
});

// Validate entire form
export function validateTaxRate(taxRate, isUpdate = false) {
  const schema = isUpdate ? taxRateUpdateSchema : taxRateSchema;
  return schema.validate(taxRate, { abortEarly: false });
}

// Validate individual field
export function validateProperty({ name, value, type }) {
  const obj = { [name]: type === "checkbox" ? value : value };

  // Extract the specific field schema
  const fieldSchema = taxRateSchema.extract(name);
  if (!fieldSchema) return null;

  const subSchema = Joi.object({ [name]: fieldSchema });
  const { error } = subSchema.validate(obj);

  return error ? error.details[0].message : null;
}

// Validate tiered rates for overlaps
export function validateTieredRatesOverlap(tieredRates) {
  if (!tieredRates || tieredRates.length <= 1) return null;

  const sorted = [...tieredRates].sort((a, b) => a.minAmount - b.minAmount);

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].maxAmount > sorted[i + 1].minAmount) {
      return "Tiered rates cannot overlap";
    }
  }

  return null;
}

// Helper to format validation errors for display
export function formatValidationErrors(error) {
  if (!error || !error.details) return {};

  const errors = {};
  for (const item of error.details) {
    const field = item.path[0];
    errors[field] = item.message;
  }
  return errors;
}
