import React from "react";
import _ from "lodash";

function renderCell(item, column) {
  if (column.content) return column.content(item);

  return _.get(item, column.path);
}

function createKey(item, column) {
  return item._id + (column.path || column.key);
}

function TableBody({ data, columns }) {
  return (
    <tbody>
      {data.map((item) => (
        <tr key={item._id}>
          {columns.map((column) => (
            <td key={createKey(item, column)}>
              {renderCell(item, column)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;
