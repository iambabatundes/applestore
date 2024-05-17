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
}) {
  const columns = [
    {
      label: "Order ID",
      path: "orderNumber",
      content: (order) => (
        <span
          onClick={() => onPreview(order)}
          style={{ cursor: "pointer", color: "blue" }}
        >
          {order.orderNumber}
        </span>
      ),
    },

    { label: "Price", path: "price" },
    { label: "Items", path: "items" },
    { label: "Date", path: "orderDate" },
    { label: "User", path: "user" },
    { label: "Status", path: "status" },

    {
      content: (post) => (
        <section className="order__icon">
          <i
            className="fa fa-edit"
            aria-hidden="true"
            onClick={() => onEdit(post)}
          ></i>
          <i
            className="fa fa-eye"
            aria-hidden="true"
            onClick={() => onPreview(post)}
          ></i>
          <i
            className="fa fa-trash"
            aria-hidden="true"
            onClick={() => onDelete(post)}
          ></i>
        </section>
      ),
    },

    // Add more headings as needed
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
