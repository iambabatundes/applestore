import {
  userHttpService,
  adminHttpService,
  publicHttpService,
} from "./http/index.js";

const postsPath = "/api/posts";

function postUrl(id) {
  return `${postsPath}/${id}`;
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

  // Log FormData for debugging (consider removing in production)
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  return formData;
}

// Public functions - anyone can view posts
export async function getPosts() {
  try {
    const { data } = await publicHttpService.get(postsPath);
    return data;
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    throw err;
  }
}

export async function getPost(postId) {
  try {
    const { data } = await publicHttpService.get(postUrl(postId));
    return data;
  } catch (err) {
    console.error("Failed to fetch post:", err);
    throw err;
  }
}

export async function getPostsByTag(tagId) {
  try {
    const { data } = await publicHttpService.get(`${postsPath}/tag/${tagId}`);
    return data;
  } catch (err) {
    console.error("Failed to fetch posts by tag:", err);
    throw err;
  }
}

export async function getPostByCategory(categoryId) {
  try {
    const { data } = await publicHttpService.get(
      `${postsPath}/category/${categoryId}`
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch posts by category:", err);
    throw err;
  }
}

// User functions - user-specific operations
export async function getUserPosts() {
  try {
    const { data } = await userHttpService.get(`${postsPath}/me`);
    return data;
  } catch (err) {
    console.error("Failed to fetch user posts:", err);
    throw err;
  }
}

export async function createUserPost(post) {
  try {
    const formData = createFormData(post);
    const { data } = await userHttpService.post(postsPath, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    console.error("Failed to create post:", err);
    throw err;
  }
}

export async function updateUserPost(postId, post) {
  try {
    const formData = createFormData(post);
    const { data } = await userHttpService.put(postUrl(postId), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err) {
    console.error("Failed to update post:", err);
    throw err;
  }
}

export async function deleteUserPost(postId) {
  try {
    const { data } = await userHttpService.delete(postUrl(postId));
    return data;
  } catch (err) {
    console.error("Failed to delete user post:", err);
    throw err;
  }
}

// Admin functions - full post management
export async function savePost(post) {
  try {
    const formData = createFormData(post);
    if (post._id) {
      const { data } = await adminHttpService.put(postUrl(post._id), formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    }
    const { data } = await adminHttpService.post(postsPath, formData, {
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

export async function getAllPosts() {
  try {
    const { data } = await adminHttpService.get(postsPath);
    return data;
  } catch (err) {
    console.error("Failed to fetch all posts:", err);
    throw err;
  }
}

export async function moderatePost(postId, action) {
  try {
    const { data } = await adminHttpService.post(
      `${postUrl(postId)}/moderate`,
      {
        action, // 'approve', 'reject', 'flag', etc.
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to moderate post:", err);
    throw err;
  }
}
