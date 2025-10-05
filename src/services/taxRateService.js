import { publicHttpService, adminHttpService } from "./http/index.js";

const TAX_RATES_ENDPOINT = "/api/tax-rates";

function taxRateUrl(id) {
  return `${TAX_RATES_ENDPOINT}/${id}`;
}

function clearTaxCache() {
  adminHttpService.clearCache();
  publicHttpService.clearCache();
}

export async function getTaxRates() {
  try {
    const response = await publicHttpService.get(TAX_RATES_ENDPOINT);
    clearTaxCache();
    return response.data;
  } catch (err) {
    console.error("Failed to fetch tax rates:", err);
    throw err;
  }
}

export async function getTaxRate(taxId) {
  try {
    const response = await publicHttpService.get(taxRateUrl(taxId));
    return response.data;
  } catch (err) {
    console.error("Failed to fetch tax rate:", err);
    throw err;
  }
}

export async function saveTaxRate(tax) {
  try {
    const response = await adminHttpService.post(TAX_RATES_ENDPOINT, tax);
    clearTaxCache();
    return response.data;
  } catch (err) {
    console.error("Failed to save tax rate:", err);
    throw err;
  }
}

export async function updateTaxRate(taxId, tax) {
  try {
    const response = await adminHttpService.put(taxRateUrl(taxId), tax);
    clearTaxCache();
    return response.data;
  } catch (err) {
    console.error("Failed to update tax rate:", err);
    throw err;
  }
}

export async function deleteTaxRate(taxId) {
  try {
    const response = await adminHttpService.delete(taxRateUrl(taxId));
    clearTaxCache();
    return response.data;
  } catch (err) {
    console.error("Failed to delete tax rate:", err);
    throw err;
  }
}

export async function getTaxRatesForUser() {
  try {
    const response = await userHttpService.get(TAX_RATES_ENDPOINT);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch user tax rates:", err);
    throw err;
  }
}
