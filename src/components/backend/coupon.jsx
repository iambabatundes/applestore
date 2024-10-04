import React, { useState, useEffect } from "react";
import { toast } from "react-toastify"; // Toast notifications for real-time feedback
import "react-toastify/dist/ReactToastify.css";

import CouponForm from "./coupons/couponForm";
import CouponList from "./coupons/couponList";
import { getCoupons, saveCoupon } from "../../services/couponService";
import "./styles/coupon.css";

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchCoupons();
    // saveCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true); // Show loading spinner
      const { data: coupons } = await getCoupons();
      setCoupons(coupons);
    } catch (error) {
      toast.error("Error fetching coupons");
    } finally {
      setLoading(false); // Hide spinner once data is fetched
    }
  };

  const handleAddCoupon = async (newCoupon) => {
    try {
      await saveCoupon(newCoupon);
      toast.success("Coupon added successfully!");
      fetchCoupons(); // Refetch coupons to update the list
    } catch (error) {
      toast.error("Error saving coupon");
    }
  };

  return (
    <section className="coupon-container">
      <div className="coupon-form-section">
        <CouponForm onAddCoupon={handleAddCoupon} />
      </div>

      <div className="coupon-list-section">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <CouponList coupons={coupons} />
        )}
      </div>
    </section>
  );
}
