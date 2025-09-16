import { adminHttpService, publicHttpService } from "./http/index.js";

const postTagsPath = "/api/post-tags";

function postTagsUrl(id) {
  return `${postTagsPath}/${id}`;
}

export async function getPostTags() {
  try {
    const { data } = await publicHttpService.get(postTagsPath);
    return data;
  } catch (err) {
    console.error("Failed to fetch post tags:", err);
    throw err;
  }
}

export async function getPostTag(tagId) {
  try {
    const { data } = await publicHttpService.get(postTagsUrl(tagId));
    return data;
  } catch (err) {
    console.error("Failed to fetch tag:", err);
    throw err;
  }
}

export async function getPostsByTag(tagId) {
  try {
    const { data } = await publicHttpService.get(`${postTagsUrl(tagId)}/posts`);
    return data;
  } catch (err) {
    console.error("Failed to fetch posts by tag:", err);
    throw err;
  }
}

export async function getPopularTags(limit = 10) {
  try {
    const { data } = await publicHttpService.get(
      `${postTagsPath}/popular?limit=${limit}`
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch popular tags:", err);
    throw err;
  }
}

// Admin functions - managing tags
export async function savePostTag(tag) {
  try {
    const { data } = await adminHttpService.post(postTagsPath, tag);
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

export async function getAllPostTags() {
  try {
    const { data } = await adminHttpService.get(`${postTagsPath}/all`);
    return data;
  } catch (err) {
    console.error("Failed to fetch all post tags:", err);
    throw err;
  }
}

export async function mergePostTags(sourceTagId, targetTagId) {
  try {
    const { data } = await adminHttpService.post(`${postTagsPath}/merge`, {
      sourceTagId,
      targetTagId,
    });
    return data;
  } catch (err) {
    console.error("Failed to merge tags:", err);
    throw err;
  }
}
