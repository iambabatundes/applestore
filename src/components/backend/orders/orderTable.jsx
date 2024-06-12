import React from "react";
import "./styles/order.css";
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
}) {
  const columns = [
    {
      label: "Order ID",
      path: "orderNumber",
      content: (order) => (
        <span onClick={() => onPreview(order)} className="order-number">
          {order.orderNumber}
        </span>
      ),
    },

    { label: "Date", path: "createdAt" },

    {
      label: "Items",
      path: "items",
      content: (order) => (
        <ul className="orderItem__item-main">
          {order.items.map((item) => (
            <li key={item._id} className="orderItem-item">
              {item.product.featureImage &&
              item.product.featureImage.filename ? (
                <img
                  src={`${config.mediaUrl}/uploads/${item.product.featureImage.filename}`}
                  alt={item.product.featureImage.originalName || "Item Image"}
                  className="orderItem-image"
                />
              ) : (
                <span className="no-image">No image</span>
              )}
              <span className="orderItem__items">
                {item.product.name} (Qty: {item.quantity}){" "}
                <span className="orderItem__product_price">
                  ($
                  {item.product.price})
                </span>
              </span>
            </li>
          ))}
        </ul>
      ),
    },

    {
      label: "Total",
      path: "total",
      content: (order) => (
        <span className="orderItem__order-total">{`$${order.total.toFixed(
          2
        )}`}</span>
      ),
    },

    {
      label: "Customer",
      path: "user.username",
      content: (order) => (
        <div className="orderItem__user-info">
          <div>
            {order.user.profileImage && (
              <img
                src={`${config.mediaUrl}/uploads/${order.user.profileImage.filename}`}
                alt={order.user.username}
                className="OrderItem__user-image"
              />
            )}
          </div>
          <section className="orderItem__user-main">
            <span className="orderItem__user-username">
              {order.user.username}
            </span>
            <span className="orderItem__user-orderNumber">
              {order.orderNumber}
            </span>
          </section>
        </div>
      ),
    },
    {
      label: "Status",
      path: "status",
      content: (order) => (
        <select
          value={order.status}
          onChange={(e) => onStatusChange(order, e.target.value)}
          className="status-dropdown"
        >
          <option value="pending">Pending</option>
          <option value="successful">Successful</option>
          <option value="shipping">Shipping</option>
          <option value="failed">Failed</option>
        </select>
      ),
    },
    {
      content: (order) => (
        <section className="order__icon">
          <i className="fa fa-edit edit-icon" onClick={() => onEdit(order)}></i>
          <i
            className="fa fa-eye view-icon"
            onClick={() => onPreview(order)}
          ></i>
          <i
            className="fa fa-trash delete-icon"
            onClick={() => onDelete(order)}
          ></i>
        </section>
      ),
    },
  ];

  return (
    <section>
      <Table
        columns={columns}
        data={data}
        onSort={onSort}
        sortColumn={sortColumn}
        table="Ordertable__className"
        thead="orderThead__className"
        tbody="orderTbody__className"
        tbodyTr="orderTbodyTr"
        th="orderTh"
        td="orderTd"
      />
    </section>
  );
}
