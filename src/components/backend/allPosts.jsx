import React, { useState, useEffect } from "react";
import "./styles/posts.css";
import Filtered from "./allPosts/filtered";
import TableData from "./common/tableData";
import BulkAction from "./allPosts/bulkAction";
import Header from "./common/header";

export default function AllPosts({ blogPosts, setBlogPosts }) {
  const [sortBy, setSortBy] = useState({ column: "title", order: "asc" });
  const [selectAll, setSelectAll] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(2);
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBulkAction, setSelectedBulkAction] = useState("-1");
  const [postTrash, setPostTrash] = useState([]);

  const [sortColumn, setSortColumn] = useState({ path: "title", order: "asc" });

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

  function handleDelete() {}
  function handlePreview() {}
  function handleEdit() {}

  return (
    <section className="allPost">
      <Header headerTitle="Posts" buttonTitle="Add New" to="/admin/create" />

      <section>
        <TableData
          currentPosts={blogPosts}
          sortBy={sortBy}
          sortColumn={sortColumn}
          onSort={handleSort}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onPreview={handlePreview}
        />
      </section>
      {/* <div className="pagination">{renderPageNumbers}</div> */}
    </section>
  );
}
