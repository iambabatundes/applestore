import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getTags,
  saveTag,
  updateTag,
  deleteTag,
} from "../../../../services/tagService";

export default function useTags({ setSelectedTag }) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const { data: fetchedTags } = await getTags();
      setTags(fetchedTags);
    } catch (error) {
      setErrors(errors);
      console.error("Error fetching tags:", error);
      toast.error("Error fetching tags");
    } finally {
      setLoading(false);
    }
  };

  const addTag = async (newTag) => {
    try {
      await saveTag(newTag);
      toast.success("Tag added successfully!");
      fetchTags();
    } catch (error) {
      toast.error("Error saving tag");
    }
  };

  const editTag = async (tagId, updatedTag) => {
    try {
      await updateTag(tagId, updatedTag);
      toast.success("Tag updated successfully!");
      fetchTags();
      setSelectedTag(null);
    } catch (error) {
      console.log(error);
      toast.error("Error updating tag");
    }
  };

  async function deleteTags(tagId) {
    if (!window.confirm("Are you sure you want to delete this tax rate?"))
      return;

    const originalTags = [...tags]; // Make a copy of the tags array

    try {
      // First, try to delete the tag from the server
      await deleteTag(tagId);

      // If successful, update the local state to remove the deleted tag
      const updatedTags = originalTags.filter((t) => t._id !== tagId);
      setTags(updatedTags);

      toast.success("Tag deleted successfully");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("This tag has already been deleted");
      } else {
        toast.error("An error occurred while deleting the tag");
      }
      // If the deletion fails, keep the original tags
      setTags(originalTags);
    }
  }

  return {
    tags,
    loading,
    errors,
    addTag,
    editTag,
    deleteTags,
    fetchTags,
  };
}
