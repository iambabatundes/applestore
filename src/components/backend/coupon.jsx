import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CouponForm from "./coupons/couponForm";
import CouponList from "./coupons/couponList";
import {
  getCoupons,
  saveCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../services/couponService";
import "./styles/coupon.css";

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data: coupons } = await getCoupons();
      setCoupons(coupons);
    } catch (error) {
      setError(error);
      toast.error("Error fetching coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCoupon = async (newCoupon) => {
    try {
      await saveCoupon(newCoupon);
      toast.success("Coupon added successfully!");
      fetchCoupons(); // Refetch coupons to update the list
    } catch (error) {
      console.log(error);
      toast.error("Error saving coupon");
    }
  };

  const handleEditCoupon = async (couponId, updatedCoupon) => {
    try {
      await updateCoupon(couponId, updatedCoupon);
      toast.success("Coupon updated successfully!");
      fetchCoupons();
      setSelectedCoupon(null);
    } catch (error) {
      console.log(error);
      toast.error("Error updating coupon");
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      await deleteCoupon(couponId); // Soft delete the coupon
      toast.success("Coupon deleted successfully!");
      fetchCoupons(); // Refetch coupons to update the list
    } catch (error) {
      console.log(error);
      toast.error("Error deleting coupon");
    }
  };

  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon); // Set coupon for editing
  };

  return (
    <section className="coupon-container">
      <div className="coupon-form-section">
        <CouponForm
          // onSaveComplete={handleAddCoupon}
          onAddCoupon={handleAddCoupon}
          onEditCoupon={handleEditCoupon}
          selectedCoupon={selectedCoupon}
        />
      </div>

      <div className="coupon-list-section">
        <CouponList
          coupons={coupons}
          error={error}
          loading={loading}
          onEdit={handleSelectCoupon}
          onDelete={handleDeleteCoupon}
        />
      </div>
    </section>
  );
}
