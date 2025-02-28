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
  saleStartDate: Joi.date().optional().allow(null, "").default(null),
  saleEndDate: Joi.date().optional().allow(null, "").default(null),
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
  viewCount: Joi.any(),
  purchaseCount: Joi.any(),
  featureImage: Joi.object().label("Feature Image").required(),
  media: Joi.array().min(2).label("Media File").optional().allow(null),
  tags: Joi.array().label("Tags").optional().allow(null),
  promotion: Joi.array().label("Promotions").optional().allow(null),
  category: Joi.array().required("Category is requied").label("Category"),
  weight: Joi.number().required().label("Weight").min(0).max(1024),
  brand: Joi.string().required().label("Brand").min(3).max(255),
  manufacturer: Joi.string().required().label("Manufacturer").min(3).max(255),
  attributes: Joi.array()
    .items(
      Joi.object({
        key: Joi.string().required().label("Attribute Key").min(3).max(255),
        value: Joi.string().required().label("Attribute Value").min(3).max(255),
      })
    )
    .label("Attributes")
    .optional(),
  colors: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string(),
        colorName: Joi.string().required().label("Color Name").min(3).max(255),
        colorImages: Joi.object().label("Color Image"),
        colorPrice: Joi.number()
          .min(0)
          .required()
          .label("Color Price")
          .min(0)
          .max(900000),
        stock: Joi.number().required().label("Color Quantity").min(0).max(2090),
        colorSalePrice: Joi.number().optional().allow(null, ""),
        colorSaleStartDate: Joi.date().optional().allow(null, ""),
        colorSaleEndDate: Joi.date().optional().allow(null, ""),
        isDefault: Joi.boolean().optional(),
        isAvailable: Joi.boolean().optional(),
      })
    )
    .optional(),

  sizes: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string(),
        sizeName: Joi.string().required().label("Sizes Label").min(3).max(255),
        sizePrice: Joi.number()
          .min(0)
          .required()
          .label("Size Price")
          .min(0)
          .max(900000),
        sizeStock: Joi.number()
          .required()
          .label("Size Quantity")
          .min(0)
          .max(2090),
        sizeSalePrice: Joi.number().optional().allow(null, ""),
        sizeSaleStartDate: Joi.date().optional().allow(null, ""),
        sizeSaleEndDate: Joi.date().optional().allow(null, ""),
        isDefault: Joi.boolean().optional(),
        isAvailable: Joi.boolean().optional(),
      })
    )
    .optional(),

  capacity: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string(),
        capName: Joi.string()
          .required()
          .label("Capacity Label")
          .min(3)
          .max(255),
        capPrice: Joi.number()
          .min(0)
          .required()
          .label("Capacity Price")
          .min(0)
          .max(900000),
        capStock: Joi.number()
          .required()
          .label("Capacity Quantity")
          .min(0)
          .max(2090),
        capSalePrice: Joi.number().optional().allow(null, ""),
        capSaleStartDate: Joi.date().optional().allow(null, ""),
        capSaleEndDate: Joi.date().optional().allow(null, ""),
        isDefault: Joi.boolean().optional(),
        isAvailable: Joi.boolean().optional(),
      })
    )
    .optional(),
  materials: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string(),
        matName: Joi.string()
          .required()
          .label("Material Label")
          .min(3)
          .max(255),
        matPrice: Joi.number()
          .min(0)
          .required()
          .label("Material Price")
          .min(0)
          .max(900000),
        matStock: Joi.number()
          .required()
          .label("Material Quantity")
          .min(0)
          .max(2090),
        matSalePrice: Joi.number().optional().allow(null, ""),
        matSaleStartDate: Joi.date().optional().allow(null, ""),
        matSaleEndDate: Joi.date().optional().allow(null, ""),
        isDefault: Joi.boolean().optional(),
        isAvailable: Joi.boolean().optional(),
      })
    )
    .optional(),
}).unknown(true);

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
