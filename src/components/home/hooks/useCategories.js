import { useState, useEffect } from "react";
import { getCategories } from "../../../services/categoryService";

export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      const { data: categories } = await getCategories();
      setCategories(categories);
    };

    fetchCategory();
  }, []);

  return categories;
}
