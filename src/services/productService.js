import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = `${config.apiUrl}/products`;

function productUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export function getProducts() {
  return http.get(apiEndPoint);
}

export function getProduct(productId) {
  return http.get(productUrl(productId));
}

function createFormData(product) {
  const formData = new FormData();

  for (const key in product) {
    if (key === "featureImage") {
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

  return formData;
}

export function saveProduct(product) {
  const formData = createFormData(product);

  if (product._id) {
    const body = { ...product };
    delete body._id;
    return http.put(productUrl(product._id), body, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  return http.post(apiEndPoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function updateProduct(productId, product) {
  const formData = createFormData(product);

  if (product._id) {
    const body = { ...product };
    delete body._id;
    return http.put(productUrl(product._id), body, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  // return http.put(productUrl(productId), body, formData, {
  //   headers: { "Content-Type": "multipart/form-data" },
  // });
}

export function deleteProduct(productId) {
  return http.delete(productUrl(productId));
}

export function getProductsByTag(tagId) {
  return http.get(`${apiEndPoint}/tag/${tagId}`);
}
