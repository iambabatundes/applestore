import React from "react";

export default function Coupon({ couponCode, setCouponCode, applyCoupon }) {
  return (
    <section>
      <div>
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter coupon code"
        />
        <button onClick={applyCoupon}>Apply Coupon</button>
      </div>
    </section>
  );
}
