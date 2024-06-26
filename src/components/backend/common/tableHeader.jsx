import React from "react";
import "./styles/table.css";

function TableHeader({ sortColumn, columns, onSort, className, thead, th }) {
  const raiseSort = (path) => {
    const sortColumns = { ...sortColumn };
    if (sortColumns.path === path)
      sortColumns.order = sortColumns.order === "asc" ? "desc" : "asc";
    else {
      sortColumns.path = path;
      sortColumns.order = "asc";
    }
    onSort(sortColumns);
  };

  const renderSortIcon = (column) => {
    if (column.path !== sortColumn.path) return null;

    return column.order === "asc" ? (
      <i className="fa fa-sort-asc" />
    ) : (
      <i className="fa fa-sort-desc" />
    );
  };

  return (
    <thead className={`${thead}`}>
      <tr className={`${className}`}>
        {columns.map((column) => (
          <th
            className={`${th}`}
            key={column.path || column.key}
            onClick={() => raiseSort(column.path)}
          >
            {column.label} {renderSortIcon(column)}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
