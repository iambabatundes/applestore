import React from "react";
import { Package, Loader2 } from "lucide-react";
import "./styles/loadingOrder.css";

const LoadingOrders = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-icon-group">
          <div className="loading-pulse-circle loading-pulse-1"></div>
          <div className="loading-pulse-circle loading-pulse-2"></div>
          <div className="loading-pulse-circle loading-pulse-3"></div>

          <div className="loading-main-circle">
            <Package className="loading-package-icon" strokeWidth={1.5} />
          </div>

          <div className="loading-spinner-wrapper">
            <Loader2 className="loading-spinner" />
          </div>
        </div>

        <h3 className="loading-title">Loading Orders</h3>
        <p className="loading-description">
          Please wait while we fetch your order data...
        </p>

        <div className="loading-dots">
          <span className="loading-dot loading-dot-1"></span>
          <span className="loading-dot loading-dot-2"></span>
          <span className="loading-dot loading-dot-3"></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingOrders;
