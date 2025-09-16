import { publicHttpService, adminHttpService } from "./http/index.js";

// Use relative path - let services handle their base URLs
const postCategoriesPath = "/api/post-categories";

function postCategoryUrl(id) {
  return `${postCategoriesPath}/${id}`;
}

// Public functions - viewing categories (anyone can see available categories)
export async function getPostCategories() {
  try {
    const { data } = await publicHttpService.get(postCategoriesPath);
    return data;
  } catch (err) {
    console.error("Failed to fetch post categories:", err);
    throw err;
  }
}

export async function getPostCategory(categoryId) {
  try {
    const { data } = await publicHttpService.get(postCategoryUrl(categoryId));
    return data;
  } catch (err) {
    console.error("Failed to fetch post category:", err);
    throw err;
  }
}

export async function getPostsByCategory(categoryId) {
  try {
    const { data } = await publicHttpService.get(
      `${postCategoryUrl(categoryId)}/posts`
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch posts by category:", err);
    throw err;
  }
}

export async function getCategoryHierarchy() {
  try {
    const { data } = await publicHttpService.get(
      `${postCategoriesPath}/hierarchy`
    );
    return data;
  } catch (err) {
    console.error("Failed to fetch category hierarchy:", err);
    throw err;
  }
}

// Admin functions - managing categories
export async function savePostCategory(category) {
  try {
    // Consider removing console.log in production
    console.log("Saving Category:", category);
    const { data } = await adminHttpService.post(postCategoriesPath, category);
    return data;
  } catch (err) {
    console.error("Failed to save post category:", err);
    throw err;
  }
}

export async function updatePostCategory(categoryId, category) {
  try {
    const { data } = await adminHttpService.put(
      postCategoryUrl(categoryId),
      category
    );
    return data;
  } catch (err) {
    console.error("Failed to update post category:", err);
    throw err;
  }
}

export async function deletePostCategory(categoryId) {
  try {
    const { data } = await adminHttpService.delete(postCategoryUrl(categoryId));
    return data;
  } catch (err) {
    console.error("Failed to delete post category:", err);
    throw err;
  }
}

export async function getAllPostCategories() {
  try {
    const { data } = await adminHttpService.get(`${postCategoriesPath}/all`);
    return data;
  } catch (err) {
    console.error("Failed to fetch all post categories:", err);
    throw err;
  }
}

export async function reorderCategories(categoryOrders) {
  try {
    const { data } = await adminHttpService.post(
      `${postCategoriesPath}/reorder`,
      {
        orders: categoryOrders,
      }
    );
    return data;
  } catch (err) {
    console.error("Failed to reorder categories:", err);
    throw err;
  }
}
