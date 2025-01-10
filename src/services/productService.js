import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = `${config.apiUrl}/products`;
const tokenKey = "token";

function productUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getUserProducts() {
  const token = localStorage.getItem(tokenKey);
  if (token) {
    http.setJwt(token);
  }

  const { data } = await http.get(`${apiEndPoint}/me`);
  return data;
}

export function getProducts() {
  return http.get(apiEndPoint);
}

export function getProduct(productId) {
  return http.get(productUrl(productId));
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
      } else if (key === "_id") {
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
            if (colorKey === "colorImages" && colorValue instanceof File) {
              // Use a flat field name, e.g., colorImages
              formData.append(`colorImages`, colorValue);
            } else if (colorKey === "colorSalePrice") {
              // Ensure it's only appended if it exists and is valid
              if (
                colorValue !== undefined &&
                colorValue !== null &&
                colorValue !== ""
              ) {
                formData.append(`colors[${index}][${colorKey}]`, colorValue);
              }
            } else if (colorKey === "colorSaleEndDate") {
              // Append only if colorSaleEndDate is a valid date or provided
              if (colorValue) {
                formData.append(`colors[${index}][${colorKey}]`, colorValue);
              }
            } else if (colorKey === "colorSaleStartDate") {
              // Append only if colorSaleEndDate is a valid date or provided
              if (colorValue) {
                formData.append(`colors[${index}][${colorKey}]`, colorValue);
              }
            } else {
              formData.append(`colors[${index}][${colorKey}]`, colorValue);
            }
          });
        });
      } else if (key === "sizes" && Array.isArray(product[key])) {
        product[key].forEach((size) => formData.append("sizes[]", size));
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

  if (product._id) {
    return http.put(productUrl(product._id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  return http.post(apiEndPoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function updateProduct(productId, product, userId) {
  const formData = createFormData(product, userId);

  return http.put(productUrl(productId), formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteProduct(productId) {
  return http.delete(productUrl(productId));
}

export function getProductsByTag(tagId) {
  return http.get(`${apiEndPoint}/tag/${tagId}`);
}

export function getProductsByCategory(categoryId) {
  return http.get(`${apiEndPoint}/category/${categoryId}`);
}
