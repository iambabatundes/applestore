import React, { useState, useEffect } from "react";
import _ from "lodash";

// import "./styles/posts.css";
import "../backend/styles/dataTable.css";
import { paginate } from "../utils/paginate";
import TableData from "./common/tableData";
import Header from "./common/header";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import { getPost, getPosts } from "../../services/postService";
import PostTable from "./allPosts/postTable";

export default function AllPosts() {
  const [postData, setPostData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [sortColumn, setSortColumn] = useState({ path: "title", order: "asc" });
  const [selectedDate, setSelectedDate] = useState("All Dates");

  // const [postTrash, setPostTrash] = useState([]);

  useEffect(() => {
    async function getPost() {
      const { data: postData } = await getPosts();
      setPostData(postData);
    }

    getPost();
  }, []);

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

  let filtered = postData;
  if (searchQuery)
    filtered = postData.filter((b) =>
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
        <PostTable
          data={allblogPosts}
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
