import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CouponForm from "./coupons/couponForm";
import CouponList from "./coupons/couponList";
import CouponFilters from "./coupons/couponFilters";

import {
  getCoupons,
  saveCoupon,
  updateCoupon,
  deleteCoupon,
  activateCoupon,
} from "../../services/couponService";
import "./styles/coupon.css";

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    isActive: undefined,
    discountType: "",
    startDate: "",
    endDate: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  // Fetch coupons with filters and pagination
  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Add filters only if they have values
      if (filters.search) params.search = filters.search;
      if (filters.isActive !== undefined) params.isActive = filters.isActive;
      if (filters.discountType) params.discountType = filters.discountType;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await getCoupons(params);

      setCoupons(response.data || []);

      if (response.pagination) {
        setPagination((prev) => ({
          ...prev,
          total: response.pagination.total,
          pages: response.pagination.pages,
        }));
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setError(error.response?.data?.message || "Failed to fetch coupons");
      toast.error(error.response?.data?.message || "Error fetching coupons");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Initial load
  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // Handle adding new coupon
  const handleAddCoupon = async (newCoupon) => {
    try {
      const response = await saveCoupon(newCoupon);
      toast.success("Coupon created successfully!");

      // Refresh data
      await Promise.all([fetchCoupons()]);

      return response;
    } catch (error) {
      console.error("Error creating coupon:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Failed to create coupon";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Handle editing coupon
  const handleEditCoupon = async (couponId, updatedCoupon) => {
    try {
      const response = await updateCoupon(couponId, updatedCoupon);
      toast.success("Coupon updated successfully!");

      // Clear selection and refresh
      setSelectedCoupon(null);
      await Promise.all([fetchCoupons()]);

      return response;
    } catch (error) {
      console.error("Error updating coupon:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        "Failed to update coupon";
      toast.error(errorMessage);
      throw error;
    }
  };

  // Handle coupon deletion (soft delete)
  const handleDeleteCoupon = async (couponId) => {
    setCouponToDelete(couponId);
    setShowDeleteDialog(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    try {
      await deleteCoupon(couponToDelete);
      toast.success("Coupon deactivated successfully!");

      // Clear selection if deleted coupon was selected
      if (selectedCoupon?._id === couponToDelete) {
        setSelectedCoupon(null);
      }

      // Refresh data
      await Promise.all([fetchCoupons()]);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error(
        error.response?.data?.message || "Failed to deactivate coupon"
      );
    } finally {
      setShowDeleteDialog(false);
      setCouponToDelete(null);
    }
  };

  // Cancel deletion
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setCouponToDelete(null);
  };

  // Handle coupon activation
  const handleActivateCoupon = async (couponId) => {
    try {
      await activateCoupon(couponId);
      toast.success("Coupon activated successfully!");

      // Refresh data
      await Promise.all([fetchCoupons()]);
    } catch (error) {
      console.error("Error activating coupon:", error);
      toast.error(error.response?.data?.message || "Failed to activate coupon");
    }
  };

  // Handle selecting coupon for editing
  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setSelectedCoupon(null);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Handle items per page change
  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1, // Reset to first page
    }));
  };

  return (
    <section className="coupon-container">
      {/* Form Section */}
      <div className="coupon-form-section">
        <CouponForm
          onAddCoupon={handleAddCoupon}
          onEditCoupon={handleEditCoupon}
          selectedCoupon={selectedCoupon}
          onCancelEdit={handleCancelEdit}
        />
      </div>

      {/* Filters Section */}
      <div className="coupon-filters-section">
        <CouponFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          totalResults={pagination.total}
        />
      </div>

      {/* List Section */}
      <div className="coupon-list-section">
        <CouponList
          coupons={coupons}
          error={error}
          loading={loading}
          onEdit={handleSelectCoupon}
          onDelete={handleDeleteCoupon}
          onActivate={handleActivateCoupon}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <ConfirmDialog
          title="Deactivate Coupon"
          message="Are you sure you want to deactivate this coupon? This action will make it unavailable for use but can be reactivated later."
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          confirmText="Deactivate"
          cancelText="Cancel"
          type="warning"
        />
      )}
    </section>
  );
}
