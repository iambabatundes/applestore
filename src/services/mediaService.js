import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = "http://localhost:4000/api/uploads";

export function getUploads() {
  //   return http.get(apiEndPoint);
  return http.get(apiEndPoint);
}

export function getUpload(uploadId) {
  return http.get(apiEndPoint + "/" + uploadId);
}

export function saveUpload(upload) {
  console.log("Saving upload:", upload); //
  return http.post(apiEndPoint, upload);
}

export function updateUpload(uploadId, upload) {
  return http.put(apiEndPoint + "/" + uploadId, upload);
}

export function deleteUpload(uploadId) {
  return http.delete(apiEndPoint + "/" + uploadId);
}
