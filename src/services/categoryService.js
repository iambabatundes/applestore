import { publicHttpService, adminHttpService } from "../services/httpService";

const apiEndPoint = `${import.meta.env.VITE_API_URL}/api/categories`;

function categoryUrl(id) {
  return `${apiEndPoint}/${id}`;
}

export async function getCategories() {
  try {
    return publicHttpService.get(apiEndPoint);
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    throw err;
  }
}

export async function getCategory(catetoryId) {
  try {
    publicHttpService.get(categoryUrl(catetoryId));
  } catch (err) {
    console.error("Failed to fetch category:", err);
    throw err;
  }
}

export async function saveCategory(category) {
  try {
    const { data } = await adminHttpService.post(apiEndPoint, category);
    return data;
  } catch (err) {
    console.error("Failed to save category:", err);
    throw err;
  }
}

export async function updateCategory(categoryId, category) {
  try {
    const { data } = await adminHttpService.put(
      categoryUrl(categoryId),
      category
    );
    return data;
  } catch (err) {
    console.error("Failed to update category:", err);
    throw err;
  }
}

export async function deleteCategory(categoryId) {
  try {
    const { data } = await adminHttpService.delete(categoryUrl(categoryId));
    return data;
  } catch (err) {
    console.error("Failed to delete category:", err);
    throw err;
  }
}
