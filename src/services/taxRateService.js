import { publicHttpService, adminHttpService } from "./http/index.js";

const TAX_RATES_ENDPOINT = "/api/tax-rates";

function taxRateUrl(id) {
  return `${TAX_RATES_ENDPOINT}/${id}`;
}

function clearTaxCache() {
  adminHttpService.clearCache();
  publicHttpService.clearCache();
}

export async function getTaxRates(params = {}) {
  try {
    const queryParams = new URLSearchParams();

    // Add all provided parameters to query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value);
      }
    });

    const url = queryParams.toString()
      ? `${TAX_RATES_ENDPOINT}?${queryParams.toString()}`
      : TAX_RATES_ENDPOINT;

    const response = await publicHttpService.get(url);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch tax rates:", err);
    throw err;
  }
}

export async function getActiveTaxRates(location) {
  try {
    const queryParams = new URLSearchParams();

    if (location.country) queryParams.append("country", location.country);
    if (location.region) queryParams.append("region", location.region);
    if (location.city) queryParams.append("city", location.city);
    if (location.productCategory)
      queryParams.append("productCategory", location.productCategory);

    const response = await publicHttpService.get(
      `${TAX_RATES_ENDPOINT}/active?${queryParams.toString()}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch active tax rates:", err);
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

export async function deactivateTaxRate(taxId, reason = "") {
  try {
    const response = await adminHttpService.patch(
      `${taxRateUrl(taxId)}/deactivate`,
      { reason }
    );
    clearTaxCache();
    return response.data;
  } catch (err) {
    console.error("Failed to deactivate tax rate:", err);
    throw err;
  }
}

export async function calculateTax(items, location, shippingFee = 0) {
  try {
    const response = await publicHttpService.post(
      `${TAX_RATES_ENDPOINT}/calculate`,
      { items, location, shippingFee }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to calculate tax:", err);
    throw err;
  }
}

export async function getTaxStatistics() {
  try {
    const response = await adminHttpService.get(
      `${TAX_RATES_ENDPOINT}/stats/summary`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch tax statistics:", err);
    throw err;
  }
}

export function exportTaxRates(taxRates, format = "csv") {
  try {
    if (format === "csv") {
      const headers = [
        "Tax Code",
        "Tax Name",
        "Tax Type",
        "Country",
        "Region",
        "City",
        "Tax Rate",
        "Active",
        "Global",
        "Effective Date",
        "Expiration Date",
        "Jurisdiction Level",
        "Description",
      ];

      const rows = taxRates.map((rate) => [
        rate.taxCode,
        rate.taxName,
        rate.taxType,
        rate.country,
        rate.region || "",
        rate.city || "",
        rate.taxRate,
        rate.isActive ? "Yes" : "No",
        rate.isGlobal ? "Yes" : "No",
        rate.effectiveDate
          ? new Date(rate.effectiveDate).toLocaleDateString()
          : "",
        rate.expirationDate
          ? new Date(rate.expirationDate).toLocaleDateString()
          : "",
        rate.jurisdictionLevel || "",
        rate.description || "",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row
            .map((cell) =>
              typeof cell === "string" && cell.includes(",")
                ? `"${cell}"`
                : cell
            )
            .join(",")
        ),
      ].join("\n");

      downloadFile(csvContent, `tax-rates-${Date.now()}.csv`, "text/csv");
    } else if (format === "json") {
      const jsonContent = JSON.stringify(taxRates, null, 2);
      downloadFile(
        jsonContent,
        `tax-rates-${Date.now()}.json`,
        "application/json"
      );
    }
  } catch (err) {
    console.error("Failed to export tax rates:", err);
    throw err;
  }
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
