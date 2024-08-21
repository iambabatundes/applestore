import Joi from "joi";
// import * as Yup from "yup";

export const schema = Joi.object({
  _id: Joi.string(),
  name: Joi.string().min(3).max(255).trim().required().label("Product Name"),
  sku: Joi.string().min(3).max(255).required().label("SKU"),
  numberInStock: Joi.number()
    .min(0)
    .max(100000)
    .required()
    .label("Number In Stock"),
  price: Joi.number().min(0).max(900000000).required().label("Price"),
  salePrice: Joi.number()
    .min(0)
    .max(100000)
    .label("Sale Price")
    .optional()
    .allow(null, ""),
  saleStartDate: Joi.date().optional().allow(null, ""),
  // .min("now")
  // .when("salePrice", {
  //   is: Joi.exist(),
  //   then: Joi.required().label("Sale Start Date"),
  //   otherwise: Joi.optional().label("Sale Start Date"),
  // }),

  saleEndDate: Joi.date().optional().allow(null, ""),
  // .greater(Joi.ref("saleStartDate"))
  // .when("salePrice", {
  //   is: Joi.exist(),
  //   then: Joi.required().label("Sale End Date"),
  //   otherwise: Joi.optional().label("Sale End Date"),
  // }),
  aboutProduct: Joi.string().min(20).required().label("About the Product"),
  productDetails: Joi.string()
    .min(20)
    .label("Product Details")
    .optional()
    .allow(""),
  productInformation: Joi.string()
    .min(20)
    .label("Product Information")
    .optional()
    .allow(""),
  description: Joi.string().min(20).required().label("Product Description"),
  featureImage: Joi.object().label("Feature Image").required(),
  //   featureImage: Joi.object({
  //     file: Joi.any().required().label("File"),
  //     preview: Joi.string().uri().required().label("Feauture Image"),
  //   })
  //     .label("Feature Image")
  //     .required(),
  media: Joi.array().min(2).max(8).label("Media File").optional().allow(null),
  tags: Joi.array().label("Tags").optional().allow(null),
  category: Joi.array().required().label("Category"),
  weight: Joi.number().required().label("Weight"),
  brand: Joi.string().required().label("Brand"),
  manufacturer: Joi.string().required().label("Manufacturer"),
});

export function validate({ data }) {
  const { error } = schema.validate(data, { abortEarly: false });
  if (!error) return null;

  const validationErrors = {};
  for (let item of error.details) validationErrors[item.path[0]] = item.message;

  return validationErrors;
}

export function validateProperty({ name, value }) {
  const obj = { [name]: value };
  const subSchema = schema.extract(name);
  const { error } = subSchema.validate(obj[name]);
  return error ? error.details[0].message : null;
}

// Validate the entire form
export function validateProductDetails(productDetails, editorContent) {
  const productDetailsValidation = schema.validate(productDetails, {
    abortEarly: false,
  });
  const editorContentValidation = schema.validate(editorContent, {
    abortEarly: false,
  });

  const validationErrors = {};

  if (productDetailsValidation.error) {
    for (let item of productDetailsValidation.error.details)
      validationErrors[item.path[0]] = item.message;
  }

  if (editorContentValidation.error) {
    for (let item of editorContentValidation.error.details)
      validationErrors[item.path[0]] = item.message;
  }

  return Object.keys(validationErrors).length === 0 ? null : validationErrors;
}

// Validate a single property
// export function validateProperty({ name, value }) {
//   const obj = { [name]: value };
//   const subSchema = schema.extract(name);
//   const { error } = subSchema.validate(obj[name]);
//   return error ? error.details[0].message : null;
// }
