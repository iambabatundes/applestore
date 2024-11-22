import Joi from "joi";

const categorySchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  slug: Joi.string().allow("").optional(),
  description: Joi.string().min(3).max(255).allow("").optional(),
  parent: Joi.string().optional().allow(null, ""),
});

export function validateProperty({ name, value }) {
  const obj = { [name]: value };
  const subSchema = Joi.object({ [name]: categorySchema.extract(name) });
  const { error } = subSchema.validate(obj);
  return error ? error.details[0].message : null;
}

export function validateForm(formData) {
  const { error } = categorySchema.validate(formData, { abortEarly: false });
  if (!error) return null;

  const validationErrors = {};
  error.details.forEach((err) => {
    validationErrors[err.path[0]] = err.message;
  });
  return validationErrors;
}
