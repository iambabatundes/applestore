import http from "../services/httpService";
// import config from "../config.json";

const apiEndPoint = "http://localhost:4000/api/tax-rates";

export function getTaxRates() {
  return http.get(apiEndPoint);
}

export function getTaxRate(taxId) {
  return http.get(`${apiEndPoint}/${taxId}`);
}

export function saveTaxRate(tax) {
  return http.post(apiEndPoint, tax);
}

export function updateTaxRate(taxId, tax) {
  return http.put(`${apiEndPoint}/${taxId}`, tax);
}

export function deleteTaxRate(taxId) {
  return http.delete(`${apiEndPoint}/${taxId}`);
}
