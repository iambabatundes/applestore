import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  deleteCategory,
  saveCategory,
  getCategories,
  updateCategory,
} from "../../../../services/categoryService";

export default function useCategory({ setSelectedCategory }) {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const fetchedCategory = await getCategories();
      setCategory(fetchedCategory);
    } catch (error) {
      setErrors(error);
      console.error("Error fetching category:", error);
      toast.error("Error fetching category");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (formData, storageType = "local") => {
    try {
      // Pass formData directly (it's already a FormData object)
      await saveCategory(formData, storageType);
      toast.success("Category added successfully!");
      fetchCategory();
    } catch (error) {
      setErrors("Error saving category");
      toast.error(error.response?.data?.message || "Error saving category");
      throw error;
    }
  };

  const editCategory = async (categoryId, formData, storageType = "local") => {
    try {
      // Pass formData directly (it's already a FormData object)
      await updateCategory(categoryId, formData, storageType);
      toast.success("Category updated successfully!");
      fetchCategory();
      setSelectedCategory(null);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Error updating category");
      throw error;
    }
  };

  async function deleteCategorys(categoryId) {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    const originalCategory = [...category];

    try {
      await deleteCategory(categoryId);

      const updatedCategory = originalCategory.filter(
        (c) => c._id !== categoryId
      );
      setCategory(updatedCategory);

      toast.success("Category deleted successfully");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("This category has already been deleted");
      } else if (error.response && error.response.status === 400) {
        toast.error(
          error.response.data.message || "Cannot delete this category"
        );
      } else {
        toast.error("An error occurred while deleting the category");
      }

      setCategory(originalCategory);
    }
  }

  return {
    category,
    loading,
    errors,
    addCategory,
    editCategory,
    deleteCategorys,
    fetchCategory,
  };
}
