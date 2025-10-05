import { adminHttpService, publicHttpService } from "./http/index.js";

const tagsPath = "/api/tags";

function tagsUrl(id) {
  return `${tagsPath}/${id}`;
}

function clearTagsCache() {
  adminHttpService.clearCache();
  publicHttpService.clearCache();
}

export async function getTags() {
  try {
    const response = await publicHttpService.get(tagsPath);
    return response;
  } catch (err) {
    console.error("Failed to fetch tags:", err);
    throw err;
  }
}

export async function getTag(tagId) {
  try {
    const { data } = await publicHttpService.get(tagsUrl(tagId));
    // clearTagsCache();
    return data;
  } catch (err) {
    console.error("Failed to fetch tag:", err);
    throw err;
  }
}

export async function getItemsByTag(tagId) {
  try {
    const { data } = await publicHttpService.get(`${tagsUrl(tagId)}/items`);
    return data;
  } catch (err) {
    console.error("Failed to fetch items by tag:", err);
    throw err;
  }
}

export async function getPopularTags(limit = 20) {
  try {
    const { data } = await publicHttpService.get(
      `${tagsPath}/popular?limit=${limit}`
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch popular tags:", err);
    throw err;
  }
}

export async function searchTags(query) {
  try {
    const { data } = await publicHttpService.get(
      `${tagsPath}/search?q=${encodeURIComponent(query)}`
    );
    return data;
  } catch (err) {
    console.error("Failed to search tags:", err);
    throw err;
  }
}

export async function saveTag(tag) {
  try {
    const { data } = await adminHttpService.post(tagsPath, tag);
    clearTagsCache();
    return data;
  } catch (err) {
    console.error("Failed to save tag:", err);
    throw err;
  }
}

export async function updateTag(tagId, tag) {
  try {
    const { data } = await adminHttpService.put(tagsUrl(tagId), tag);
    clearTagsCache();
    return data;
  } catch (err) {
    console.error("Failed to update tag:", err);
    throw err;
  }
}

export async function deleteTag(tagId) {
  try {
    const { data } = await adminHttpService.delete(tagsUrl(tagId));
    clearTagsCache();
    return data;
  } catch (err) {
    console.error("Failed to delete tag:", err);
    throw err;
  }
}

export async function getAllTags() {
  try {
    const { data } = await adminHttpService.get(`${tagsPath}/all`);
    return data;
  } catch (err) {
    console.error("Failed to fetch all tags:", err);
    throw err;
  }
}

export async function mergeTags(sourceTagId, targetTagId) {
  try {
    const { data } = await adminHttpService.post(`${tagsPath}/merge`, {
      sourceTagId,
      targetTagId,
    });
    return data;
  } catch (err) {
    console.error("Failed to merge tags:", err);
    throw err;
  }
}

export async function bulkCreateTags(tags) {
  try {
    const { data } = await adminHttpService.post(`${tagsPath}/bulk`, { tags });
    return data;
  } catch (err) {
    console.error("Failed to bulk create tags:", err);
    throw err;
  }
}
