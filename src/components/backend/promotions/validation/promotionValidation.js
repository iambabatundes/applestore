import Joi from "joi";

const promotionSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(3).required(),
  promotionType: Joi.string()
    .valid("Discount", "FlashSale", "FreeShipping", "BundleDeal")
    .required(),

  discountPercentage: Joi.when("promotionType", {
    is: "Discount",
    then: Joi.number().min(1).max(100).required().label("Discount Percentage"),
  }),

  flashSalePrice: Joi.when("promotionType", {
    is: "FlashSale",
    then: Joi.number().required().label("Flash Sale"),
  }),

  shippingDiscount: Joi.when("promotionType", {
    is: "FreeShipping",
    then: Joi.number().min(1).max(100).required().label("Shipping Discount"),
  }),

  minimumQuantity: Joi.when("promotionType", {
    is: "BundleDeal",
    then: Joi.number().min(1).required().label("Minimum Quantity"),
  }),

  freeQuantity: Joi.when("promotionType", {
    is: "BundleDeal",
    then: Joi.number().min(1).required().label("Free Quantity"),
  }),

  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref("startDate")).required(),
  isActive: Joi.boolean(),
});

export function validateProperty({ name, value }) {
  const obj = { [name]: value };
  const subSchema = Joi.object({ [name]: promotionSchema.extract(name) });
  const { error } = subSchema.validate(obj);
  return error ? error.details[0].message : null;
}

export function validateForm(formData) {
  const { error } = promotionSchema.validate(formData, { abortEarly: false });
  if (!error) return null;

  const validationErrors = {};
  error.details.forEach((err) => {
    validationErrors[err.path[0]] = err.message;
  });
  return validationErrors;
}
