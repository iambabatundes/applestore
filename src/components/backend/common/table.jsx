import React from "react";

import "../../backend/styles/dataTable.css";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

export default function Table({
  columns,
  onSort,
  sortColumn,
  data,
  className,
  table,
  th,
  thead,
  tbody,
  td,
  tbodyTr,
}) {
  return (
    // <table className={`${table} dataTable-table post-list`}>
    <table className={`${table}`}>
      <TableHeader
        className={`${className}`}
        columns={columns}
        onSort={onSort}
        sortColumn={sortColumn}
        th={th}
        thead={thead}
      />
      <TableBody
        columns={columns}
        data={data}
        tbody={tbody}
        tbodyTr={tbodyTr}
        td={td}
      />
    </table>
  );
}
