import { adminHttpService, httpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/tags`;

function tagsUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getTags() {
  try {
    const { data } = await httpService.get(apiEndPoint);
    return data;
  } catch (err) {
    console.error("Failed to fetch tags:", err);
    throw err;
  }
}

export async function getTag(tagId) {
  try {
    const { data } = await httpService.get(tagsUrl(tagId));
    return data;
  } catch (err) {
    console.error("Failed to fetch tag:", err);
    throw err;
  }
}

export async function saveTag(tag) {
  try {
    const { data } = await adminHttpService.post(apiEndPoint, tag);
    return data;
  } catch (err) {
    console.error("Failed to save tag:", err);
    throw err;
  }
}

export async function updateTag(tagId, tag) {
  try {
    const { data } = await adminHttpService.put(tagsUrl(tagId), tag);
    return data;
  } catch (err) {
    console.error("Failed to update tag:", err);
    throw err;
  }
}

export async function deleteTag(tagId) {
  try {
    const { data } = await adminHttpService.delete(tagsUrl(tagId));
    return data;
  } catch (err) {
    console.error("Failed to delete tag:", err);
    throw err;
  }
}
