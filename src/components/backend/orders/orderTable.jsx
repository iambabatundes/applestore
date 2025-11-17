// ENHANCED ORDER TABLE (OrderTable.jsx)

import React, { useState } from "react";
import "./styles/order.css";
import "./styles/orderTable.css";
import Table from "../common/table";
import config from "../../../config.json";

export default function OrderTable({
  onEdit,
  onDelete,
  onPreview,
  data,
  onSort,
  sortColumn,
  onStatusChange,
  onRefund,
  onCreateShippingLabel,
  onTrackShipment,
}) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedOrders, setSelectedOrders] = useState(new Set());

  const toggleRowExpansion = (orderId) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const toggleOrderSelection = (orderId) => {
    setSelectedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedOrders.size === data.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(data.map((order) => order._id)));
    }
  };

  const formatCurrency = (amount) => {
    return `$${(amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: "status-pending",
      confirmed: "status-confirmed",
      processing: "status-processing",
      shipped: "status-shipped",
      delivered: "status-delivered",
      cancelled: "status-cancelled",
      refunded: "status-refunded",
      partially_refunded: "status-partial-refund",
    };
    return statusClasses[status] || "status-default";
  };

  const columns = [
    // Checkbox column
    {
      label: (
        <input
          type="checkbox"
          checked={selectedOrders.size === data.length && data.length > 0}
          onChange={toggleSelectAll}
          className="order-checkbox"
        />
      ),
      content: (order) => (
        <input
          type="checkbox"
          checked={selectedOrders.has(order._id)}
          onChange={() => toggleOrderSelection(order._id)}
          className="order-checkbox"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },

    // Order Number with expand button
    {
      label: "Order ID",
      path: "orderNumber",
      content: (order) => (
        <div className="order-number-cell">
          <button
            className="expand-btn"
            onClick={() => toggleRowExpansion(order._id)}
            title={expandedRows.has(order._id) ? "Collapse" : "Expand"}
          >
            <i
              className={`fa fa-chevron-${
                expandedRows.has(order._id) ? "down" : "right"
              }`}
            ></i>
          </button>
          <span onClick={() => onPreview(order)} className="order-number-link">
            {order.orderNumber}
          </span>
          {order.trackingNumber && (
            <div className="order-tracking-info">
              <i className="fa fa-truck"></i>
              <span>{order.trackingNumber}</span>
            </div>
          )}
        </div>
      ),
    },

    // Date
    {
      label: "Date",
      path: "createdAt",
      content: (order) => (
        <div className="order-date-cell">
          <span className="order-date">{formatDate(order.createdAt)}</span>
          <span className="order-time">
            {new Date(order.createdAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ),
    },

    // Customer
    {
      label: "Customer",
      path: "user.username",
      content: (order) => (
        <div className="orderItem__user-info">
          <div>
            {order.user.profileImage ? (
              <img
                src={`${config.mediaUrl}/uploads/${order.user.profileImage.filename}`}
                alt={order.user.username}
                className="OrderItem__user-image"
              />
            ) : (
              <div className="OrderItem__user-placeholder">
                {order.user.firstName?.[0] || order.user.username[0]}
              </div>
            )}
          </div>
          <section className="orderItem__user-main">
            <span className="orderItem__user-username">
              {order.user.firstName && order.user.lastName
                ? `${order.user.firstName} ${order.user.lastName}`
                : order.user.username}
            </span>
            <span className="orderItem__user-email">{order.user.email}</span>
            {order.user.phoneNumber && (
              <span className="orderItem__user-phone">
                {order.user.phoneNumber}
              </span>
            )}
          </section>
        </div>
      ),
    },

    // Items count
    {
      label: "Items",
      path: "items",
      content: (order) => (
        <div className="order-items-summary">
          <span className="items-count">
            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
          <span className="items-products">
            {order.items.length} product{order.items.length !== 1 ? "s" : ""}
          </span>
        </div>
      ),
    },

    // Total with breakdown
    {
      label: "Total",
      path: "total",
      content: (order) => (
        <div className="order-total-cell">
          <span className="order-total-amount">
            {formatCurrency(order.total)}
          </span>
          {order.totalRefunded > 0 && (
            <span className="order-refund-info">
              Refunded: {formatCurrency(order.totalRefunded)}
            </span>
          )}
          {order.discount > 0 && (
            <span className="order-discount-info">
              Saved: {formatCurrency(order.discount)}
            </span>
          )}
        </div>
      ),
    },

    // Status badges
    {
      label: "Status",
      path: "orderStatus",
      content: (order) => (
        <div className="order-status-cell">
          <span
            className={`order-status-badge ${getStatusClass(
              order.orderStatus
            )}`}
          >
            {order.orderStatus.replace("_", " ")}
          </span>
          <span
            className={`payment-status-badge ${getStatusClass(
              order.paymentStatus
            )}`}
          >
            {order.paymentStatus}
          </span>
        </div>
      ),
    },

    // Actions
    {
      label: "Actions",
      content: (order) => (
        <section className="order__icon">
          {/* View Details */}
          <button
            className="action-btn view-btn"
            onClick={() => onPreview(order)}
            title="View Details"
          >
            <i className="fa fa-eye"></i>
          </button>

          {/* Update Status */}
          {order.orderStatus !== "delivered" &&
            order.orderStatus !== "cancelled" && (
              <button
                className="action-btn edit-btn"
                onClick={() => onEdit(order)}
                title="Update Status"
              >
                <i className="fa fa-edit"></i>
              </button>
            )}

          {/* Track Shipment */}
          {order.trackingNumber && onTrackShipment && (
            <button
              className="action-btn track-btn"
              onClick={() => onTrackShipment(order)}
              title="Track Shipment"
            >
              <i className="fa fa-shipping-fast"></i>
            </button>
          )}

          {/* Create Shipping Label */}
          {!order.trackingNumber &&
            order.orderStatus === "processing" &&
            onCreateShippingLabel && (
              <button
                className="action-btn ship-btn"
                onClick={() => onCreateShippingLabel(order)}
                title="Create Shipping Label"
              >
                <i className="fa fa-tag"></i>
              </button>
            )}

          {/* Process Refund */}
          {order.paymentStatus === "completed" &&
            order.totalRefunded < order.total &&
            onRefund && (
              <button
                className="action-btn refund-btn"
                onClick={() => onRefund(order)}
                title="Process Refund"
              >
                <i className="fa fa-undo"></i>
              </button>
            )}

          {/* Delete */}
          <button
            className="action-btn delete-btn"
            onClick={() => onDelete(order)}
            title="Delete Order"
          >
            <i className="fa fa-trash"></i>
          </button>

          {/* More Actions Dropdown */}
          <div className="action-dropdown">
            <button className="action-btn more-btn" title="More Actions">
              <i className="fa fa-ellipsis-v"></i>
            </button>
          </div>
        </section>
      ),
    },
  ];

  return (
    <section className="order-table-container">
      <Table
        columns={columns}
        data={data}
        onSort={onSort}
        sortColumn={sortColumn}
        table="order-table"
        thead="order-thead"
        tbody="order-tbody"
        tbodyTr="order-tbody-tr"
        th="order-th"
        td="order-td"
      />

      {data.map(
        (order) =>
          expandedRows.has(order._id) && (
            <div key={`expanded-${order._id}`} className="order-expanded-row">
              <div className="expanded-content">
                {/* Order Items */}
                <div className="expanded-section">
                  <h4>Order Items</h4>
                  <div className="expanded-items-list">
                    {order.items.map((item) => (
                      <div key={item._id} className="expanded-item">
                        {item.product.featureImage &&
                        item.product.featureImage.filename ? (
                          <img
                            src={`${config.mediaUrl}/uploads/${item.product.featureImage.filename}`}
                            alt={
                              item.product.featureImage.originalName || "Item"
                            }
                            className="expanded-item-image"
                          />
                        ) : (
                          <div className="expanded-item-placeholder">
                            <i className="fa fa-image"></i>
                          </div>
                        )}
                        <div className="expanded-item-details">
                          <span className="item-name">{item.product.name}</span>
                          <span className="item-price">
                            {formatCurrency(item.price)} × {item.quantity}
                          </span>
                        </div>
                        <div className="expanded-item-total">
                          {formatCurrency(item.totalPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="expanded-section">
                  <h4>Shipping Address</h4>
                  <div className="expanded-address">
                    <p>
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.street}</p>
                    {order.shippingAddress.street2 && (
                      <p>{order.shippingAddress.street2}</p>
                    )}
                    <p>
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                    {order.shippingAddress.phoneNumber && (
                      <p>
                        <i className="fa fa-phone"></i>{" "}
                        {order.shippingAddress.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="expanded-section">
                  <h4>Order Summary</h4>
                  <div className="expanded-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order.subtotal)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="summary-row discount">
                        <span>Discount:</span>
                        <span>-{formatCurrency(order.discount)}</span>
                      </div>
                    )}
                    <div className="summary-row">
                      <span>Tax:</span>
                      <span>{formatCurrency(order.tax)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Shipping:</span>
                      <span>{formatCurrency(order.shippingFee)}</span>
                    </div>
                    {order.totalRefunded > 0 && (
                      <div className="summary-row refunded">
                        <span>Refunded:</span>
                        <span>-{formatCurrency(order.totalRefunded)}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                    {order.totalRefunded > 0 && (
                      <div className="summary-row net-total">
                        <span>Net Total:</span>
                        <span>
                          {formatCurrency(order.total - order.totalRefunded)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tracking Info */}
                {order.trackingNumber && (
                  <div className="expanded-section">
                    <h4>Tracking Information</h4>
                    <div className="expanded-tracking">
                      <p>
                        <strong>Carrier:</strong> {order.shippingCarrier}
                      </p>
                      <p>
                        <strong>Tracking Number:</strong> {order.trackingNumber}
                      </p>
                      {onTrackShipment && (
                        <button
                          className="track-shipment-btn"
                          onClick={() => onTrackShipment(order)}
                        >
                          <i className="fa fa-search-location"></i> Track
                          Shipment
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
      )}
    </section>
  );
}
