import {
  httpService,
  userHttpService,
  adminHttpService,
} from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/posts`;

function postUrl(id) {
  return `${apiEndPoint}/${id}`;
}

function createFormData(post) {
  const formData = new FormData();

  for (const key in post) {
    if (key === "_id") {
      continue; // Skip the _id field
    } else if (key === "postMainImage") {
      if (post[key] && post[key].file) {
        formData.append("postMainImage", post[key].file);
      }
    } else if (key === "media") {
      if (Array.isArray(post[key])) {
        post[key].forEach((file) => formData.append("media", file));
      }
    } else if (Array.isArray(post[key])) {
      post[key].forEach((item) => formData.append(`${key}[]`, item));
    } else {
      formData.append(key, post[key] || "");
    }
  }

  // Log FormData for debugging
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  return formData;
}

export async function getPosts() {
  try {
    const { data } = await httpService.get(apiEndPoint);
    return data;
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    throw err;
  }
}

export async function getUserPosts() {
  try {
    const { data } = await userHttpService.get(`${apiEndPoint}/me`);
    return data;
  } catch (err) {
    console.error("Failed to fetch user posts:", err);
    throw err;
  }
}

export async function getPost(postId) {
  try {
    const { data } = await userHttpService.get(postUrl(postId));
    return data;
  } catch (err) {
    console.error("Failed to fetch post:", err);
    throw err;
  }
}

export async function savePost(post) {
  try {
    const formData = createFormData(post);
    if (post._id) {
      const { data } = await adminHttpService.put(postUrl(post._id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    }
    const { data } = await adminHttpService.post(apiEndPoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    console.error("Failed to save post:", err);
    throw err;
  }
}

export async function deletePost(postId) {
  try {
    const { data } = await adminHttpService.delete(postUrl(postId));
    return data;
  } catch (err) {
    console.error("Failed to delete post:", err);
    throw err;
  }
}

export async function getPostsByTag(tagId) {
  try {
    const { data } = await httpService.get(`${apiEndPoint}/tag/${tagId}`);
    return data;
  } catch (err) {
    console.error("Failed to fetch posts by tag:", err);
    throw err;
  }
}

export async function getPostByCategory(categoryId) {
  try {
    const { data } = await httpService.get(
      `${apiEndPoint}/category/${categoryId}`
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch posts by category:", err);
    throw err;
  }
}
