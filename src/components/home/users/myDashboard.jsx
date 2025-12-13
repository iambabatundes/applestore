import React, { useEffect, useState } from "react";
import {
  FaShoppingBag,
  FaDollarSign,
  FaBox,
  FaClock,
  FaStar,
  FaTruck,
  FaCheckCircle,
  FaHeart,
  FaSpinner,
  FaExclamationTriangle,
  FaShoppingCart,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../../../services/orderService";
import { getTopProducts } from "../../../services/topProductService";
import config from "../../../config.json";
import "./styles/myDashboard.css";

export default function MyDashboard({ user, addToCart, cartItems }) {
  const navigate = useNavigate();

  // State management
  const [stats, setStats] = useState({
    totalSpent: 0,
    completedOrders: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch user orders
        const ordersResponse = await getUserOrders();
        const { totalSpent, completedOrders, totalOrders, orders } =
          ordersResponse;

        // Calculate pending orders
        const pendingOrders =
          orders?.filter(
            (order) =>
              order.orderStatus === "pending" ||
              order.orderStatus === "processing"
          ).length || 0;

        setStats({
          totalSpent: totalSpent || 0,
          completedOrders: completedOrders || 0,
          totalOrders: totalOrders || 0,
          pendingOrders,
        });

        // Get latest 5 orders
        setRecentOrders(orders?.slice(0, 5) || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // Fetch top products
  useEffect(() => {
    async function fetchTopProducts() {
      try {
        setProductsLoading(true);
        const response = await getTopProducts();
        setTopProducts(response.data || []);
      } catch (err) {
        console.error("Error fetching top products:", err);
      } finally {
        setProductsLoading(false);
      }
    }

    fetchTopProducts();
  }, []);

  // Helper functions
  const getStatusIcon = (status) => {
    const statusMap = {
      delivered: <FaCheckCircle />,
      shipped: <FaTruck />,
      processing: <FaClock />,
      pending: <FaClock />,
      cancelled: <FaExclamationTriangle />,
    };
    return statusMap[status?.toLowerCase()] || <FaBox />;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      delivered: "#28a745",
      shipped: "#667eea",
      processing: "#ffc107",
      pending: "#ff9800",
      cancelled: "#dc3545",
    };
    return colorMap[status?.toLowerCase()] || "#6c757d";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateOrderTotal = (items) => {
    return (
      items?.reduce((total, item) => {
        const price = item.product?.salePrice || item.product?.price || 0;
        return total + price * item.quantity;
      }, 0) || 0
    );
  };

  const handleAddToCart = (product) => {
    if (addToCart) {
      addToCart(product);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/users/my-orders?orderId=${orderId}`);
  };

  const handleViewAllOrders = () => {
    navigate("/users/my-orders");
  };

  const handleShopNow = () => {
    navigate("/");
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-loading">
        <FaSpinner className="spinner" />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-error">
        <FaExclamationTriangle className="error-icon" />
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const statsData = [
    {
      id: 1,
      title: "Total Orders",
      value: stats.totalOrders,
      change: "+12%",
      icon: FaShoppingBag,
      color: "#667eea",
      bg: "#e3e8ff",
    },
    {
      id: 2,
      title: "Total Spent",
      value: `$${stats.totalSpent.toFixed(2)}`,
      change: "+8%",
      icon: FaDollarSign,
      color: "#f093fb",
      bg: "#fce7f3",
    },
    {
      id: 3,
      title: "Pending Orders",
      value: stats.pendingOrders,
      change:
        stats.pendingOrders > 0 ? `${stats.pendingOrders} active` : "None",
      icon: FaClock,
      color: "#4facfe",
      bg: "#dbeafe",
    },
    {
      id: 4,
      title: "Completed",
      value: stats.completedOrders,
      change: `${stats.completedOrders} delivered`,
      icon: FaCheckCircle,
      color: "#28a745",
      bg: "#d4edda",
    },
  ];

  return (
    <div className="my-dashboard">
      {/* Welcome Banner */}
      <div className="dashboard-banner">
        <div className="banner-content">
          <h1>Welcome back, {user?.firstName || user?.username}! 👋</h1>
          <p>Here's what's happening with your orders today</p>
        </div>
        <div className="banner-actions">
          <button className="btn-track-order" onClick={handleViewAllOrders}>
            <FaTruck /> Track Orders
          </button>
          <button className="btn-shop-now" onClick={handleShopNow}>
            <FaShoppingBag /> Shop Now
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid-main">
        {statsData.map((stat) => (
          <div key={stat.id} className="stat-card">
            <div className="stat-icon" style={{ background: stat.bg }}>
              <stat.icon style={{ color: stat.color }} />
            </div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <div className="stat-value-row">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-change">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="dashboard-section recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <button className="view-all-link" onClick={handleViewAllOrders}>
              View All
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="empty-orders">
              <FaBox className="empty-icon" />
              <h3>No orders yet</h3>
              <p>Start shopping to see your orders here</p>
              <button className="btn-start-shopping" onClick={handleShopNow}>
                <FaShoppingCart /> Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {recentOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">
                      <FaBox className="order-icon" />
                      <span>#{order._id.slice(-8)}</span>
                    </div>
                    <span
                      className="order-status"
                      style={{ color: getStatusColor(order.orderStatus) }}
                    >
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="order-details">
                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Items:</span>
                      <span className="detail-value">
                        {order.items?.length || 0}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total:</span>
                      <span className="detail-value strong">
                        ${calculateOrderTotal(order.items).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="order-preview">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item._id} className="order-preview-item">
                          {item.product?.featureImage && (
                            <img
                              src={
                                typeof item.product.featureImage === "string"
                                  ? `${config.mediaUrl}/uploads/${item.product.featureImage}`
                                  : `${config.mediaUrl}/uploads/${item.product.featureImage.filename}`
                              }
                              alt={item.product.name}
                              className="preview-image"
                            />
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="preview-more">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    className="btn-view-order"
                    onClick={() => handleViewOrder(order._id)}
                  >
                    <FaEye /> View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions & Summary */}
        <div className="dashboard-section quick-actions">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="actions-grid">
            <button className="action-btn" onClick={handleShopNow}>
              <FaShoppingBag className="action-icon" />
              <span>Browse Products</span>
            </button>
            <button className="action-btn" onClick={handleViewAllOrders}>
              <FaTruck className="action-icon" />
              <span>Track Shipment</span>
            </button>
            <button
              className="action-btn"
              onClick={() => navigate("/users/my-profile")}
            >
              <FaHeart className="action-icon" />
              <span>My Wishlist</span>
            </button>
            <button
              className="action-btn"
              onClick={() => navigate("/users/my-orders")}
            >
              <FaStar className="action-icon" />
              <span>Write Review</span>
            </button>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-items">
              <div className="summary-item">
                <span>Total Orders</span>
                <span className="summary-value">{stats.totalOrders}</span>
              </div>
              <div className="summary-item">
                <span>Completed</span>
                <span className="summary-value">{stats.completedOrders}</span>
              </div>
              <div className="summary-item">
                <span>Pending</span>
                <span className="summary-value">{stats.pendingOrders}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-item summary-total">
                <span>Total Spent</span>
                <span className="summary-value">
                  ${stats.totalSpent.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Section */}
      <div className="dashboard-section recommended-products">
        <div className="section-header">
          <h2>Top Products for You</h2>
          <button className="view-all-link" onClick={handleShopNow}>
            View All
          </button>
        </div>

        {productsLoading ? (
          <div className="products-loading">
            <FaSpinner className="spinner" />
            <p>Loading products...</p>
          </div>
        ) : topProducts.length === 0 ? (
          <div className="empty-products">
            <FaBox className="empty-icon" />
            <p>No products available at the moment</p>
          </div>
        ) : (
          <div className="products-grid">
            {topProducts.slice(0, 6).map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img
                    src={
                      product.featureImage?.filename
                        ? `${config.mediaUrl}/uploads/${product.featureImage.filename}`
                        : product.featureImage
                        ? `${config.mediaUrl}/uploads/${product.featureImage}`
                        : "/placeholder-product.png"
                    }
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = "/placeholder-product.png";
                    }}
                  />
                  <button className="btn-wishlist">
                    <FaHeart />
                  </button>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-rating">
                    <FaStar className="star-filled" />
                    <span>{product.rating || 4.5}</span>
                  </div>
                  <div className="product-footer">
                    <div className="product-prices">
                      {product.salePrice &&
                      product.salePrice < product.price ? (
                        <>
                          <span className="product-price">
                            ${product.salePrice.toFixed(2)}
                          </span>
                          <span className="product-original-price">
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="product-price">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      className="btn-add-to-cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaShoppingCart /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
