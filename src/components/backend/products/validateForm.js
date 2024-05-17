import * as Yup from "yup";

export let validationSchema = Yup.object().shape({
  name: Yup.string().min(3).max(255).required("Name is required"),
  sku: Yup.string().min(3).max(255).required("SKU is required"),
  description: Yup.string()
    .min(5)
    .max(1024)
    .required("Description is required"),
  numberInStock: Yup.number()
    .min(0)
    .max(1024)
    .required("Number in stock is required"),
  price: Yup.number().min(1).required("Price is required"),
  salePrice: Yup.number(),
  saleStartDate: Yup.date().nullable(),
  saleEndDate: Yup.date().nullable(),
  weight: Yup.number(),
  discountPercentage: Yup.number().min(0).max(100),
  featureImage: Yup.string().required("Feature image is required"),
  media: Yup.array(),
  category: Yup.string().required("Category is required"),
  tags: Yup.array().min(1, "At least one tag is required"),
  subcategory: Yup.array(),
});
