import { adminHttpService, httpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/post-tags`;

function postTagsUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getPostTags() {
  try {
    const { data } = await httpService.get(apiEndPoint);
    return data;
  } catch (err) {
    console.error("Failed to fetch post tags:", err);
    throw err;
  }
}

export async function getPostTag(tagId) {
  try {
    const { data } = await httpService.get(postTagsUrl(tagId));
    return data;
  } catch (err) {
    console.error("Failed to fetch tag:", err);
    throw err;
  }
}

export async function savePostTag(tag) {
  try {
    const { data } = await adminHttpService.post(apiEndPoint, tag);
    return data;
  } catch (err) {
    console.error("Failed to save tag:", err);
    throw err;
  }
}

export async function updatePostTag(tagId, tag) {
  try {
    const { data } = await adminHttpService.put(postTagsUrl(tagId), tag);
    return data;
  } catch (err) {
    console.error("Failed to update tag:", err);
    throw err;
  }
}

export async function deletePostTag(tagId) {
  try {
    const { data } = await adminHttpService.delete(postTagsUrl(tagId));
    return data;
  } catch (err) {
    console.error("Failed to delete tag:", err);
    throw err;
  }
}
