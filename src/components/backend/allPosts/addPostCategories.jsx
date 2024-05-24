import React, { useState, useEffect } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import Header from "../common/header";
import SearchBox from "../common/searchBox";
import { paginate } from "../../utils/paginate";
import Pagination from "../common/pagination";
import CategoryTable from "../categories/categoryTable";
import CategoryForm from "../categories/categoryForm";
import {
  getPostCategories,
  deletePostCategory,
  savePostCategory,
  updatePostCategory,
} from "../../../services/postCategoryServices";

export default function AddPostCategories({ className }) {
  const [categories, setCategories] = useState([]);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    async function getCategory() {
      const { data: fetchedCategories } = await getPostCategories();
      setCategories(fetchedCategories);
    }
    getCategory();
  }, []);

  async function handleSaveOrUpdate(data) {
    try {
      if (isEditMode) {
        const updatedCategories = categories.map((c) =>
          c._id === selectedCategory._id ? { ...c, ...data } : c
        );
        setCategories(updatedCategories);
      } else {
        setCategories([data, ...categories]);
      }
      isEditMode
        ? await updatePostCategory(selectedCategory._id, data)
        : await savePostCategory(data);
      toast.success(
        `Category ${isEditMode ? "updated" : "created"} successfully`
      );
      setIsEditMode(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error saving Category:", error);
      toast.error("Failed to save Category");
      const { data: fetchedCategories } = await getPostCategories();
      setCategories(fetchedCategories);
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
      await deletePostCategory(category._id);
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting Category:", error);
      toast.error("Failed to delete Category");
      setCategories(originalCategories);
    }
  }

  const flattenCategories = (categories, depth = 0) => {
    let flatCategories = [];
    categories.forEach((category) => {
      flatCategories.push({
        ...category,
        depth,
        label: `${"—".repeat(depth)} ${category.name}`,
      });
      if (category.subcategories) {
        flatCategories = [
          ...flatCategories,
          ...flattenCategories(category.subcategories, depth + 1),
        ];
      }
    });
    return flatCategories;
  };

  const flattenedCategories = flattenCategories(categories);

  let filtered = flattenedCategories;
  if (searchQuery)
    filtered = flattenedCategories.filter((c) =>
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
          categories={flattenedCategories}
          flattenedCategories={flattenedCategories}
          isEditMode={isEditMode}
          onSubmit={handleSaveOrUpdate}
          selectedCategory={selectedCategory}
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
            data={flattenedCategories}
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
