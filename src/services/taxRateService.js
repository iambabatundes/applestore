import { httpService, adminHttpService } from "../services/httpService";
const apiEndPoint = `${import.meta.env.VITE_API_URL}/tax-rates`;

function taxRateUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getTaxRates() {
  try {
    const { data } = await httpService.get(apiEndPoint);
    return data;
  } catch (err) {
    console.error("Failed to fetch tax rates:", err);
    throw err;
  }
}

export async function getTaxRate(taxId) {
  try {
    const { data } = await httpService.get(taxRateUrl(taxId));
    return data;
  } catch (err) {
    console.error("Failed to fetch tax rate:", err);
    throw err;
  }
}

export async function saveTaxRate(tax) {
  try {
    const { data } = await adminHttpService.post(apiEndPoint, tax);
    return data;
  } catch (err) {
    console.error("Failed to save tax rate:", err);
    throw err;
  }
}

export async function updateTaxRate(taxId, tax) {
  try {
    const { data } = await adminHttpService.put(taxRateUrl(taxId), tax);
    return data;
  } catch (err) {
    console.error("Failed to update tax rate:", err);
    throw err;
  }
}

export async function deleteTaxRate(taxId) {
  try {
    const { data } = await adminHttpService.delete(taxRateUrl(taxId));
    return data;
  } catch (err) {
    console.error("Failed to delete tax rate:", err);
    throw err;
  }
}
