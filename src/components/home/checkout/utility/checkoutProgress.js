// CheckoutProgress.js
import React from "react";

export default function CheckoutProgress({ currentStep }) {
  const steps = [
    { number: 1, label: "Address" },
    { number: 2, label: "Payment" },
    { number: 3, label: "Review" },
  ];

  return (
    <div className="checkout-progress">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`progress-step ${
            currentStep === step.number
              ? "active"
              : currentStep > step.number
              ? "completed"
              : ""
          }`}
        >
          <div className="progress-circle">
            {currentStep > step.number ? (
              <i className="fa fa-check"></i>
            ) : (
              step.number
            )}
          </div>
          <div className="progress-label">{step.label}</div>
        </div>
      ))}
    </div>
  );
}
