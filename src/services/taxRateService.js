import { publicHttpService, adminHttpService } from "./http/index.js";

// Use relative endpoints since base URLs are handled by the HTTP services
const TAX_RATES_ENDPOINT = "/tax-rates";

function taxRateUrl(id) {
  return `${TAX_RATES_ENDPOINT}/${id}`;
}

export async function getTaxRates() {
  try {
    // Use publicHttpService for read operations that don't require authentication
    const response = await publicHttpService.get(TAX_RATES_ENDPOINT);
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
    // Use adminHttpService for write operations that require admin privileges
    const response = await adminHttpService.post(TAX_RATES_ENDPOINT, tax);
    return response.data;
  } catch (err) {
    console.error("Failed to save tax rate:", err);
    throw err;
  }
}

export async function updateTaxRate(taxId, tax) {
  try {
    const response = await adminHttpService.put(taxRateUrl(taxId), tax);
    return response.data;
  } catch (err) {
    console.error("Failed to update tax rate:", err);
    throw err;
  }
}

export async function deleteTaxRate(taxId) {
  try {
    const response = await adminHttpService.delete(taxRateUrl(taxId));
    return response.data;
  } catch (err) {
    console.error("Failed to delete tax rate:", err);
    throw err;
  }
}

// Alternative: If you want to use userHttpService for authenticated reads
export async function getTaxRatesForUser() {
  try {
    // This would be for user-specific tax rates or authenticated access
    const response = await userHttpService.get(TAX_RATES_ENDPOINT);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch user tax rates:", err);
    throw err;
  }
}
