import http from "../services/httpService";
import config from "../config.json";

const apiEndPoint = config.apiUrl + "/toggle-sales";

export function saveSalePrice(salePrice) {
  return http.post(apiEndPoint, salePrice);
}
