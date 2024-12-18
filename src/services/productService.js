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

// export function getProducts(page = 1, limit = 10) {
//   return http.get(`${config.apiUrl}/products?page=${page}&limit=${limit}`);
// }

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
      if (key === "_id") {
        continue; // Skip the _id field
      } else if (key === "featureImage") {
        if (product[key] && product[key].file) {
          formData.append("featureImage", product[key].file);
        }
      } else if (key === "media") {
        if (Array.isArray(product[key])) {
          product[key].forEach((file) => formData.append("media", file));
        }
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
