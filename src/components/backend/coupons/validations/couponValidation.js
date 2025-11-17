import Joi from "joi";

const couponSchema = Joi.object({
  code: Joi.string()
    .required()
    .uppercase()
    .pattern(/^[A-Z0-9_-]+$/)
    .max(50)
    .label("Coupon Code")
    .messages({
      "string.pattern.base":
        "Coupon code must contain only letters, numbers, dashes, and underscores",
    }),

  discountType: Joi.string()
    .valid("percentage", "fixed")
    .required()
    .label("Discount Type"),

  discountPercentage: Joi.when("discountType", {
    is: "percentage",
    then: Joi.number().min(0).max(100).required().label("Discount Percentage"),
    otherwise: Joi.forbidden(),
  }),

  discountValue: Joi.when("discountType", {
    is: "fixed",
    then: Joi.number().min(0.01).required().label("Discount Value"),
    otherwise: Joi.forbidden(),
  }),

  expirationDate: Joi.date().greater("now").required().label("Expiration Date"),

  startDate: Joi.date().optional().label("Start Date"),

  minimumOrderAmount: Joi.number()
    .min(0)
    .optional()
    .default(0)
    .label("Minimum Order Amount"),

  maximumDiscountAmount: Joi.when("discountType", {
    is: "percentage",
    then: Joi.number().min(0).optional().label("Maximum Discount Amount"),
    otherwise: Joi.forbidden(),
  }),

  usageLimit: Joi.number()
    .min(1)
    .optional()
    .allow(null, "")
    .label("Usage Limit"),

  usagePerUser: Joi.number()
    .min(1)
    .max(100)
    .optional()
    .default(1)
    .label("Usage Per User"),

  description: Joi.string().max(500).optional().allow("").label("Description"),

  isActive: Joi.boolean().optional().default(true),

  firstTimeUserOnly: Joi.boolean().optional().default(false),

  applicableProducts: Joi.array().items(Joi.string()).optional(),

  applicableCategories: Joi.array().items(Joi.string()).optional(),

  excludedProducts: Joi.array().items(Joi.string()).optional(),

  excludedCategories: Joi.array().items(Joi.string()).optional(),
}).custom((value, helpers) => {
  // Validate date range
  if (value.startDate && value.expirationDate) {
    const startDate = new Date(value.startDate);
    const expirationDate = new Date(value.expirationDate);

    if (startDate >= expirationDate) {
      return helpers.message("Start date must be before expiration date");
    }
  }

  // Validate product/category conflicts
  if (
    value.applicableProducts?.length > 0 &&
    value.applicableCategories?.length > 0
  ) {
    return helpers.message(
      "Cannot specify both applicable products and categories"
    );
  }

  return value;
});

// Function to validate individual form fields
export function validateProperty({ name, value }) {
  const obj = { [name]: value };
  const subSchema = Joi.object({ [name]: couponSchema.extract(name) });
  const { error } = subSchema.validate(obj);
  return error ? error.details[0].message : null;
}

// Function to validate the entire form
export function validateForm(formData) {
  // Prepare data for validation
  const dataToValidate = {
    code: formData.code,
    discountType: formData.discountType,
    expirationDate: formData.expirationDate,
    minimumOrderAmount: formData.minimumOrderAmount,
    isActive: formData.isActive,
    firstTimeUserOnly: formData.firstTimeUserOnly,
  };

  // Add optional fields only if they have values
  if (formData.startDate) {
    dataToValidate.startDate = formData.startDate;
  }

  if (formData.description) {
    dataToValidate.description = formData.description;
  }

  if (formData.usageLimit) {
    dataToValidate.usageLimit = Number(formData.usageLimit);
  }

  if (formData.usagePerUser) {
    dataToValidate.usagePerUser = Number(formData.usagePerUser);
  }

  // Add discount type specific fields
  if (formData.discountType === "percentage") {
    if (
      formData.discountPercentage !== "" &&
      formData.discountPercentage !== undefined
    ) {
      dataToValidate.discountPercentage = Number(formData.discountPercentage);
    }

    if (formData.maximumDiscountAmount) {
      dataToValidate.maximumDiscountAmount = Number(
        formData.maximumDiscountAmount
      );
    }
  } else if (formData.discountType === "fixed") {
    if (formData.discountValue !== "" && formData.discountValue !== undefined) {
      dataToValidate.discountValue = Number(formData.discountValue);
    }
  }

  const { error } = couponSchema.validate(dataToValidate, {
    abortEarly: false,
  });

  if (!error) return null;

  const validationErrors = {};
  error.details.forEach((err) => {
    validationErrors[err.path[0]] = err.message;
  });
  return validationErrors;
}
