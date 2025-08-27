import { httpService, adminHttpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/post-categories`;

function postCategoryUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getPostCategories() {
  try {
    const { data } = await httpService.get(apiEndPoint);
    return data;
  } catch (err) {
    console.error("Failed to fetch post categories:", err);
    throw err;
  }
}

export async function getPostCategory(categoryId) {
  try {
    const { data } = await httpService.get(postCategoryUrl(categoryId));
    return data;
  } catch (err) {
    console.error("Failed to fetch post category:", err);
    throw err;
  }
}

export async function savePostCategory(category) {
  try {
    console.log("Saving Category:", category);
    const { data } = await adminHttpService.post(apiEndPoint, category);
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
