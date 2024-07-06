import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = `${config.apiUrl}/top-products`;

export function getTopProducts() {
  return http.get(`${apiEndPoint}`);
}
