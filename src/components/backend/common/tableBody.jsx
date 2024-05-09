import React from "react";
import _ from "lodash";

import "./styles/table.css";

function renderCell(item, column) {
  if (column.content) return column.content(item);

  // If the column path is "description" and the description is empty, display "-"
  if (column.path === "description" && !item.description) {
    return "—";
  }

  if (column.path === "category") {
    return item.category.name;
  }

  if (column.path === "featureImage") {
    return item.featureImage.filename;
  }

  if (column.path === "tags") {
    return item.tags.map((tag) => tag.name).join(", ");
  }

  return _.get(item, column.path);
}

function createKey(item, column) {
  return item._id + (column.path || column.key);
}

function TableBody({ data, columns }) {
  return (
    <tbody>
      {data.map((item) => (
        <tr key={item._id} className="tableBody">
          {columns.map((column) => (
            <td key={createKey(item, column)}>{renderCell(item, column)}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;
