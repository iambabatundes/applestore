import { useState, useEffect, useCallback } from "react";
import { getPromotions } from "../../../../services/promotionServices";

const useFetchPromotions = () => {
  const [promotions, setPromotions] = useState([]);

  const fetchPromotions = useCallback(async () => {
    try {
      const { data } = await getPromotions();
      setPromotions(data);
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
