import React, { useState } from "react";
import "../styles/shippingDetails.css";

export default function Details() {
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const toggleRefundModal = () => {
    setShowRefundModal(!showRefundModal);
  };

  const togglePaymentModal = () => {
    setShowPaymentModal(!showPaymentModal);
  };

  return (
    <section className="details__main">
      <div className="details__refund-main">
        <span>Return</span>
        <span
          className="details__refund"
          onMouseEnter={() => setShowRefundModal(true)}
          onMouseLeave={() => setShowRefundModal(false)}
        >
          30-day refund/replacement
        </span>
        {showRefundModal && (
          <div className="detailModal__refund">
            <h1 className="detailModal-refund">30-day refund/replacement</h1>
            <button className="close-button" onClick={toggleRefundModal}>
              ✕
            </button>

            <p>
              This item can be returned in its original condition for a full
              refund or replacement within 30 days of receipt.
              <span>Read full return policy</span>
            </p>
          </div>
        )}
      </div>

      <div className="details__payment-main">
        <span>Payment</span>
        <span
          className="details__payment"
          onMouseEnter={() => setShowPaymentModal(true)}
          onMouseLeave={() => setShowPaymentModal(false)}
        >
          Secure Transaction
        </span>
        {showPaymentModal && (
          <div className="detailModal__payment">
            <h1 className="detailModal-refund">Secure Transaction</h1>
            <button className="close-button" onClick={togglePaymentModal}>
              ✕
            </button>

            <p>
              Your transaction is secure. We work hard to protect your security
              and privacy. Our payment security system encrypts your information
              during transmission. We don't share your credit card details with
              third-party sellers, and we don't sell your information to others.
              <span>Learn more</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
