// EmptyOrders.jsx
import React from "react";
import { Package, ShoppingCart, TrendingUp, Search } from "lucide-react";
import "./styles/emptyOrders.css";

const EmptyOrders = ({ hasSearchQuery = false, onCreateOrder }) => {
  if (hasSearchQuery) {
    return (
      <div className="empty-state-container">
        <div className="search-icon-wrapper">
          <div className="search-icon-circle">
            <Search className="search-icon" />
          </div>
        </div>
        <h3 className="empty-state-title">No Orders Found</h3>
        <p className="empty-state-description">
          We couldn't find any orders matching your search criteria. Try
          adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <div className="empty-orders-container">
      <div className="icon-group">
        <div className="icon-glow"></div>
        <div className="main-icon-circle">
          <Package className="package-icon" strokeWidth={1.5} />
        </div>
        <div className="secondary-icon-circle">
          <ShoppingCart className="cart-icon-small" />
        </div>
      </div>

      <h2 className="main-title">No Orders Yet</h2>

      <p className="main-description">
        Your order dashboard is ready and waiting. Start creating orders to
        track shipments, manage inventory, and grow your business.
      </p>

      <button onClick={onCreateOrder} className="create-order-button">
        <ShoppingCart className="button-icon" />
        Create Your First Order
      </button>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper feature-icon-blue">
            <Package className="feature-icon" />
          </div>
          <h3 className="feature-title">Track Orders</h3>
          <p className="feature-description">
            Monitor all your orders in real-time with detailed tracking
            information.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper feature-icon-purple">
            <TrendingUp className="feature-icon" />
          </div>
          <h3 className="feature-title">Analyze Performance</h3>
          <p className="feature-description">
            Get insights into your sales trends and order patterns.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper feature-icon-green">
            <ShoppingCart className="feature-icon" />
          </div>
          <h3 className="feature-title">Manage Efficiently</h3>
          <p className="feature-description">
            Streamline your workflow with powerful order management tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyOrders;
