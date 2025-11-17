import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./styles/inventory.css";
import { getProducts, updateProduct } from "../../../services/productService";

export default function Inventory({ darkMode }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    stockStatus: "all",
    category: "all",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkStockValue, setBulkStockValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, filters]);

  useEffect(() => {
    calculateStats();
  }, [filteredProducts]);

  async function fetchInventory() {
    setLoading(true);
    try {
      const response = await getProducts({ limit: 1000 });
      const productsData = response.products || response || [];
      setProducts(productsData);

      const uniqueCategories = [
        ...new Set(productsData.map((p) => p.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(query) ||
          p.sku?.toLowerCase().includes(query)
      );
    }

    // Stock status filter
    if (filters.stockStatus !== "all") {
      filtered = filtered.filter((p) => {
        const stock = p.numberInStock || 0;
        const lowStockThreshold = p.lowStockThreshold || 10;

        if (filters.stockStatus === "out-of-stock") return stock === 0;
        if (filters.stockStatus === "low-stock")
          return stock > 0 && stock <= lowStockThreshold;
        if (filters.stockStatus === "in-stock")
          return stock > lowStockThreshold;
        return true;
      });
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Sorting
    filtered.sort((a, b) => {
      let valueA, valueB;

      switch (filters.sortBy) {
        case "stock":
          valueA = a.numberInStock || 0;
          valueB = b.numberInStock || 0;
          break;
        case "sales":
          valueA = a.numberOfSales || 0;
          valueB = b.numberOfSales || 0;
          break;
        case "name":
        default:
          valueA = a.name?.toLowerCase() || "";
          valueB = b.name?.toLowerCase() || "";
      }

      if (filters.sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }

  function calculateStats() {
    const stats = {
      totalProducts: filteredProducts.length,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
      totalValue: 0,
    };

    filteredProducts.forEach((p) => {
      const stock = p.numberInStock || 0;
      const price = p.price || 0;
      const lowThreshold = p.lowStockThreshold || 10;

      stats.totalValue += stock * price;

      if (stock === 0) {
        stats.outOfStock++;
      } else if (stock <= lowThreshold) {
        stats.lowStock++;
      } else {
        stats.inStock++;
      }
    });

    setStats(stats);
  }

  async function handleStockUpdate(productId, newStock) {
    try {
      await updateProduct(productId, { numberInStock: parseInt(newStock) });

      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, numberInStock: parseInt(newStock) } : p
        )
      );

      toast.success("Stock updated successfully");
    } catch (error) {
      console.error("Failed to update stock:", error);
      toast.error("Failed to update stock");
    }
  }

  async function handleBulkStockUpdate() {
    if (selectedProducts.length === 0) {
      toast.warning("No products selected");
      return;
    }

    if (!bulkStockValue || isNaN(bulkStockValue)) {
      toast.error("Please enter a valid stock value");
      return;
    }

    try {
      const promises = selectedProducts.map((id) =>
        updateProduct(id, { numberInStock: parseInt(bulkStockValue) })
      );

      await Promise.all(promises);

      setProducts((prev) =>
        prev.map((p) =>
          selectedProducts.includes(p._id)
            ? { ...p, numberInStock: parseInt(bulkStockValue) }
            : p
        )
      );

      toast.success(`${selectedProducts.length} products updated`);
      setSelectedProducts([]);
      setShowBulkUpdate(false);
      setBulkStockValue("");
    } catch (error) {
      console.error("Bulk update failed:", error);
      toast.error("Failed to update products");
    }
  }

  function handleSelectProduct(productId) {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }

  function handleSelectAll(checked) {
    if (checked) {
      setSelectedProducts(filteredProducts.map((p) => p._id));
    } else {
      setSelectedProducts([]);
    }
  }

  function getStockStatus(product) {
    const stock = product.numberInStock || 0;
    const threshold = product.lowStockThreshold || 10;

    if (stock === 0) return { label: "Out of Stock", class: "out-of-stock" };
    if (stock <= threshold) return { label: "Low Stock", class: "low-stock" };
    return { label: "In Stock", class: "in-stock" };
  }

  function exportToCSV() {
    const headers = [
      "SKU",
      "Product Name",
      "Category",
      "Stock",
      "Sales",
      "Price",
      "Value",
      "Status",
    ];
    const rows = filteredProducts.map((p) => {
      const stock = p.numberInStock || 0;
      const price = p.price || 0;
      const status = getStockStatus(p);

      return [
        p.sku || "N/A",
        p.name || "N/A",
        p.category || "N/A",
        stock,
        p.numberOfSales || 0,
        price.toFixed(2),
        (stock * price).toFixed(2),
        status.label,
      ];
    });

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inventory-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Inventory exported successfully");
  }

  if (loading) {
    return (
      <div className="inventory-container">
        <div className="inventory-loading">
          <div className="spinner-large"></div>
          <p>Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-container">
      {/* Header */}
      <div className="inventory-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Track and manage product stock levels</p>
        </div>
        <button className="btn-export" onClick={exportToCSV}>
          <i className="fa fa-download"></i>
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="inventory-stats">
        <div className="stat-card total">
          <div className="stat-icon">
            <i className="fa fa-box"></i>
          </div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card in-stock">
          <div className="stat-icon">
            <i className="fa fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>In Stock</h3>
            <p className="value">{stats.inStock}</p>
          </div>
        </div>

        <div className="stat-card low-stock">
          <div className="stat-icon">
            <i className="fa fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>Low Stock</h3>
            <p className="value">{stats.lowStock}</p>
          </div>
        </div>

        <div className="stat-card out-of-stock">
          <div className="stat-icon">
            <i className="fa fa-times-circle"></i>
          </div>
          <div className="stat-content">
            <h3>Out of Stock</h3>
            <p className="value">{stats.outOfStock}</p>
          </div>
        </div>

        <div className="stat-card value">
          <div className="stat-icon">
            <i className="fa fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>Total Value</h3>
            <p className="value">${stats.totalValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="inventory-controls">
        <div className="search-bar">
          <i className="fa fa-search"></i>
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters">
          <select
            value={filters.stockStatus}
            onChange={(e) =>
              setFilters({ ...filters, stockStatus: e.target.value })
            }
          >
            <option value="all">All Stock Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="name">Sort by Name</option>
            <option value="stock">Sort by Stock</option>
            <option value="sales">Sort by Sales</option>
          </select>

          <button
            className="sort-order-btn"
            onClick={() =>
              setFilters({
                ...filters,
                sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
              })
            }
          >
            <i
              className={`fa fa-arrow-${
                filters.sortOrder === "asc" ? "up" : "down"
              }`}
            ></i>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bulk-actions">
          <span className="selection-count">
            {selectedProducts.length} product
            {selectedProducts.length !== 1 ? "s" : ""} selected
          </span>
          <button
            className="btn-bulk-update"
            onClick={() => setShowBulkUpdate(true)}
          >
            <i className="fa fa-edit"></i>
            Update Stock
          </button>
          <button
            className="btn-clear-selection"
            onClick={() => setSelectedProducts([])}
          >
            <i className="fa fa-times"></i>
            Clear
          </button>
        </div>
      )}

      {/* Inventory Table */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedProducts.length === filteredProducts.length &&
                    filteredProducts.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Sales</th>
              <th>Price</th>
              <th>Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const status = getStockStatus(product);
              const stock = product.numberInStock || 0;
              const price = product.price || 0;
              const value = stock * price;

              return (
                <tr key={product._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                    />
                  </td>
                  <td className="product-cell">
                    {product.featureImage && (
                      <img
                        src={`${process.env.REACT_APP_MEDIA_URL}/uploads/${product.featureImage.filename}`}
                        alt={product.name}
                        className="product-thumbnail"
                      />
                    )}
                    <span>{product.name}</span>
                  </td>
                  <td className="sku">{product.sku || "N/A"}</td>
                  <td>{product.category || "N/A"}</td>
                  <td>
                    <input
                      type="number"
                      className="stock-input"
                      value={stock}
                      onChange={(e) =>
                        handleStockUpdate(product._id, e.target.value)
                      }
                      min="0"
                    />
                  </td>
                  <td>{product.numberOfSales || 0}</td>
                  <td>${price.toFixed(2)}</td>
                  <td className="value-cell">${value.toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${status.class}`}>
                      {status.label}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() =>
                        (window.location.href = `/admin/products/${product._id}`)
                      }
                    >
                      <i className="fa fa-eye"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <i className="fa fa-box-open"></i>
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* Bulk Update Modal */}
      {showBulkUpdate && (
        <div className="modal-overlay" onClick={() => setShowBulkUpdate(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bulk Stock Update</h3>
              <button
                className="close-btn"
                onClick={() => setShowBulkUpdate(false)}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>
                Update stock for {selectedProducts.length} selected product
                {selectedProducts.length !== 1 ? "s" : ""}
              </p>
              <div className="form-group">
                <label>New Stock Value</label>
                <input
                  type="number"
                  className="form-control"
                  value={bulkStockValue}
                  onChange={(e) => setBulkStockValue(e.target.value)}
                  placeholder="Enter stock quantity"
                  min="0"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowBulkUpdate(false)}
              >
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleBulkStockUpdate}>
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
