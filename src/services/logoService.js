import { publicHttpService, adminHttpService } from "./http/index.js";

const UPLOAD_LOGO_ENDPOINT = "/api/upload-logo";

function logoUrl(id) {
  return `${UPLOAD_LOGO_ENDPOINT}/${id}`;
}

function clearLogoCache() {
  adminHttpService.clearCache();
  publicHttpService.clearCache();
}

function createFormData(upload, companyName, storageType, metadata = {}) {
  const formData = new FormData();

  if (upload) {
    formData.append("logos", upload);
  }

  if (companyName) {
    formData.append("companyName", companyName);
  }

  Object.keys(metadata).forEach((key) => {
    if (metadata[key] !== null && metadata[key] !== undefined) {
      formData.append(
        key,
        typeof metadata[key] === "object"
          ? JSON.stringify(metadata[key])
          : metadata[key]
      );
    }
  });

  if (import.meta.env.DEV) {
    console.log("Logo upload FormData contents:");
    for (let [key, value] of formData.entries()) {
      console.log(
        `${key}: ${
          value instanceof File
            ? `File: ${value.name} (${value.size} bytes, ${value.type})`
            : value
        }`
      );
    }
  }

  return formData;
}

export async function getUploads(params = {}) {
  try {
    const response = await publicHttpService.get(UPLOAD_LOGO_ENDPOINT, {
      params,
    });
    clearLogoCache();
    return response.data;
  } catch (err) {
    console.error("Failed to fetch logos:", err);
    throw err;
  }
}

export async function getLogo(logoId) {
  try {
    const response = await publicHttpService.get(logoUrl(logoId));
    return response.data;
  } catch (err) {
    console.error("Failed to fetch logo:", err);
    throw err;
  }
}

export async function saveUpload(
  upload,
  companyName,
  storageType = "local",
  options = {}
) {
  try {
    if (import.meta.env.DEV) {
      console.log(
        "Saving logo:",
        upload?.name || upload,
        "CompanyName:",
        companyName,
        "Storage:",
        storageType
      );
    }

    const { metadata = {}, onProgress } = options;
    const formData = createFormData(upload, companyName, storageType, metadata);

    // Add storage type as query parameter
    const url = `${UPLOAD_LOGO_ENDPOINT}?storage=${storageType}`;

    const response = await adminHttpService.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted, progressEvent);
        }
      },
      timeout: options.timeout || 60000,
      ...options.requestConfig,
    });
    clearLogoCache();
    return response.data;
  } catch (err) {
    console.error("Failed to save logo:", err);
    throw err;
  }
}

export async function updateLogo(
  logoId,
  upload,
  companyName,
  storageType = "local",
  options = {}
) {
  try {
    if (import.meta.env.DEV) {
      console.log(
        "Updating logo:",
        logoId,
        upload?.name || upload,
        "CompanyName:",
        companyName,
        "Storage:",
        storageType
      );
    }

    const { metadata = {}, onProgress } = options;
    const formData = createFormData(upload, companyName, storageType, metadata);

    // Add storage type as query parameter
    const url = `${logoUrl(logoId)}?storage=${storageType}`;

    const response = await adminHttpService.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted, progressEvent);
        }
      },
      timeout: options.timeout || 60000,
      ...options.requestConfig,
    });
    clearLogoCache();
    return response.data;
  } catch (err) {
    console.error("Failed to update logo:", err);
    throw err;
  }
}

export async function deleteLogo(id) {
  try {
    if (import.meta.env.DEV) {
      console.log("Deleting logo:", id);
    }

    const response = await adminHttpService.delete(logoUrl(id));
    clearLogoCache();
    return response.data;
  } catch (err) {
    console.error("Failed to delete logo:", err);
    throw err;
  }
}

export async function uploadCompanyLogo(companyId, logoFile, options = {}) {
  try {
    const { onProgress, validateLogo = true } = options;

    // Validate logo file if requested
    if (validateLogo) {
      const validation = validateLogoFile(logoFile, options.validation);
      if (!validation.valid) {
        throw new Error(
          `Logo validation failed: ${validation.errors.join(", ")}`
        );
      }
    }

    const formData = new FormData();
    formData.append("logos", logoFile);
    formData.append("companyId", companyId);

    if (options.metadata) {
      Object.keys(options.metadata).forEach((key) => {
        formData.append(key, options.metadata[key]);
      });
    }

    const response = await adminHttpService.post(
      UPLOAD_LOGO_ENDPOINT,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted, progressEvent);
          }
        },
        timeout: options.timeout || 60000,
      }
    );

    return response.data;
  } catch (err) {
    console.error("Failed to upload company logo:", err);
    throw err;
  }
}

export async function getCompanyLogos(companyId) {
  try {
    const response = await publicHttpService.get(UPLOAD_LOGO_ENDPOINT, {
      params: { companyId },
    });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch company logos:", err);
    throw err;
  }
}

export async function setDefaultLogo(logoId, companyName) {
  try {
    if (import.meta.env.DEV) {
      console.log("Setting default logo:", logoId, "for company:", companyName);
    }

    const response = await adminHttpService.post(
      `${logoUrl(logoId)}/set-default`,
      {
        companyName,
      }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to set default logo:", err);
    throw err;
  }
}

export async function getDefaultLogo(companyName) {
  try {
    const response = await publicHttpService.get(
      `${UPLOAD_LOGO_ENDPOINT}/default`,
      {
        params: { companyName },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to fetch default logo:", err);
    throw err;
  }
}

export async function generateLogoVariants(
  logoId,
  variants = ["small", "medium", "large"]
) {
  try {
    if (import.meta.env.DEV) {
      console.log("Generating logo variants:", logoId, variants);
    }

    const response = await adminHttpService.post(
      `${logoUrl(logoId)}/variants`,
      {
        variants,
      }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to generate logo variants:", err);
    throw err;
  }
}

export async function getLogoVariants(logoId) {
  try {
    const response = await publicHttpService.get(`${logoUrl(logoId)}/variants`);
    return response.data;
  } catch (err) {
    console.error("Failed to fetch logo variants:", err);
    throw err;
  }
}

export async function downloadLogo(logoId, variant = "original") {
  try {
    const response = await publicHttpService.get(
      `${logoUrl(logoId)}/download`,
      {
        params: { variant },
        responseType: "blob",
      }
    );

    // Create download link
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;

    // Try to get filename from response headers
    const contentDisposition = response.headers["content-disposition"];
    let filename = `logo-${logoId}-${variant}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      );
      if (filenameMatch) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return response.data;
  } catch (err) {
    console.error("Failed to download logo:", err);
    throw err;
  }
}

// Logo file validation helpers
export function validateLogoFile(file, validationOptions = {}) {
  const {
    maxSizeMB = 5,
    allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/svg+xml",
      "image/webp",
    ],
    minWidth = 50,
    maxWidth = 5000,
    minHeight = 50,
    maxHeight = 5000,
  } = validationOptions;

  const errors = [];

  if (!file) {
    errors.push("No logo file provided");
    return { valid: false, errors };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(
      `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(
        ", "
      )}`
    );
  }

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > maxSizeMB) {
    errors.push(
      `File size (${fileSizeMB.toFixed(
        2
      )}MB) exceeds maximum allowed size of ${maxSizeMB}MB`
    );
  }

  // Check file name
  if (file.name.length > 255) {
    errors.push("File name is too long (maximum 255 characters)");
  }

  // Basic image validation (requires loading the image)
  if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        if (this.width < minWidth || this.width > maxWidth) {
          errors.push(
            `Image width (${this.width}px) must be between ${minWidth}px and ${maxWidth}px`
          );
        }
        if (this.height < minHeight || this.height > maxHeight) {
          errors.push(
            `Image height (${this.height}px) must be between ${minHeight}px and ${maxHeight}px`
          );
        }

        resolve({
          valid: errors.length === 0,
          errors,
          dimensions: { width: this.width, height: this.height },
        });
      };
      img.onerror = function () {
        errors.push("Invalid or corrupted image file");
        resolve({ valid: false, errors });
      };
      img.src = URL.createObjectURL(file);
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type,
    },
  };
}

export function getOptimalLogoSize(
  originalWidth,
  originalHeight,
  targetSize = 200
) {
  const aspectRatio = originalWidth / originalHeight;

  let newWidth, newHeight;

  if (aspectRatio > 1) {
    // Landscape
    newWidth = targetSize;
    newHeight = targetSize / aspectRatio;
  } else {
    // Portrait or square
    newHeight = targetSize;
    newWidth = targetSize * aspectRatio;
  }

  return {
    width: Math.round(newWidth),
    height: Math.round(newHeight),
    aspectRatio,
  };
}

// Company name validation
export function validateCompanyName(companyName) {
  const errors = [];

  if (!companyName) {
    errors.push("Company name is required");
    return { valid: false, errors };
  }

  if (typeof companyName !== "string") {
    errors.push("Company name must be a string");
  }

  if (companyName.length < 2) {
    errors.push("Company name must be at least 2 characters long");
  }

  if (companyName.length > 100) {
    errors.push("Company name must be less than 100 characters");
  }

  // Basic sanitization check
  const sanitizedName = companyName.trim();
  if (sanitizedName !== companyName) {
    errors.push("Company name should not have leading or trailing whitespace");
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized: sanitizedName,
  };
}
