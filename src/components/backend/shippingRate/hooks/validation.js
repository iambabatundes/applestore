import Joi from "joi";

export const shippingRateSchema = Joi.object({
  ratePerMile: Joi.number().min(1).required().label("Rate Per Mile"),
  baseRate: Joi.number().min(0).required().label("Base Rate"),
  storeName: Joi.string().required().label("Store Location"),
  isGlobal: Joi.boolean(),
});

export const validateForm = (schema, data) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (!error) return null;

  const errors = {};
  error.details.forEach((detail) => {
    errors[detail.path[0]] = detail.message;
  });
  return errors;
};
