import React, { useState, useEffect } from "react";
import _ from "lodash";

// import "./styles/posts.css";
import "../backend/styles/dataTable.css";
import { paginate } from "../utils/paginate";
import TableData from "./common/tableData";
import Header from "./common/header";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";

export default function AllPosts({ blogPosts, setBlogPosts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [sortColumn, setSortColumn] = useState({ path: "title", order: "asc" });
  const [selectedDate, setSelectedDate] = useState("All Dates");

  const [postTrash, setPostTrash] = useState([]);

  useEffect(() => {
    // Update the trash posts whenever the blogPosts change
    const updatedTrashPosts = blogPosts.filter(
      (post) => post && post.status === "trash"
    );
    setPostTrash(updatedTrashPosts);
  }, [blogPosts]);

  function handleSort(sortColumns) {
    setSortColumn(sortColumns);
  }

  function handleSearch(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handleDelete() {}
  function handlePreview() {}
  function handleEdit() {}

  let filtered = blogPosts;
  if (searchQuery)
    filtered = blogPosts.filter((b) =>
      b.title.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

  const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

  const totalItems = filtered.length;
  const paginationEnabled = totalItems > 1; // Enable pagination if more than one item

  const allblogPosts = paginationEnabled
    ? paginate(sorted, currentPage, pageSize)
    : sorted;

  // const allblogPosts = paginate(sorted, currentPage, pageSize);

  return (
    <section className="dataTable">
      <Header headerTitle="Posts" buttonTitle="Add New" to="/admin/create" />

      <SearchBox onChange={handleSearch} value={searchQuery} />

      <p>
        Showing {totalItems} item{totalItems !== 1 ? "s" : ""}{" "}
      </p>

      <section>
        <TableData
          currentPosts={allblogPosts}
          sortColumn={sortColumn}
          onSort={handleSort}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onPreview={handlePreview}
        />

        <Pagination
          itemsCount={filtered.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </section>
    </section>
  );
}
