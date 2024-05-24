import React, { useState, useEffect } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Add this import
import "../backend/styles/dataTable.css";
import { paginate } from "../utils/paginate";
import Header from "./common/header";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import { getPosts, deletePost } from "../../services/postService";
import PostTable from "./allPosts/postTable";

export default function AllPosts() {
  const [postData, setPostData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [sortColumn, setSortColumn] = useState({ path: "title", order: "asc" });
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    async function fetchPosts() {
      const { data: posts } = await getPosts();
      setPostData(posts);
    }

    fetchPosts();
  }, []);

  async function handleDelete(post) {
    const originalPosts = [...postData];
    const updatedPosts = originalPosts.filter((t) => t._id !== post._id);
    setPostData(updatedPosts);

    try {
      await deletePost(post._id);
      toast.success("Post deleted successfully");
    } catch (error) {
      if (error.response && error.response.status === 404)
        toast.error("This post has already been deleted");
      setPostData(originalPosts);
    }
  }

  function handleSort(sortColumn) {
    setSortColumn(sortColumn);
  }

  function handleSearch(query) {
    setSearchQuery(query);
    setCurrentPage(1);
  }

  function handlePreview() {}

  function handleEdit(post) {
    navigate("/admin/create", { state: { post } });
  }

  let filtered = postData;
  if (searchQuery)
    filtered = postData.filter((b) =>
      b.title.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

  const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

  const totalItems = filtered.length;
  const paginationEnabled = totalItems > 1;

  const allBlogPosts = paginationEnabled
    ? paginate(sorted, currentPage, pageSize)
    : sorted;

  return (
    <section className="dataTable">
      <Header headerTitle="Posts" buttonTitle="Add New" to="/admin/create" />

      <SearchBox onChange={handleSearch} value={searchQuery} />

      <p>
        Showing {totalItems} item{totalItems !== 1 ? "s" : ""}{" "}
      </p>

      <section>
        <PostTable
          data={allBlogPosts}
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
