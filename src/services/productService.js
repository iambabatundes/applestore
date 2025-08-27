import {
  httpService,
  publicHttpService,
  userHttpService,
  adminHttpService,
} from "../services/httpService";
import config from "../config.json";

const apiEndPoint = `${config.apiUrl}/products`;

function productUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getProductsByCategorys(categoryName) {
  return publicHttpService.get(`${apiEndPoint}/categories/${categoryName}`);
}

export function getProductsByPromotion(promotionName) {
  return publicHttpService.get(`${apiEndPoint}/promotions/${promotionName}`);
}

export async function getUserProducts() {
  try {
    const { data } = await userHttpService.get(`${apiEndPoint}/me`);
    return data;
  } catch (err) {
    console.error("Failed to fetch user products:", err);
    throw err;
  }
}

export function getProducts() {
  return publicHttpService.get(apiEndPoint);
}

export function getProduct(productId) {
  return publicHttpService.get(productUrl(productId));
}

function createFormData(product, userId) {
  const formData = new FormData();

  if (userId) {
    for (const key in userId) {
      if (userId.hasOwnProperty(key)) {
        formData.append(`userId[${key}]`, userId[key]);
      }
    }
  }

  for (const key in product) {
    if (product.hasOwnProperty(key)) {
      if (key === "salePrice" && !product[key]) {
        continue;
      } else if (key === "saleStartDate" && !product[key]) {
        continue;
      } else if (key === "saleEndDate" && !product[key]) {
        continue;
      } else if (key === "discountPercentage" && !product[key]) {
        continue;
      } else if (key === "colorSalePrice" && !product[key]) {
        continue;
      } else if (key === "colorSaleStartDate" && !product[key]) {
        continue;
      } else if (key === "colorSaleEndDate" && !product[key]) {
        continue;
      } else if (key === "_id") {
        continue;
      } else if (key === "ratings") {
        continue;
      } else if (key === "featureImage") {
        if (product[key] && product[key].file) {
          formData.append("featureImage", product[key].file);
        }
      } else if (key === "media") {
        if (Array.isArray(product[key])) {
          product[key].forEach((file) => formData.append("media", file));
        }
      } else if (key === "attributes") {
        if (Array.isArray(product[key])) {
          product[key].forEach((attr, index) => {
            formData.append(`attributes[${index}][key]`, attr.key);
            formData.append(`attributes[${index}][value]`, attr.value);
          });
        }
      } else if (key === "colors" && Array.isArray(product[key])) {
        product[key].forEach((color, index) => {
          Object.entries(color).forEach(([colorKey, colorValue]) => {
            if (colorKey === "_id") {
              return;
            }
            if (colorKey === "colorImages") {
              if (colorValue instanceof File) {
                formData.append(`colorImages`, colorValue);
              } else if (
                typeof colorValue === "string" &&
                colorValue.startsWith("http")
              ) {
                formData.append(`colorImages`, colorValue);
              } else if (colorValue && colorValue.filename) {
                formData.append(
                  `colors[${index}][colorImages]`,
                  colorValue.filename
                );
              } else {
                formData.append(`colors[${index}][colorImages]`, "");
              }
            } else {
              formData.append(`colors[${index}][${colorKey}]`, colorValue);
            }
          });
        });
      } else if (key === "sizes" && Array.isArray(product[key])) {
        product[key].forEach((size, index) => {
          if (typeof size === "object" && size !== null) {
            Object.entries(size).forEach(([sizeKey, sizeValue]) => {
              if (
                sizeKey === "sizeSalePrice" &&
                (sizeValue === null ||
                  sizeValue === undefined ||
                  isNaN(sizeValue))
              ) {
                return;
              }
              if (
                sizeKey === "sizeSaleStartDate" &&
                (sizeValue === null ||
                  sizeValue === undefined ||
                  isNaN(Date.parse(sizeValue)))
              ) {
                return;
              }
              if (
                sizeKey === "sizeSaleEndDate" &&
                (sizeValue === null ||
                  sizeValue === undefined ||
                  isNaN(Date.parse(sizeValue)))
              ) {
                return;
              }
              formData.append(`sizes[${index}][${sizeKey}]`, sizeValue);
            });
          } else {
            console.error(`Size at index ${index} is not an object:`, size);
          }
        });
      } else if (key === "capacity" && Array.isArray(product[key])) {
        product[key].forEach((cap, index) => {
          if (typeof cap === "object" && cap !== null) {
            Object.entries(cap).forEach(([capKey, capValue]) => {
              if (
                capKey === "capSalePrice" &&
                (capValue === null || capValue === undefined || isNaN(capValue))
              ) {
                return;
              }
              if (
                capKey === "sizeSaleStartDate" &&
                (capValue === null ||
                  capValue === undefined ||
                  isNaN(Date.parse(capValue)))
              ) {
                return;
              }
              if (
                capKey === "sizeSaleEndDate" &&
                (capValue === null ||
                  capValue === undefined ||
                  isNaN(Date.parse(capValue)))
              ) {
                return;
              }
              formData.append(`capacity[${index}][${capKey}]`, capValue);
            });
          } else {
            console.error(`Capacity at index ${index} is not an object:`, cap);
          }
        });
      } else if (key === "materials" && Array.isArray(product[key])) {
        product[key].forEach((mat, index) => {
          if (typeof mat === "object" && mat !== null) {
            Object.entries(mat).forEach(([matKey, matValue]) => {
              if (
                matKey === "matSalePrice" &&
                (matValue === null || matValue === undefined || isNaN(matValue))
              ) {
                return;
              }
              if (
                matKey === "matSaleStartDate" &&
                (matValue === null ||
                  matValue === undefined ||
                  isNaN(Date.parse(matValue)))
              ) {
                return;
              }
              if (
                matKey === "matSaleEndDate" &&
                (matValue === null ||
                  matValue === undefined ||
                  isNaN(Date.parse(matValue)))
              ) {
                return;
              }
              formData.append(`materials[${index}][${matKey}]`, matValue);
            });
          } else {
            console.error(`Materials at index ${index} is not an object:`, mat);
          }
        });
      } else if (Array.isArray(product[key])) {
        product[key].forEach((item) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, product[key]);
      }
    }
  }

  return formData;
}

export function saveProduct(product, userId) {
  const formData = createFormData(product, userId);
  const endpoint = product._id
    ? productUrl(product._id)
    : "/api/admin/products";

  return adminHttpService[product._id ? "put" : "post"](endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function updateProduct(productId, product, userId) {
  const formData = createFormData(product, userId);
  return adminHttpService.put(productUrl(productId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteProduct(productId) {
  return adminHttpService.delete(productUrl(productId));
}

export function getProductsByTag(tagId) {
  return publicHttpService.get(`${apiEndPoint}/tag/${tagId}`);
}

export function getProductsByCategory(categoryId) {
  return publicHttpService.get(`${apiEndPoint}/category/${categoryId}`);
}
