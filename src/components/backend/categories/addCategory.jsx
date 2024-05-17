import React, { useState, useEffect } from "react";
import _ from "lodash";
import { toast } from "react-toastify";

import Header from "../common/header";
import "../../backend/styles/cateTagStyle.css";
import SearchBox from "../common/searchBox";
import { paginate } from "../../utils/paginate";
import Pagination from "../common/pagination";
import CategoryTable from "./categoryTable";
import {
  getCategories,
  updateCategory,
  saveCategory,
  deleteCategory,
} from "../../../services/categoryService";
import CategoryForm from "./categoryForm";

export default function AddCategories({ className }) {
  const [categories, setCategories] = useState([]);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function getCategory() {
      const { data: fetchedCategories } = await getCategories();
      setCategories(fetchedCategories);
    }

    getCategory();
  }, []);

  async function handleSaveOrUpdate(data) {
    try {
      // Update UI immediately
      if (isEditMode) {
        // Update existing category
        const updatedCategories = categories.map((c) =>
          c._id === selectedCategory._id ? { ...c, ...data } : c
        );
        setCategories(updatedCategories);
      } else {
        // Create new category
        setCategories([data, ...categories]);
      }

      // Send request to server
      const response = isEditMode
        ? await updateCategory(selectedCategory._id, data)
        : await saveCategory(data);

      // Handle success (no action needed)
      toast.success(
        `Category ${isEditMode ? "updated" : "created"} successfully`
      );
      setIsEditMode(false);
      setSelectedCategory(null);
    } catch (error) {
      // Handle failure
      console.error("Error saving Category:", error);
      toast.error("Failed to save Category");

      // Revert changes made on the UI
      if (isEditMode) {
        // Fetch categories from server to get the latest data
        const { data: fetchedCategories } = await getCategories();
        setCategories(fetchedCategories);
      } else {
        // Remove newly added category from the UI
        const updatedCategories = categories.filter((c) => c._id !== data._id);
        setCategories(updatedCategories);
      }
    }
  }

  function handleEdit(category) {
    setIsEditMode(true);
    setSelectedCategory(category);
  }

  function handleSort(sortColumns) {
    setSortColumn(sortColumns);
  }

  function handleSearch(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  async function handleDelete(category) {
    const originalCategories = [...categories];
    const updatedCategories = originalCategories.filter(
      (c) => c._id !== category._id
    );
    setCategories(updatedCategories);

    try {
      await deleteCategory(category._id);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting Category:", error);
      toast.error("Failed to delete Category");
      setCategories(originalCategories);
    }
  }

  function handlePreview() {}

  let filtered = categories;
  if (searchQuery)
    filtered = categories.filter((c) =>
      c.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

  const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

  const totalItems = filtered.length;
  const paginationEnabled = totalItems > 1;

  const allCategories = paginationEnabled
    ? paginate(sorted, currentPage, pageSize)
    : sorted;

  return (
    <section className="padding">
      <Header headerTitle="Product Categories" />
      <section className={`${className} tag-header`}>
        <CategoryForm
          // flattenedCategories={flattenedCategories}
          categories={categories}
          isEditMode={isEditMode}
          onSubmit={handleSaveOrUpdate}
          // onSaveOrUpdate={handleSaveOrUpdate}
          selectedCategory={selectedCategory}
          handleSaveOrUpdate={handleSaveOrUpdate}
        />
        <article>
          <span>
            <SearchBox onChange={handleSearch} value={searchQuery} />
            <span>
              Showing {totalItems} item{totalItems !== 1 ? "s" : ""}{" "}
            </span>
          </span>
          <CategoryTable
            onSort={handleSort}
            sortColumn={sortColumn}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onPreview={handlePreview}
            data={allCategories}
          />
          <Pagination
            itemsCount={filtered.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </article>
      </section>
    </section>
  );
}
