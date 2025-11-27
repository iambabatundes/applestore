import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import {
  getCategories,
  saveCategory,
  updateCategory,
  deleteCategory,
} from "../../../../services/categoryService";

export default function useCategory({ setSelectedCategory }) {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const isFetchingRef = useRef(false);
  const abortRef = useRef(null);

  const handleError = useCallback((error, type = "unknown") => {
    console.log("Error details:", {
      response: error.response,
      message: error.message,
      originalError: error.originalError,
    });

    let userFriendlyMessage = "An unexpected error occurred";

    if (error.isDuplicate) {
      userFriendlyMessage = error.message;
    }
    // Handle different error types from response
    else if (error.response?.status === 409) {
      userFriendlyMessage =
        error.response.data?.message ||
        "A category with this name already exists. Please choose a different name.";
    } else if (error.response?.status === 400) {
      userFriendlyMessage =
        error.response.data?.message ||
        "Please check your input and try again.";
    } else if (error.response?.status === 404) {
      userFriendlyMessage =
        error.response.data?.message || "The requested resource was not found.";
    } else if (error.response?.status === 500) {
      userFriendlyMessage =
        error.response.data?.message || "Server error. Please try again later.";
    } else if (error.message) {
      if (error.message.includes("Network Error")) {
        userFriendlyMessage =
          "Network error. Please check your connection and try again.";
      } else {
        userFriendlyMessage = error.message;
      }
    }

    setErrors({
      message: userFriendlyMessage,
      type,
      originalError: error,
    });

    if (type === "add" || type === "edit") {
      toast.error(userFriendlyMessage, { autoClose: 5000 });
    } else {
      toast.error(userFriendlyMessage);
    }

    return userFriendlyMessage;
  }, []);

  const fetchCategories = useCallback(
    async (showLoading = true) => {
      if (isFetchingRef.current) return;

      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      try {
        isFetchingRef.current = true;
        if (showLoading) setLoading(true);
        setErrors(null);

        const data = await getCategories({ signal: abortRef.current.signal });
        setCategory(data || []);
        setIsInitialized(true);
      } catch (error) {
        if (error.name !== "AbortError") {
          handleError(error, "fetch");
        }
      } finally {
        isFetchingRef.current = false;
        if (showLoading) setLoading(false);
      }
    },
    [handleError]
  );

  const addCategory = useCallback(
    async (formData, storageType = "local") => {
      try {
        setErrors(null);

        const tempId = `temp-${Date.now()}`;
        const temp = {
          _id: tempId,
          name: formData.get("name"),
          slug: formData.get("slug"),
          description: formData.get("description"),
          parent: formData.get("parent") || null,
          productCount: 0,
          depth: 0,
          isTemporary: true,
          categoryImage: { storageType },
        };

        setCategory((prev) => [...prev, temp]);

        const data = await saveCategory(formData, storageType);

        setCategory((prev) => prev.map((c) => (c._id === tempId ? data : c)));

        setSelectedCategory?.(null);
        toast.success(`Category "${data.name}" created successfully!`);

        return { success: true, data };
      } catch (error) {
        console.error("Add category error in hook:", error);

        setCategory((prev) => prev.filter((c) => !c.isTemporary));

        // Pass the ENTIRE error object to handleError, not just the message
        const errorMessage = handleError(error, "add");

        // Return the ENHANCED error with all properties for the form
        throw {
          message: errorMessage,
          isDuplicate: error.isDuplicate || error?.response?.status === 409,
          field: error.field || error?.response?.data?.field || "name",
          response: error.response, // Pass the entire response
          originalError: error, // Pass the original error
        };
      }
    },
    [handleError, setSelectedCategory]
  );

  const editCategory = useCallback(
    async (categoryId, formData, storageType = "local") => {
      const original = category.find((cat) => cat._id === categoryId);
      if (!original) {
        handleError(new Error("Category not found"), "edit");
        return;
      }

      try {
        setErrors(null);

        const optimistic = {
          name: formData.get("name"),
          slug: formData.get("slug"),
          description: formData.get("description"),
          parent: formData.get("parent") || null,
        };

        setCategory((prev) =>
          prev.map((c) =>
            c._id === categoryId ? { ...c, ...optimistic, isUpdating: true } : c
          )
        );

        const data = await updateCategory(categoryId, formData, storageType);

        setCategory((prev) =>
          prev.map((c) =>
            c._id === categoryId ? { ...data, isUpdating: false } : c
          )
        );

        setSelectedCategory?.(null);
        toast.success(`Category "${data.name}" updated successfully!`);

        return { success: true, data };
      } catch (error) {
        setCategory((prev) =>
          prev.map((c) =>
            c._id === categoryId ? { ...original, isUpdating: false } : c
          )
        );

        // Enhanced error handling
        const errorMessage = handleError(error, "edit");

        throw {
          message: errorMessage,
          isDuplicate: error?.response?.status === 409,
          field: error?.response?.data?.field || "name",
        };
      }
    },
    [category, handleError, setSelectedCategory]
  );

  // ... rest of your useCategory hook remains the same
  const deleteCategorys = useCallback(
    async (categoryId) => {
      const toDelete = category.find((cat) => cat._id === categoryId);
      if (!toDelete) {
        handleError(new Error("Category not found"), "delete");
        return;
      }

      try {
        setErrors(null);

        setCategory((prev) =>
          prev.map((c) =>
            c._id === categoryId ? { ...c, isDeleting: true } : c
          )
        );

        await deleteCategory(categoryId);

        setCategory((prev) => prev.filter((c) => c._id !== categoryId));

        setSelectedCategory?.((prev) =>
          prev?._id === categoryId ? null : prev
        );

        toast.success(`Category "${toDelete.name}" deleted successfully!`);

        return { success: true };
      } catch (error) {
        setCategory((prev) =>
          prev.map((c) =>
            c._id === categoryId ? { ...toDelete, isDeleting: false } : c
          )
        );

        handleError(error, "delete");
        throw error;
      }
    },
    [category, handleError, setSelectedCategory]
  );

  const refreshCategories = useCallback(
    () => fetchCategories(true),
    [fetchCategories]
  );

  const clearErrors = useCallback(() => setErrors(null), []);

  useEffect(() => {
    fetchCategories();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchCategories]);

  return {
    category,
    loading,
    errors,
    isInitialized,
    addCategory,
    editCategory,
    deleteCategorys,
    refreshCategories,
    clearErrors,
  };
}
