import {
  publicHttpService,
  adminHttpService,
  userHttpService,
} from "./http/index.js";

const MEDIA_ENDPOINT = "/media";

function mediaUrl(id) {
  return `${MEDIA_ENDPOINT}/${id}`;
}

function createFormData(file, metadata = {}) {
  const formData = new FormData();

  if (file) {
    formData.append("media", file);
  }

  // Add metadata if provided
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

  // Log FormData for debugging (only in development)
  if (import.meta.env.DEV) {
    console.log("MediaService FormData contents:");
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
    const response = await publicHttpService.get(MEDIA_ENDPOINT, { params });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch uploads:", err);
    throw err;
  }
}

export async function getUpload(uploadId) {
  try {
    const response = await publicHttpService.get(mediaUrl(uploadId));
    return response.data;
  } catch (err) {
    console.error("Failed to fetch upload:", err);
    throw err;
  }
}

// Admin operations for managing media
export async function getAdminUploads(params = {}) {
  try {
    const response = await adminHttpService.get(MEDIA_ENDPOINT, { params });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch admin uploads:", err);
    throw err;
  }
}

export async function saveUpload(upload, options = {}) {
  try {
    const { file, metadata = {}, onProgress } = upload;
    const formData = createFormData(file, metadata);

    const requestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress || options.onProgress,
      timeout: options.timeout || 60000,
      ...options.requestConfig,
    };

    if (upload._id) {
      // Update existing upload
      const response = await adminHttpService.put(
        mediaUrl(upload._id),
        formData,
        requestConfig
      );
      return response.data;
    } else {
      // Create new upload
      const response = await adminHttpService.post(
        MEDIA_ENDPOINT,
        formData,
        requestConfig
      );
      return response.data;
    }
  } catch (err) {
    console.error("Failed to save upload:", err);
    throw err;
  }
}

export async function deleteUpload(uploadId) {
  try {
    const response = await adminHttpService.delete(mediaUrl(uploadId));
    return response.data;
  } catch (err) {
    console.error("Failed to delete upload:", err);
    throw err;
  }
}

// Enhanced upload function with better options
export async function uploadFile(file, options = {}) {
  try {
    const {
      metadata = {},
      onProgress,
      timeout = 60000,
      validateFile = true,
    } = options;

    // Validate file if requested
    if (validateFile) {
      const validation = validateMediaFile(file, options.validation);
      if (!validation.valid) {
        throw new Error(
          `File validation failed: ${validation.errors.join(", ")}`
        );
      }
    }

    const formData = createFormData(file, metadata);

    const response = await adminHttpService.post(MEDIA_ENDPOINT, formData, {
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
      timeout,
      ...options.requestConfig,
    });

    return response.data;
  } catch (err) {
    console.error("Failed to upload file:", err);
    throw err;
  }
}

// User-specific media operations
export async function uploadUserMedia(file, options = {}) {
  try {
    const { metadata = {}, onProgress, timeout = 60000 } = options;

    const formData = createFormData(file, metadata);

    const response = await userHttpService.post(MEDIA_ENDPOINT, formData, {
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
      timeout,
      ...options.requestConfig,
    });

    return response.data;
  } catch (err) {
    console.error("Failed to upload user media:", err);
    throw err;
  }
}

export async function getUserUploads(params = {}) {
  try {
    const response = await userHttpService.get(MEDIA_ENDPOINT, { params });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch user uploads:", err);
    throw err;
  }
}

// Bulk operations
export async function uploadMultipleFiles(files, options = {}) {
  try {
    const { onProgress, onFileProgress } = options;
    const uploadPromises = [];
    const results = [];
    let completedFiles = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileOptions = {
        ...options,
        onProgress: onFileProgress
          ? (percent) => onFileProgress(i, percent, file)
          : undefined,
      };

      uploadPromises.push(
        uploadFile(file, fileOptions).then((result) => {
          completedFiles++;
          if (onProgress) {
            onProgress(Math.round((completedFiles / files.length) * 100));
          }
          return result;
        })
      );
    }

    const uploadResults = await Promise.allSettled(uploadPromises);

    uploadResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        results.push({ success: true, data: result.value, file: files[index] });
      } else {
        results.push({
          success: false,
          error: result.reason,
          file: files[index],
        });
      }
    });

    return results;
  } catch (err) {
    console.error("Failed to upload multiple files:", err);
    throw err;
  }
}

export async function deleteMultipleUploads(uploadIds) {
  try {
    const deletePromises = uploadIds.map((id) =>
      adminHttpService.delete(mediaUrl(id)).catch((err) => ({ error: err, id }))
    );

    const results = await Promise.allSettled(deletePromises);
    return results.map((result, index) => ({
      id: uploadIds[index],
      success: result.status === "fulfilled" && !result.value.error,
      error: result.status === "rejected" ? result.reason : result.value?.error,
    }));
  } catch (err) {
    console.error("Failed to delete multiple uploads:", err);
    throw err;
  }
}

// Media processing operations
export async function processMedia(uploadId, processingOptions = {}) {
  try {
    const response = await adminHttpService.post(
      `${mediaUrl(uploadId)}/process`,
      processingOptions
    );
    return response.data;
  } catch (err) {
    console.error("Failed to process media:", err);
    throw err;
  }
}

export async function getMediaMetadata(uploadId) {
  try {
    const response = await publicHttpService.get(
      `${mediaUrl(uploadId)}/metadata`
    );
    return response.data;
  } catch (err) {
    console.error("Failed to get media metadata:", err);
    throw err;
  }
}

export async function generateThumbnail(uploadId, options = {}) {
  try {
    const response = await adminHttpService.post(
      `${mediaUrl(uploadId)}/thumbnail`,
      options
    );
    return response.data;
  } catch (err) {
    console.error("Failed to generate thumbnail:", err);
    throw err;
  }
}

// File validation helpers
export function validateMediaFile(file, validationOptions = {}) {
  const {
    maxSizeMB = 50,
    allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "video/mp4",
      "video/mpeg",
      "video/quicktime",
      "audio/mp3",
      "audio/wav",
      "audio/mpeg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    minSizeKB = 1,
  } = validationOptions;

  const errors = [];

  if (!file) {
    errors.push("No file provided");
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
  const fileSizeKB = file.size / 1024;

  if (fileSizeMB > maxSizeMB) {
    errors.push(
      `File size (${fileSizeMB.toFixed(
        2
      )}MB) exceeds maximum allowed size of ${maxSizeMB}MB`
    );
  }

  if (fileSizeKB < minSizeKB) {
    errors.push(
      `File size (${fileSizeKB.toFixed(
        2
      )}KB) is below minimum required size of ${minSizeKB}KB`
    );
  }

  // Check if file name is valid
  if (file.name.length > 255) {
    errors.push("File name is too long (maximum 255 characters)");
  }

  return {
    valid: errors.length === 0,
    errors,
    fileInfo: {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
    },
  };
}

export function getFileTypeCategory(file) {
  if (!file || !file.type) return "unknown";

  const type = file.type.toLowerCase();

  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  if (type.includes("pdf")) return "document";
  if (type.includes("word") || type.includes("doc")) return "document";
  if (type.includes("excel") || type.includes("sheet")) return "spreadsheet";

  return "other";
}

// Download helper
export async function downloadMedia(uploadId, filename) {
  try {
    const response = await publicHttpService.get(
      `${mediaUrl(uploadId)}/download`,
      {
        responseType: "blob",
      }
    );

    // Create download link
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || `media-${uploadId}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return response.data;
  } catch (err) {
    console.error("Failed to download media:", err);
    throw err;
  }
}
