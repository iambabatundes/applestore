import { useState, useEffect, useCallback } from "react";
import { getPromotions } from "../../../../services/promotionServices";

const useFetchPromotions = () => {
  const [promotions, setPromotions] = useState([]);

  const fetchPromotions = useCallback(async () => {
    try {
      const promotion = await getPromotions();
      setPromotions(promotion || []);
    } catch (error) {
      console.error("Failed to fetch Promotions", error);
    }
  }, []);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  return { promotions, setPromotions };
};

export default useFetchPromotions;
