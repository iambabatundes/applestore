import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
// import "../styles/pagination.css";
import "../../backend/common/styles/pagination.css";

function Pagination({ itemsCount, pageSize, onPageChange, currentPage }) {
  console.log(currentPage);
  const pagesCount = Math.ceil(itemsCount / pageSize);
  if (pagesCount === 1) return null;
  const pages = _.range(1, pagesCount + 1);

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        {pages.map((page) => (
          <li
            key={page}
            className={page === currentPage ? "page-item active" : "page-item"}
          >
            <Link className="page-link" onClick={() => onPageChange(page)}>
              {page}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Pagination;
