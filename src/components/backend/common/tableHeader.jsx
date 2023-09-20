import React from "react";

export default function TableHeader({
  handleSelectAllChange,
  selectAll,
  handleSort,
  sortBy,
}) {
  return (
    <thead>
      <tr>
        <td scope="col" id="checkBox">
          <input
            type="checkbox"
            name="select-all"
            id="selectAll"
            checked={selectAll}
            onChange={handleSelectAllChange}
          />
        </td>
        <td
          id="title"
          scope="col"
          onClick={() => handleSort("title")}
          style={{ cursor: "pointer" }}
        >
          Title{" "}
          {sortBy.column === "title" && (
            <i className={`fa fa-sort-${sortBy.order}`} aria-hidden="true"></i>
          )}
        </td>
        <td scope="col" id="author">
          Author
        </td>
        <td id="catergories" scope="col">
          Categories
        </td>
        <td id="tag" scope="col">
          Tag
        </td>
        <td id="comment" scope="col">
          <span>
            <i className="fa fa-comment" aria-hidden="true"></i>
          </span>
        </td>
        <td
          id="date"
          scope="col"
          onClick={() => handleSort("date")}
          style={{ cursor: "pointer" }}
        >
          Date{" "}
          {sortBy.column === "date" && (
            <i className={`fa fa-sort-${sortBy.order}`} aria-hidden="true"></i>
          )}
        </td>
        <td id="featuredImage" scope="col">
          thumbnail
        </td>
      </tr>
    </thead>
  );
}
