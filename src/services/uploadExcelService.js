import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/upload-multiple";

export function getExcelFile() {
  return http.get(apiEndPoint);
}

export function saveExcelFile(excelFile) {
  return http.post(apiEndPoint, excelFile);
}

export function deleteTag(tagId) {
  return http.delete(apiEndPoint + "/" + tagId);
}
