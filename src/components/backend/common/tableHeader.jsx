import React from "react";
import "./styles/table.css";

function TableHeader({ sortColumn, columns, onSort, className, thead, th }) {
  const raiseSort = (path) => {
    if (!path) return;

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

    return sortColumn.order === "asc" ? (
      <i className="fa fa-sort-asc" aria-hidden="true" />
    ) : (
      <i className="fa fa-sort-desc" aria-hidden="true" />
    );
  };

  return (
    <thead className={`${thead}`}>
      <tr className={`${className}`}>
        {columns.map((column, index) => (
          <th
            className={`${th}`}
            key={column.path || column.key || `col-${index}`} // Fixed: added index fallback
            onClick={() => column.path && raiseSort(column.path)} // Only make sortable if column has path
            style={{
              cursor: column.path ? "pointer" : "default",
              userSelect: column.path ? "none" : "auto",
            }}
          >
            {column.label} {column.path && renderSortIcon(column)}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
