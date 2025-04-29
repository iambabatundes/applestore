import http from "../services/httpService";

const apiEndPoint = "http://localhost:4000/api/upload-logo";

export function getUploads() {
  return http.get(apiEndPoint);
}

export function saveUpload(upload, companyName) {
  const formData = new FormData();
  formData.append("logos", upload);
  formData.append("companyName", companyName);

  console.log("Saving upload:", upload, "CompanyName:", companyName);

  return http.post(apiEndPoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function deleteLogo(id) {
  return http.delete(`${apiEndPoint}/${id}`);
}
