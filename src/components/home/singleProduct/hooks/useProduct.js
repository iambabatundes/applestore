import { useState, useEffect } from "react";
import { getProduct } from "../../common/productDatas";

export const useProduct = (name) => {
  const [product, setProduct] = useState([]);
  const [error, setError] = useState(null);

  function formatPermalink(name) {
    return name.toLowerCase().replaceAll(" ", "-");
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const fetchedProduct = getProduct(formatPermalink(name));
        setProduct(fetchedProduct);
      } catch (error) {
        setError(error);
      }
    };
    fetchProduct();
  }, [name]);

  return { product, error };
};
