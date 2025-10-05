import React, { useState } from "react";
import _ from "lodash";
import "./styles/addCategory.css";
import SearchBox from "../common/searchBox";
import CategoryTable from "../categories/categoryTable";
import CategoryForm from "../categories/categoryForm";
import useCategory from "./hooks/useCategory";
import CategoryModel from "./categoryModel";

export default function AddCategories({ className }) {
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryForPreview, setSelectedCategoryForPreview] =
    useState(null);
  const [isModalOpen, setIsModalOpen] = useState(null);

  const {
    category,
    loading,
    errors,
    addCategory,
    editCategory,
    deleteCategorys,
  } = useCategory({
    setSelectedCategory,
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryForPreview(null);
  };

  function handleEdit(category) {
    setSelectedCategory(category);
  }

  function handlePreview(category) {
    setSelectedCategoryForPreview(category);
    setIsModalOpen(true);
  }

  function handleSort(sortColumns) {
    setSortColumn(sortColumns);
  }

  function handleSearch(query) {
    setSearchQuery(query);
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

  const flattenedCategories = flattenCategories(category || []);

  let filtered = flattenedCategories;
  if (searchQuery)
    filtered = flattenedCategories.filter((c) =>
      c.name.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

  const totalItems = filtered.length;

  const allCategories = _.orderBy(
    filtered,
    [sortColumn.path],
    [sortColumn.order]
  );

  return (
    <section className="padding">
      <h1 className="addpostCategory__title">Product Categories</h1>
      <section className={`${className} addpostCategory__main`}>
        <CategoryForm
          onAddCategory={addCategory}
          onEditCategory={editCategory}
          parentCategories={flattenedCategories}
          categories={flattenedCategories}
          selectedCategory={selectedCategory}
        />
        <section>
          <span className="postCategory__filtered-container">
            <SearchBox onChange={handleSearch} value={searchQuery} />
            <span className="postCategory__filteredTags-length">
              Showing {totalItems} item{totalItems !== 1 ? "s" : ""}{" "}
            </span>
          </span>
          <CategoryTable
            onSort={handleSort}
            sortColumn={sortColumn}
            onDelete={deleteCategorys}
            onEdit={handleEdit}
            data={allCategories}
            error={errors}
            loading={loading}
            onPreview={handlePreview}
          />
        </section>
      </section>

      {isModalOpen && selectedCategoryForPreview && (
        <CategoryModel
          category={selectedCategoryForPreview}
          products={selectedCategoryForPreview.products}
          onClose={closeModal}
        />
      )}
    </section>
  );
}
