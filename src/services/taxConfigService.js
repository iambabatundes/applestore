// services/taxConfigService.js
import { adminHttpService } from "./http/index.js";

const TAX_CONFIG_ENDPOINT = "/api/tax-config";

export async function getTaxConfiguration() {
  try {
    const response = await adminHttpService.get(TAX_CONFIG_ENDPOINT);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch tax configuration:", err);
    throw err;
  }
}

export async function updateTaxConfiguration(config) {
  try {
    const response = await adminHttpService.put(TAX_CONFIG_ENDPOINT, {
      ...config,
      version: config.version || "1.0.0",
      lastUpdated: new Date().toISOString(),
      updatedBy: "admin", // In real app, get from auth context
    });
    return response.data;
  } catch (err) {
    console.error("Failed to update tax configuration:", err);
    throw err;
  }
}

export async function validateTaxConfiguration(config) {
  try {
    const response = await adminHttpService.post(
      `${TAX_CONFIG_ENDPOINT}/validate`,
      config
    );
    return response.data;
  } catch (err) {
    console.error("Failed to validate tax configuration:", err);
    throw err;
  }
}

export async function exportTaxConfig(config) {
  try {
    const configStr = JSON.stringify(config, null, 2);
    const blob = new Blob([configStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tax-config-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to export tax configuration:", err);
    throw err;
  }
}

export async function importTaxConfig(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result);

        // Validate basic structure
        if (!config.system || !config.calculation) {
          throw new Error("Invalid configuration file structure");
        }

        resolve(config);
      } catch (error) {
        reject(new Error("Failed to parse configuration file"));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export async function getConfigHistory() {
  try {
    const response = await adminHttpService.get(
      `${TAX_CONFIG_ENDPOINT}/history`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch config history:", err);
    throw err;
  }
}

export async function restoreConfigVersion(versionId) {
  try {
    const response = await adminHttpService.post(
      `${TAX_CONFIG_ENDPOINT}/history/${versionId}/restore`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to restore configuration version:", err);
    throw err;
  }
}
