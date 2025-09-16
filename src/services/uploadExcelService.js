// ExcelFileService.js - Aligned with HTTP Services Architecture
import { publicHttpService, adminHttpService } from "./http/index.js";

// Use relative endpoint since base URLs are handled by HTTP services
const UPLOAD_MULTIPLE_ENDPOINT = "/upload-multiple";

function createFormData(excelFile) {
  const formData = new FormData();
  if (excelFile) {
    formData.append("excelFile", excelFile);
  }

  // Log FormData for debugging (only in development)
  if (import.meta.env.DEV) {
    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(
        `${key}: ${
          value instanceof File
            ? `File: ${value.name} (${value.size} bytes)`
            : value
        }`
      );
    }
  }

  return formData;
}

export async function getExcelFiles() {
  try {
    // Use publicHttpService for read operations if they don't require authentication
    // Or use adminHttpService if admin privileges are required
    const response = await adminHttpService.get(UPLOAD_MULTIPLE_ENDPOINT);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch excel files:", err);
    throw err;
  }
}

export async function uploadExcelFile(excelFile, options = {}) {
  try {
    const formData = createFormData(excelFile);

    const response = await adminHttpService.post(
      UPLOAD_MULTIPLE_ENDPOINT,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // Add progress tracking if needed
        onUploadProgress: (progressEvent) => {
          if (options.onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            options.onProgress(percentCompleted);
          }
        },
        // Add timeout for large files
        timeout: options.timeout || 120000, // 2 minutes default
        ...options.requestConfig,
      }
    );

    return response.data;
  } catch (err) {
    console.error("Failed to upload excel file:", err);
    throw err;
  }
}

// Additional helper functions for better file handling
export async function uploadMultipleExcelFiles(files, options = {}) {
  try {
    const formData = new FormData();

    // Handle multiple files
    files.forEach((file, index) => {
      formData.append(`excelFiles[${index}]`, file);
    });

    if (import.meta.env.DEV) {
      console.log("Multiple files FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(
          `${key}: ${
            value instanceof File
              ? `File: ${value.name} (${value.size} bytes)`
              : value
          }`
        );
      }
    }

    const response = await adminHttpService.post(
      UPLOAD_MULTIPLE_ENDPOINT,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (options.onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            options.onProgress(percentCompleted);
          }
        },
        timeout: options.timeout || 180000, // 3 minutes for multiple files
        ...options.requestConfig,
      }
    );

    return response.data;
  } catch (err) {
    console.error("Failed to upload multiple excel files:", err);
    throw err;
  }
}

export async function validateExcelFile(excelFile) {
  try {
    const formData = createFormData(excelFile);

    const response = await adminHttpService.post(
      `${UPLOAD_MULTIPLE_ENDPOINT}/validate`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Failed to validate excel file:", err);
    throw err;
  }
}

export async function getUploadHistory(params = {}) {
  try {
    const response = await adminHttpService.get(
      `${UPLOAD_MULTIPLE_ENDPOINT}/history`,
      {
        params,
      }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch upload history:", err);
    throw err;
  }
}

export async function deleteUploadedFile(fileId) {
  try {
    const response = await adminHttpService.delete(
      `${UPLOAD_MULTIPLE_ENDPOINT}/${fileId}`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to delete uploaded file:", err);
    throw err;
  }
}

export async function downloadProcessedFile(fileId, format = "excel") {
  try {
    const response = await adminHttpService.get(
      `${UPLOAD_MULTIPLE_ENDPOINT}/${fileId}/download`,
      {
        params: { format },
        responseType: "blob",
      }
    );

    // Create download link
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `processed-file-${fileId}.${
      format === "csv" ? "csv" : "xlsx"
    }`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return response.data;
  } catch (err) {
    console.error("Failed to download processed file:", err);
    throw err;
  }
}

// File validation helpers
export function validateFileType(file) {
  const allowedTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  return allowedTypes.includes(file.type);
}

export function validateFileSize(file, maxSizeMB = 10) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

export function validateExcelFileComplete(file, maxSizeMB = 10) {
  const errors = [];

  if (!file) {
    errors.push("No file selected");
    return { valid: false, errors };
  }

  if (!validateFileType(file)) {
    errors.push(
      "Invalid file type. Please select an Excel file (.xls or .xlsx)"
    );
  }

  if (!validateFileSize(file, maxSizeMB)) {
    errors.push(`File size exceeds ${maxSizeMB}MB limit`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
