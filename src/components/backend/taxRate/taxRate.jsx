import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getTaxRates,
  deleteTaxRate,
  deactivateTaxRate,
} from "../../../services/taxRateService";
import TaxForm from "./taxForm";
import TaxList from "./taxList";
import "./styles/taxRate.css";

export default function TaxRate() {
  const [taxRates, setTaxRates] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTax, setCurrentTax] = useState(null);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch tax rates with current query parameters
  const fetchTaxRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getTaxRates(queryParams);

      // Handle both paginated and non-paginated responses
      if (response.data) {
        setTaxRates(Array.isArray(response.data) ? response.data : []);
        setPagination(response.pagination || null);
      } else if (Array.isArray(response)) {
        setTaxRates(response);
        setPagination(null);
      } else {
        setTaxRates([]);
        setPagination(null);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        setError(error);
        console.error("Error fetching tax rates:", error);
        toast.error("Failed to load tax rates");
      } else {
        setTaxRates([]);
        setPagination(null);
      }
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  // Fetch tax rates on mount and when query params change
  useEffect(() => {
    fetchTaxRates();
  }, [fetchTaxRates]);

  // Handle tax rate deletion
  const handleDelete = async (taxId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this tax rate? This action cannot be undone."
    );

    if (!confirmed) return;

    const originalRates = [...taxRates];
    const originalPagination = { ...pagination };

    // Optimistic update
    setTaxRates(taxRates.filter((rate) => rate._id !== taxId));

    if (pagination) {
      setPagination({
        ...pagination,
        totalItems: pagination.totalItems - 1,
      });
    }

    try {
      await deleteTaxRate(taxId);
      toast.success("Tax rate deleted successfully");

      // Refetch to get accurate pagination
      fetchTaxRates();
    } catch (error) {
      // Rollback on error
      setTaxRates(originalRates);
      setPagination(originalPagination);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to delete tax rate");
      }
      console.error("Error deleting tax rate:", error);
    }
  };

  // Handle tax rate deactivation (alternative to deletion)
  const handleDeactivate = async (taxId, reason) => {
    try {
      await deactivateTaxRate(taxId, reason);
      toast.success("Tax rate deactivated successfully");
      fetchTaxRates();
    } catch (error) {
      toast.error("Failed to deactivate tax rate");
      console.error("Error deactivating tax rate:", error);
    }
  };

  // Handle edit action
  const handleEdit = (tax) => {
    setCurrentTax(tax);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle save completion
  const handleSaveComplete = () => {
    fetchTaxRates();
    setCurrentTax(null);
  };

  // Handle filter changes
  const handleFilterChange = (filters) => {
    setQueryParams((prev) => ({
      ...prev,
      page: 1, // Reset to first page when filtering
      ...filters,
    }));
  };

  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage < 1 || (pagination && newPage > pagination.totalPages)) {
      return;
    }

    setQueryParams((prev) => ({
      ...prev,
      page: newPage,
    }));

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle sort changes
  const handleSortChange = (sortBy, sortOrder) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy,
      sortOrder,
    }));
  };

  return (
    <section className="taxRate">
      <div className="taxRate__header">
        <h2 className="taxRate__heading">Tax Rate Management</h2>
        <p className="taxRate__subtitle">
          Create and manage tax rates for different locations and product
          categories
        </p>
      </div>

      <div className="taxRate__main">
        {/* Tax Form Section */}
        <div className="taxRate__taxForm">
          <TaxForm
            currentTax={currentTax}
            onSaveComplete={handleSaveComplete}
          />

          {currentTax && (
            <button
              className="taxForm__cancel-btn"
              onClick={() => setCurrentTax(null)}
            >
              Cancel Edit
            </button>
          )}
        </div>

        {/* Tax List Section */}
        <div className="taxRate__taxList">
          <TaxList
            onDelete={handleDelete}
            onDeactivate={handleDeactivate}
            taxRates={taxRates}
            pagination={pagination}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onFilterChange={handleFilterChange}
            onPageChange={handlePageChange}
            onSortChange={handleSortChange}
          />
        </div>
      </div>
    </section>
  );
}
