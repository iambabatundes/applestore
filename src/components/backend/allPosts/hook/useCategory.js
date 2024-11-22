import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  deletePostCategory,
  getPostCategories,
  savePostCategory,
  updatePostCategory,
} from "../../../../services/postCategoryServices";
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
      const { data: fetchedCategory } = await getPostCategories();
      setCategory(fetchedCategory);
    } catch (error) {
      setErrors(errors);
      console.error("Error fetching category:", error);
      toast.error("Error fetching category");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (newCategory) => {
    try {
      await savePostCategory(newCategory);
      toast.success("Category added successfully!");
      fetchCategory();
    } catch (error) {
      setErrors("Error saving category");
      toast.error("Error saving category");
    }
  };

  const editCategory = async (categoryId, updatedCategory) => {
    try {
      await updatePostCategory(categoryId, updatedCategory);
      toast.success("Category updated successfully!");
      fetchCategory();
      setSelectedCategory(null);
    } catch (error) {
      console.log(error);
      toast.error("Error updating category");
    }
  };

  async function deleteCategorys(categoryId) {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    const originalCategory = [...category];

    try {
      await deletePostCategory(categoryId);

      const updatedCategory = originalCategory.filter(
        (c) => c._id !== categoryId
      );
      setCategory(updatedCategory);

      toast.success("Category deleted successfully");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("This category has already been deleted");
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
