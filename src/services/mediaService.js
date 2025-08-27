import { httpService, adminHttpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/media`;

function mediaUrl(id) {
  return `${apiEndPoint}/${id}`;
}

function createFormData(file) {
  const formData = new FormData();
  if (file) {
    formData.append("media", file);
  }

  // Log FormData for debugging
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value instanceof File ? value.name : value}`);
  }

  return formData;
}

export async function getUploads() {
  try {
    const { data } = await httpService.get(apiEndPoint);
    return data;
  } catch (err) {
    console.error("Failed to fetch uploads:", err);
    throw err;
  }
}

export async function getUpload(uploadId) {
  try {
    const { data } = await httpService.get(mediaUrl(uploadId));
    return data;
  } catch (err) {
    console.error("Failed to fetch upload:", err);
    throw err;
  }
}

export async function saveUpload(upload) {
  try {
    if (upload._id) {
      const { data } = await adminHttpService.put(
        mediaUrl(upload._id),
        createFormData(upload.file)
      );
      return data;
    }
    const { data } = await adminHttpService.post(
      apiEndPoint,
      createFormData(upload.file),
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to save upload:", err);
    throw err;
  }
}

export async function deleteUpload(uploadId) {
  try {
    const { data } = await adminHttpService.delete(mediaUrl(uploadId));
    return data;
  } catch (err) {
    console.error("Failed to delete upload:", err);
    throw err;
  }
}

export async function uploadFile(file, onUploadProgress) {
  try {
    const formData = createFormData(file);
    const { data } = await adminHttpService.post(apiEndPoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
    return data;
  } catch (err) {
    console.error("Failed to upload file:", err);
    throw err;
  }
}
