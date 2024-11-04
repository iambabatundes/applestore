import { useState, useEffect, useCallback } from "react";
import { getPromotions } from "../../../../services/promotionServices";

const useFetchPromotions = () => {
  const [promotions, setPromotions] = useState([]);

  const fetchTags = useCallback(async () => {
    try {
      const { data } = await getPromotions();
      setPromotions(data);
    } catch (error) {
      console.error("Failed to fetch Promotions", error);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { promotions, setPromotions };
};

export default useFetchPromotions;
