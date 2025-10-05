import { useState, useEffect, useCallback } from "react";
import { getCategories } from "../../../../services/categoryService";

const useFetchCategories = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = useCallback(async () => {
    try {
      const fetchCategories = await getCategories();

      setCategories(fetchCategories);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, setCategories };
};

export default useFetchCategories;
