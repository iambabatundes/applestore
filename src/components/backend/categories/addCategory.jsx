import React, { useState, useMemo, useCallback, useEffect } from "react";
import _ from "lodash";
import "./styles/addCategory.css";
import SearchBox from "./common/searchBox";
import CategoryTable from "../categories/categoryTable";
import CategoryListView from "../categories/categoryListView";
import CategoryGridView from "../categories/categoryGridView";
import CategoryForm from "../categories/categoryForm";
import useCategory from "./hooks/useCategory";
import CategoryModel from "./categoryModel";

export default function AddCategories({ className }) {
  // State management
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryForPreview, setSelectedCategoryForPreview] =
    useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [filterOptions, setFilterOptions] = useState({
    storageType: "all",
    hasProducts: "all",
    parentOnly: false,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Custom hook for category operations
  const {
    category,
    loading,
    errors,
    addCategory,
    editCategory,
    deleteCategorys,
    refreshCategories,
    clearErrors,
    isInitialized,
  } = useCategory({
    setSelectedCategory,
  });

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      if (clearErrors) clearErrors();
    };
  }, [clearErrors]);

  const flattenCategories = useCallback(
    (categories, depth = 0, parentName = null) => {
      let flatCategories = [];

      if (!categories || !Array.isArray(categories)) {
        return flatCategories;
      }

      categories.forEach((category) => {
        flatCategories.push({
          ...category,
          depth,
          parentName,
          label: `${"—".repeat(depth)} ${category.name}`,
          hasChildren:
            category.subcategories && category.subcategories.length > 0,
        });

        if (category.subcategories && category.subcategories.length > 0) {
          flatCategories = [
            ...flatCategories,
            ...flattenCategories(
              category.subcategories,
              depth + 1,
              category.name
            ),
          ];
        }
      });

      return flatCategories;
    },
    []
  );

  const flattenedCategories = useMemo(() => {
    return flattenCategories(category || []);
  }, [category, flattenCategories]);

  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) {
      return flattenedCategories;
    }

    const query = searchQuery.toLowerCase().trim();

    return flattenedCategories.filter((cat) => {
      // Search in name
      if (cat.name.toLowerCase().includes(query)) return true;

      // Search in slug
      if (cat.slug && cat.slug.toLowerCase().includes(query)) return true;

      // Search in description
      if (cat.description && cat.description.toLowerCase().includes(query))
        return true;

      // Search in parent name
      if (cat.parentName && cat.parentName.toLowerCase().includes(query))
        return true;

      return false;
    });
  }, [flattenedCategories, searchQuery]);

  const advancedFiltered = useMemo(() => {
    let filtered = [...searchFiltered];

    // Filter by storage type
    if (filterOptions.storageType !== "all") {
      filtered = filtered.filter((cat) => {
        const storageType = cat.categoryImage?.storageType || "local";
        return storageType === filterOptions.storageType;
      });
    }

    // Filter by product presence
    if (filterOptions.hasProducts === "yes") {
      filtered = filtered.filter((cat) => cat.productCount > 0);
    } else if (filterOptions.hasProducts === "no") {
      filtered = filtered.filter(
        (cat) => !cat.productCount || cat.productCount === 0
      );
    }

    // Filter parent categories only
    if (filterOptions.parentOnly) {
      filtered = filtered.filter((cat) => cat.depth === 0);
    }

    return filtered;
  }, [searchFiltered, filterOptions]);

  const sortedCategories = useMemo(() => {
    if (!sortColumn || !sortColumn.path) {
      return advancedFiltered;
    }

    return _.orderBy(advancedFiltered, [sortColumn.path], [sortColumn.order]);
  }, [advancedFiltered, sortColumn]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = flattenedCategories.length;
    const parentCategories = flattenedCategories.filter(
      (cat) => cat.depth === 0
    ).length;
    const subcategories = total - parentCategories;
    const withProducts = flattenedCategories.filter(
      (cat) => cat.productCount > 0
    ).length;
    const totalProducts = flattenedCategories.reduce(
      (sum, cat) => sum + (cat.productCount || 0),
      0
    );

    return {
      total,
      parentCategories,
      subcategories,
      withProducts,
      totalProducts,
      filtered: sortedCategories.length,
    };
  }, [flattenedCategories, sortedCategories]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCategoryForPreview(null);
  }, []);

  const handleEdit = useCallback((category) => {
    setSelectedCategory(category);
    // Scroll to form
    const formElement = document.querySelector(".categoryForm__container");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handlePreview = useCallback((category) => {
    setSelectedCategoryForPreview(category);
    setIsModalOpen(true);
  }, []);

  const handleSort = useCallback((sortColumns) => {
    setSortColumn(sortColumns);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refreshCategories();
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshCategories]);

  const handleFilterChange = useCallback((filterName, value) => {
    setFilterOptions((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setFilterOptions({
      storageType: "all",
      hasProducts: "all",
      parentOnly: false,
    });
    setSortColumn({ path: "name", order: "asc" });
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      filterOptions.storageType !== "all" ||
      filterOptions.hasProducts !== "all" ||
      filterOptions.parentOnly
    );
  }, [searchQuery, filterOptions]);

  const handleExport = useCallback(() => {
    const dataStr = JSON.stringify(sortedCategories, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `categories-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [sortedCategories]);

  return (
    <section className="addCategories__wrapper padding">
      {/* Header Section */}
      <header className="addCategories__header">
        <div className="addCategories__header-content">
          <h1 className="addCategories__title">Product Categories</h1>
          <p className="addCategories__subtitle">
            Manage your product categories and their hierarchies
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="addCategories__stats">
          <div className="addCategories__stat-card">
            <div className="addCategories__stat-icon addCategories__stat-icon--primary">
              <i className="fa fa-folder-o" aria-hidden="true"></i>
            </div>
            <div className="addCategories__stat-content">
              <span className="addCategories__stat-value">
                {statistics.total}
              </span>
              <span className="addCategories__stat-label">
                Total Categories
              </span>
            </div>
          </div>

          <div className="addCategories__stat-card">
            <div className="addCategories__stat-icon addCategories__stat-icon--success">
              <i className="fa fa-sitemap" aria-hidden="true"></i>
            </div>
            <div className="addCategories__stat-content">
              <span className="addCategories__stat-value">
                {statistics.parentCategories}
              </span>
              <span className="addCategories__stat-label">
                Parent Categories
              </span>
            </div>
          </div>

          <div className="addCategories__stat-card">
            <div className="addCategories__stat-icon addCategories__stat-icon--info">
              <i className="fa fa-cubes" aria-hidden="true"></i>
            </div>
            <div className="addCategories__stat-content">
              <span className="addCategories__stat-value">
                {statistics.totalProducts}
              </span>
              <span className="addCategories__stat-label">Total Products</span>
            </div>
          </div>

          <div className="addCategories__stat-card">
            <div className="addCategories__stat-icon addCategories__stat-icon--warning">
              <i className="fa fa-filter" aria-hidden="true"></i>
            </div>
            <div className="addCategories__stat-content">
              <span className="addCategories__stat-value">
                {statistics.filtered}
              </span>
              <span className="addCategories__stat-label">
                Filtered Results
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className={`${className} addCategories__main`}>
        {/* Form Section */}
        <aside className="addCategories__form-section">
          <CategoryForm
            onAddCategory={addCategory}
            onEditCategory={editCategory}
            parentCategories={flattenedCategories}
            categories={flattenedCategories}
            selectedCategory={selectedCategory}
          />
        </aside>

        {/* Table Section */}
        <section className="addCategories__table-section">
          {/* Toolbar */}
          <div className="addCategories__toolbar">
            {/* Search and Filter Bar */}
            <div className="addCategories__search-filter-bar">
              <SearchBox
                onChange={handleSearch}
                value={searchQuery}
                placeholder="Search categories..."
              />

              {/* Advanced Filters */}
              <div className="addCategories__advanced-filters">
                {/* Storage Type Filter */}
                <div className="addCategories__filter-group">
                  <label
                    htmlFor="storage-filter"
                    className="addCategories__filter-label"
                  >
                    <i className="fa fa-database" aria-hidden="true"></i>
                    Storage
                  </label>
                  <select
                    id="storage-filter"
                    className="addCategories__filter-select"
                    value={filterOptions.storageType}
                    onChange={(e) =>
                      handleFilterChange("storageType", e.target.value)
                    }
                  >
                    <option value="all">All Storage</option>
                    <option value="local">Local Only</option>
                    <option value="cloudinary">Cloud Only</option>
                  </select>
                </div>

                {/* Products Filter */}
                <div className="addCategories__filter-group">
                  <label
                    htmlFor="products-filter"
                    className="addCategories__filter-label"
                  >
                    <i className="fa fa-cubes" aria-hidden="true"></i>
                    Products
                  </label>
                  <select
                    id="products-filter"
                    className="addCategories__filter-select"
                    value={filterOptions.hasProducts}
                    onChange={(e) =>
                      handleFilterChange("hasProducts", e.target.value)
                    }
                  >
                    <option value="all">All Categories</option>
                    <option value="yes">With Products</option>
                    <option value="no">Without Products</option>
                  </select>
                </div>

                {/* Parent Only Toggle */}
                <label className="addCategories__filter-checkbox">
                  <input
                    type="checkbox"
                    checked={filterOptions.parentOnly}
                    onChange={(e) =>
                      handleFilterChange("parentOnly", e.target.checked)
                    }
                  />
                  <span>Parent Only</span>
                </label>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  className="addCategories__clear-filters-btn"
                  onClick={handleClearFilters}
                  title="Clear all filters"
                >
                  <i className="fa fa-times-circle" aria-hidden="true"></i>
                  Clear Filters
                </button>
              )}
            </div>

            {/* Actions Bar */}
            <div className="addCategories__actions-bar">
              {/* Results Counter */}
              <span className="addCategories__results-count">
                <i className="fa fa-list" aria-hidden="true"></i>
                Showing <strong>{statistics.filtered}</strong> of{" "}
                <strong>{statistics.total}</strong>
                {statistics.filtered === 1 ? " category" : " categories"}
              </span>

              {/* Action Buttons */}
              <div className="addCategories__action-buttons">
                {/* Refresh Button */}
                <button
                  className="addCategories__action-btn"
                  onClick={handleRefresh}
                  disabled={loading || isRefreshing}
                  title="Refresh categories"
                  aria-label="Refresh categories"
                >
                  <i
                    className={`fa fa-refresh ${isRefreshing ? "fa-spin" : ""}`}
                    aria-hidden="true"
                  ></i>
                  Refresh
                </button>

                {/* Export Button */}
                <button
                  className="addCategories__action-btn"
                  onClick={handleExport}
                  disabled={sortedCategories.length === 0}
                  title="Export categories as JSON"
                  aria-label="Export categories"
                >
                  <i className="fa fa-download" aria-hidden="true"></i>
                  Export
                </button>

                {/* View Mode Switcher */}
                <div
                  className="addCategories__view-switcher"
                  role="group"
                  aria-label="View mode"
                >
                  <button
                    className={`addCategories__view-btn ${
                      viewMode === "table" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("table")}
                    title="Table view"
                    aria-label="Table view"
                    aria-pressed={viewMode === "table"}
                  >
                    <i className="fa fa-table" aria-hidden="true"></i>
                  </button>
                  <button
                    className={`addCategories__view-btn ${
                      viewMode === "list" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("list")}
                    title="List view"
                    aria-label="List view"
                    aria-pressed={viewMode === "list"}
                  >
                    <i className="fa fa-list" aria-hidden="true"></i>
                  </button>
                  <button
                    className={`addCategories__view-btn ${
                      viewMode === "grid" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("grid")}
                    title="Grid view"
                    aria-label="Grid view"
                    aria-pressed={viewMode === "grid"}
                  >
                    <i className="fa fa-th" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {errors && (
            <div className="addCategories__error-banner" role="alert">
              <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
              <span>{errors.message || "An error occurred"}</span>
              <button
                className="addCategories__error-dismiss"
                onClick={clearErrors}
                aria-label="Dismiss error"
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
          )}

          {/* Empty State for No Categories */}
          {!loading && isInitialized && statistics.total === 0 && (
            <div className="addCategories__empty-state">
              <i className="fa fa-folder-open-o" aria-hidden="true"></i>
              <h3>No Categories Yet</h3>
              <p>
                Start by creating your first category using the form on the
                left.
              </p>
            </div>
          )}

          {/* Empty State for No Results */}
          {!loading && statistics.total > 0 && statistics.filtered === 0 && (
            <div className="addCategories__empty-state">
              <i className="fa fa-search" aria-hidden="true"></i>
              <h3>No Results Found</h3>
              <p>Try adjusting your filters or search query.</p>
              <button
                className="addCategories__clear-filters-btn"
                onClick={handleClearFilters}
              >
                <i className="fa fa-times-circle" aria-hidden="true"></i>
                Clear All Filters
              </button>
            </div>
          )}

          {/* Dynamic View Display */}
          {(loading || statistics.filtered > 0) && (
            <>
              {viewMode === "table" && (
                <CategoryTable
                  onSort={handleSort}
                  sortColumn={sortColumn}
                  onDelete={deleteCategorys}
                  onEdit={handleEdit}
                  data={sortedCategories}
                  error={errors}
                  loading={loading}
                  onPreview={handlePreview}
                />
              )}

              {viewMode === "list" && (
                <CategoryListView
                  data={sortedCategories}
                  onEdit={handleEdit}
                  onPreview={handlePreview}
                  onDelete={deleteCategorys}
                  loading={loading}
                />
              )}

              {viewMode === "grid" && (
                <CategoryGridView
                  data={sortedCategories}
                  onEdit={handleEdit}
                  onPreview={handlePreview}
                  onDelete={deleteCategorys}
                  loading={loading}
                />
              )}
            </>
          )}
        </section>
      </section>

      {/* Modal */}
      {isModalOpen && selectedCategoryForPreview && (
        <CategoryModel
          category={selectedCategoryForPreview}
          products={selectedCategoryForPreview.products}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
