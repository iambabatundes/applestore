import React, { useState, useEffect } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { paginate } from "../utils/paginate";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import { getPosts, deletePost } from "../../services/postService";
import PostTable from "./allPosts/postTable";
import "./allPosts/styles/post.css";
import PostHeader from "./allPosts/postHeader";

export default function AllPosts({ darkMode, adminUser }) {
  const [postData, setPostData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(4);
  const [sortColumn, setSortColumn] = useState({
    path: "createdAt",
    order: "desc",
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      const { data: posts } = await getPosts();
      const sortedPosts = _.orderBy(posts, ["createdAt"], ["desc"]);
      setPostData(sortedPosts);
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

  const handleEdit = (post) => {
    navigate(`/admin/create/${post._id}`);
  };

  let filtered = postData;
  if (searchQuery)
    filtered = postData.filter((b) =>
      b.title.toLowerCase().startsWith(searchQuery.toLowerCase())
    );

  let sorted = filtered;
  if (sortColumn.path) {
    sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
  } else {
    sorted = _.orderBy(filtered, ["createdAt"], ["desc"]);
  }

  const totalItems = filtered.length;
  const paginationEnabled = totalItems > 1;

  const allBlogPosts = paginationEnabled
    ? paginate(sorted, currentPage, pageSize)
    : sorted;

  return (
    <section className={`allPost__fade-in-up ${darkMode ? "dark-mode" : ""}`}>
      <PostHeader />

      <section className="padding" style={{ marginTop: 80 }}>
        <SearchBox onChange={handleSearch} value={searchQuery} />

        <p>
          Showing {totalItems} item{totalItems !== 1 ? "s" : ""}{" "}
        </p>

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
