import React from "react";

export default function CouponList({ coupons }) {
  return (
    <div className="coupon-list-container">
      <h2>Coupon List</h2>
      {coupons.length === 0 ? (
        <p>No coupons available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount Percentage</th>
              <th>Expiration Date</th>
              <th>Usage Limit</th>
              <th>Minimum Order</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon.code}</td>
                <td>{coupon.discountPercentage}%</td>
                <td>{new Date(coupon.expirationDate).toLocaleDateString()}</td>
                <td>{coupon.usageLimit}</td>
                <td>${coupon.minimumOrderAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
