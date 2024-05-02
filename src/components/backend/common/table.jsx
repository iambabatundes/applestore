import React from "react";
import TableHeader from "./tableHeader";
import TableBody from "./tableBody";

export default function Table({ columns, onSort, sortColumn, data }) {
  return (
    <table className="allPost-table post-list">
      <TableHeader columns={columns} onSort={onSort} sortColumn={sortColumn} />
      <TableBody columns={columns} data={data} />
    </table>
  );
}
