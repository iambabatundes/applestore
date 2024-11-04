import Joi from "joi";

const couponSchema = Joi.object({
  code: Joi.string().required().label("Coupon Code"),
  discountType: Joi.string().valid("Percentage", "Fixed").required(),
  discountPercentage: Joi.alternatives().conditional("discountType", {
    is: "Percentage",
    then: Joi.number().min(1).max(100).required().label("Discount Percentage"),
    // otherwise: Joi.forbidden(), // Forbid when discountType is not "percentage"
  }),
  discountValue: Joi.alternatives().conditional("discountType", {
    is: "Fixed",
    then: Joi.number().min(1).required().label("Discount Value"),
    // otherwise: Joi.forbidden(), // Forbid when discountType is not "fixed"
  }),
  expirationDate: Joi.date().label("Expiration Date"),
  minimumOrderAmount: Joi.number().min(0).label("Minimum Order Amount"),
  usageLimit: Joi.number().min(1).label("Usage Limit"),
  isActive: Joi.boolean(),
});

// Function to validate individual form fields
export function validateProperty({ name, value }) {
  const obj = { [name]: value };
  const subSchema = Joi.object({ [name]: couponSchema.extract(name) });
  const { error } = subSchema.validate(obj);
  return error ? error.details[0].message : null;
}

// Function to validate the entire form
// export function validateForm(formData) {
//   const { error } = couponSchema.validate(formData, { abortEarly: false });
//   if (!error) return null;

//   const validationErrors = {};
//   error.details.forEach((err) => {
//     validationErrors[err.path[0]] = err.message;
//   });
//   return validationErrors;
// }

export function validateForm(formData) {
  const dataToValidate = {
    ...formData,
    discountPercentage:
      typeof formData.discountPercentage === "number"
        ? formData.discountPercentage
        : undefined,
    discountValue:
      typeof formData.discountValue === "number"
        ? formData.discountValue
        : undefined,
  };

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
