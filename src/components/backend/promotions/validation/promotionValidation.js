import Joi from "joi";

export const promotionSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().min(3).required(),
  promotionType: Joi.string()
    .valid("Discount", "FlashSale", "FreeShipping", "BundleDeal")
    .required(),
  discountPercentage: Joi.number().min(1).max(100).when("promotionType", {
    is: "Discount",
    then: Joi.required(),
  }),
  flashSalePrice: Joi.number().when("promotionType", {
    is: "FlashSale",
    then: Joi.required(),
  }),
  shippingDiscount: Joi.number().min(0).max(100).when("promotionType", {
    is: "FreeShipping",
    then: Joi.required(),
  }),
  minimumQuantity: Joi.number().min(1).when("promotionType", {
    is: "BundleDeal",
    then: Joi.required(),
  }),
  freeQuantity: Joi.number().min(1).when("promotionType", {
    is: "BundleDeal",
    then: Joi.required(),
  }),
  startDate: Joi.date(),
  endDate: Joi.date().min(Joi.ref("startDate")),
  isActive: Joi.boolean(),
});
