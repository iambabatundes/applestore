import React from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";

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
        <>
          <i
            className="fa fa-edit"
            aria-hidden="true"
            onClick={() => onEdit(post)}
            style={{ cursor: "pointer" }}
          ></i>
          <i
            className="fa fa-eye"
            aria-hidden="true"
            onClick={() => onPreview(post)}
            style={{ cursor: "pointer" }}
          ></i>
          <i
            className="fa fa-trash"
            aria-hidden="true"
            onClick={() => onDelete(post)}
            style={{ cursor: "pointer" }}
          ></i>
        </>
      ),
    },

    // Add more headings as needed
  ];

  return (
    <section>
      <Table
        columns={columns}
        data={data}
        onSort={onSort}
        sortColumn={sortColumn}
      />
    </section>
  );
}
