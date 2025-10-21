import { useState, useEffect } from "react";
import { getProduct } from "../../../../services/productService";

export const useProduct = (name) => {
  const [product, setProduct] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  function formatPermalink(name) {
    if (!name) return "";

    // Decode any URL-encoded characters
    const decoded = decodeURIComponent(name);

    return decoded
      .toLowerCase()
      .trim()
      .replace(/['''"""]/g, "")
      .replace(/[\u2013\u2014\u2015\u2212–—−]/g, "-")
      .replace(/[,\.]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        console.log("Original URL param:", name);
        const formattedName = formatPermalink(name);
        console.log("Formatted slug for query:", formattedName);

        const response = await getProduct(formattedName);
        console.log("API Response:", response);

        // Handle both response formats
        const productData = response.data?.data || response.data;

        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (name) {
      fetchProduct();
    }
  }, [name]);

  return { product, error, loading };
};
