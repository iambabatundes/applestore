import { useState, useEffect, useCallback } from "react";
import { getTags } from "../../../../services/tagService";

const useFetchTags = () => {
  const [tags, setTags] = useState([]);

  const fetchTags = useCallback(async () => {
    try {
      const { data } = await getTags();
      setTags(data);
    } catch (error) {
      console.error("Failed to fetch tags", error);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, setTags };
};

export default useFetchTags;
