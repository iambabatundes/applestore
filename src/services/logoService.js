import { publicHttpService, adminHttpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/upload-logo`;

function logoUrl(id) {
  return `${apiEndPoint}/${id}`;
}

function createFormData(upload, companyName) {
  const formData = new FormData();
  if (upload) {
    formData.append("logos", upload);
  }
  if (companyName) {
    formData.append("companyName", companyName);
  }

  // Log FormData for debugging
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value instanceof File ? value.name : value}`);
  }

  return formData;
}

export function getUploads() {
  try {
    return publicHttpService.get(apiEndPoint);
  } catch (err) {
    console.error("Failed to fetch logos:", err);
    throw err;
  }
}

export async function saveUpload(upload, companyName) {
  try {
    console.log("Saving logo:", upload, "CompanyName:", companyName);
    const formData = createFormData(upload, companyName);
    const { data } = await adminHttpService.post(apiEndPoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    console.error("Failed to save logo:", err);
    throw err;
  }
}

export async function deleteLogo(id) {
  try {
    const { data } = await adminHttpService.delete(logoUrl(id));
    return data;
  } catch (err) {
    console.error("Failed to delete logo:", err);
    throw err;
  }
}
