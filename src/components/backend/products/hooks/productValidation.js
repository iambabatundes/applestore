import Joi from "joi";

export const schema = Joi.object({
  _id: Joi.string(),
  name: Joi.string().min(3).max(1024).trim().required().label("Product Name"),
  sku: Joi.string().min(3).max(255).required().label("SKU"),
  numberInStock: Joi.number()
    .min(0)
    .max(100000)
    .required()
    .label("Number In Stock"),
  price: Joi.number().min(0).max(900000000).required().label("Price"),
  salePrice: Joi.number().label("Sale Price").optional().allow(null, ""),
  saleStartDate: Joi.date().optional().allow(null).default(null),
  saleEndDate: Joi.date()
    .optional()
    .allow(null)
    .default(null)
    .custom((saleEndDate, helper) => {
      const saleStartDate = helper.state.ancestors[0].saleStartDate;
      if (
        saleStartDate &&
        saleEndDate &&
        new Date(saleEndDate) < new Date(saleStartDate)
      ) {
        return helper.message(
          "Sale End Date must not be earlier than Sale Start Date."
        );
      }
      return saleEndDate;
    }),
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
  description: Joi.string().min(5).required().label("Product Description"),
  featureImage: Joi.object().label("Feature Image").required(),
  media: Joi.array().min(2).max(8).label("Media File").optional().allow(null),
  tags: Joi.array().label("Tags").optional().allow(null),
  promotion: Joi.array().label("Promotions").optional().allow(null),
  category: Joi.array().required("Category is requied").label("Category"),
  weight: Joi.number().required().label("Weight").min(0).max(1024),
  brand: Joi.string().required().label("Brand").min(3).max(255),
  manufacturer: Joi.string().required().label("Manufacturer").min(3).max(255),
  attributes: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required().label("Attribute Key"),
        value: Joi.string().required().label("Attribute Value"),
      })
    )
    .label("Attributes")
    .optional(),
  colors: Joi.array()
    .items(
      Joi.object({
        colorName: Joi.string().required(),
        colorImages: Joi.object().required(),
        colorPrice: Joi.number().min(0).required(),
        stock: Joi.number().required(),
        colorSalePrice: Joi.number().optional().allow(null, ""),
        colorSaleStartDate: Joi.date().optional().allow(null, ""),
        colorSaleEndDate: Joi.date().optional().allow(null, ""),
        isDefault: Joi.boolean().optional(),
        isAvailable: Joi.boolean().optional(),
      }).custom((value, helper) => {
        if (
          value.colorSalePrice != null &&
          value.colorSalePrice > value.colorPrice
        ) {
          return helper.message({
            custom: `Color Sale Price (${value.colorSalePrice}) must not exceed Color Price (${value.colorPrice}).`,
          });
        }
        if (
          value.colorSalePrice != null &&
          (!value.colorSaleStartDate || !value.colorSaleEndDate)
        ) {
          return helper.message(
            "Color Sale Price requires both start and end dates."
          );
        }
        return value;
      })
    )
    .optional(),
}).custom((value, helper) => {
  if (value.salePrice != null && value.salePrice > value.price) {
    return helper.message(
      "Sale Price must not exceed Price. Please set a Sale Price that is lower than the regular Price."
    );
  }
  if (value.salePrice != null && (!value.saleStartDate || !value.saleEndDate)) {
    return helper.message("Sale Price requires both start and end dates.");
  }
  return value;
});

export function validate({ data }) {
  const { error } = schema.validate(data, { abortEarly: false });
  if (!error) return null;

  const validationErrors = {};
  for (let item of error.details) validationErrors[item.path[0]] = item.message;

  return validationErrors;
}

export function validateProperty({ name, value }) {
  if (name === "salePrice" && (value === null || value === "")) return null;

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
