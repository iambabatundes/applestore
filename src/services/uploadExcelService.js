import { httpService, adminHttpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/upload-multiple`;

function createFormData(excelFile) {
  const formData = new FormData();
  if (excelFile) {
    formData.append("excelFile", excelFile);
  }

  // Log FormData for debugging
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value instanceof File ? value.name : value}`);
  }

  return formData;
}

export async function getExcelFile() {
  try {
    const { data } = await httpService.get(apiEndPoint);
    return data;
  } catch (err) {
    console.error("Failed to fetch excel files:", err);
    throw err;
  }
}

export async function saveExcelFile(excelFile) {
  try {
    const formData = createFormData(excelFile);
    const { data } = await adminHttpService.post(apiEndPoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    console.error("Failed to save excel file:", err);
    throw err;
  }
}
