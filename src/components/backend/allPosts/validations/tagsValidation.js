import Joi from "joi";

const tagSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  slug: Joi.string().allow("").optional(),
  description: Joi.string().min(3).max(255).allow("").optional(),
});

// Function to validate individual form fields
export function validateProperty({ name, value }) {
  const obj = { [name]: value };
  const subSchema = Joi.object({ [name]: tagSchema.extract(name) });
  const { error } = subSchema.validate(obj);
  return error ? error.details[0].message : null;
}

// Function to validate the entire form
export function validateForm(formData) {
  const { error } = tagSchema.validate(formData, { abortEarly: false });
  if (!error) return null;

  const validationErrors = {};
  error.details.forEach((err) => {
    validationErrors[err.path[0]] = err.message;
  });
  return validationErrors;
}
