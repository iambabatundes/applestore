import React from "react";
import "./styles/order.css";
import Table from "../common/table";

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
    { label: "Price", path: "price" },
    { label: "Items", path: "items" },
    { label: "Date", path: "orderDate" },
    { label: "User", path: "user" },
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
      content: (post) => (
        <section className="order__icon">
          <i className="fa fa-edit edit-icon" onClick={() => onEdit(post)}></i>
          <i
            className="fa fa-eye view-icon"
            onClick={() => onPreview(post)}
          ></i>
          <i
            className="fa fa-trash delete-icon"
            onClick={() => onDelete(post)}
          ></i>
        </section>
      ),
    },
  ];

  return (
    <section>
      <Table
        className="orderTable"
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
