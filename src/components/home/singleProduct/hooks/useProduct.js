import { useState, useEffect } from "react";
import { getProduct } from "../../../../services/productService";

export const useProduct = (name) => {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);

  function formatPermalink(name) {
    return name
      .toLowerCase()
      .replace(/,/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProduct(formatPermalink(name));
        setProduct(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        // setLoading(false);
      }
    };
    fetchProduct();
  }, [name]);

  return { product, error };
};
