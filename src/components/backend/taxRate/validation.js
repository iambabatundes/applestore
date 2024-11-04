import Joi from "joi";

// Define the schema outside the function so it can be reused
const taxRateSchema = Joi.object({
  country: Joi.string().min(3).max(255).required(),
  region: Joi.string().allow(null, ""),
  city: Joi.string().allow(null, ""),
  taxRate: Joi.number().min(0).max(100).required(),
  taxCode: Joi.string().min(3).max(50).required(),
  isGlobal: Joi.boolean(),
  isActive: Joi.boolean(),
  effectiveDate: Joi.date().required(),
  expirationDate: Joi.date(), // expiration after effective date
  tieredRates: Joi.array().items(
    Joi.object({
      minAmount: Joi.number().min(0).required(),
      maxAmount: Joi.number().greater(Joi.ref("minAmount")).required(),
      rate: Joi.number().min(0).max(100).required(),
    })
  ),
});

// Function to validate the entire form
export function validateTaxRate(taxRate) {
  return taxRateSchema.validate(taxRate, { abortEarly: false });
}

// Function to validate individual fields
export function validateProperty({ name, value }) {
  const obj = { [name]: value };
  const subSchema = Joi.object({ [name]: taxRateSchema.extract(name) });
  const { error } = subSchema.validate(obj);
  return error ? error.details[0].message : null;
}
